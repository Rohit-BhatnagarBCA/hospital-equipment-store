/**
 * API tests for auth, orders and analytics.
 *
 * HOW THESE TESTS WORK
 * Real MongoDB is not needed. Each repository's functions are replaced with
 * simple in-memory versions BEFORE any request is made. Because services call
 * `repository.someFunction()` at request time, the replacements are used.
 *
 * WHAT IS TESTED: routes, validation, JWT login, roles, business rules.
 * WHAT IS NOT TESTED: real MongoDB queries (including the analytics
 * aggregation pipeline) - test those manually against a real database.
 *
 * Run with:  npm test
 */

// Environment must be set BEFORE the app is loaded (env.js validates it).
process.env.NODE_ENV = "test";
process.env.MONGODB_URI = "mongodb://localhost:27017/unused-in-tests";
process.env.JWT_SECRET = "test-secret-test-secret-test-secret-123456";
process.env.FRONTEND_URL = "http://localhost:5173";

const { test, describe, beforeEach } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const request = require("supertest");

const app = require("../src/app");
const userRepository = require("../src/repositories/user.repository");
const orderRepository = require("../src/repositories/order.repository");
const productRepository = require("../src/repositories/product.repository");
const analyticsRepository = require("../src/repositories/analytics.repository");
const analyticsService = require("../src/services/analytics.service");

// ---------------------------------------------------------------------------
// In-memory fake database
// ---------------------------------------------------------------------------

const newId = () => crypto.randomBytes(12).toString("hex");

let users;
let orders;

const products = [
  {
    _id: newId(),
    slug: "digital-pulse-oximeter",
    name: "Digital Pulse Oximeter",
    category: "Patient Monitoring",
    price: 1299,
    stock: "In Stock",
    images: [],
  },
  {
    _id: newId(),
    slug: "ecg-machine",
    name: "ECG Machine",
    category: "Cardiology",
    price: 42000.5,
    stock: "In Stock",
    images: ["ecg.webp"],
  },
  {
    _id: newId(),
    slug: "broken-stock-item",
    name: "Sold Out Item",
    category: "Cardiology",
    price: 100,
    stock: "Out of Stock",
    images: [],
  },
];

function installFakes() {
  users = [];
  orders = [];

  userRepository.createUser = async (data) => {
    const user = { _id: newId(), createdAt: new Date(), ...data };
    users.push(user);
    return { ...user };
  };
  userRepository.findByEmailWithPassword = async (email) =>
    users.find((u) => u.email === email) || null;
  userRepository.findById = async (id) =>
    users.find((u) => String(u._id) === String(id)) || null;

  productRepository.findActiveProductsBySlugs = async (slugs) =>
    products.filter((p) => slugs.includes(p.slug));

  orderRepository.createOrder = async (data) => {
    const order = {
      _id: newId(),
      status: "processing",
      paymentStatus: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    };
    orders.push(order);
    return { ...order };
  };
  orderRepository.findOrderById = async (id) =>
    orders.find((o) => String(o._id) === String(id)) || null;
  orderRepository.findOrderByIdForUser = async (id, userId) =>
    orders.find(
      (o) => String(o._id) === String(id) && String(o.user) === String(userId)
    ) || null;
  orderRepository.findOrdersByUser = async (userId, { page, limit }) => {
    const mine = orders.filter((o) => String(o.user) === String(userId));
    return {
      items: mine.slice((page - 1) * limit, page * limit),
      total: mine.length,
    };
  };
  orderRepository.findAllOrders = async ({ page, limit, status }) => {
    const all = status ? orders.filter((o) => o.status === status) : orders;
    return {
      items: all.slice((page - 1) * limit, page * limit),
      total: all.length,
    };
  };
  orderRepository.updateOrderIfStatus = async (id, expected, changes) => {
    const order = orders.find((o) => String(o._id) === String(id));
    if (!order || order.status !== expected) return null;
    Object.assign(order, changes, { updatedAt: new Date() });
    return { ...order };
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const validAddress = {
  name: "Rohit Bhatnagar",
  phone: "9876543210",
  addressLine1: "Vijay Nagar",
  addressLine2: "Indore",
  pincode: "452010",
  country: "India",
};

async function registerUser(email = "rohit@example.com", name = "Rohit") {
  const res = await request(app)
    .post("/api/v1/auth/register")
    .send({ name, email, password: "StrongPass#123" });
  return res;
}

/** Creates an account, promotes it to admin in the fake DB, logs in again. */
async function createAdminToken() {
  await registerUser("admin@example.com", "Admin");
  users.find((u) => u.email === "admin@example.com").role = "admin";

  const res = await request(app)
    .post("/api/v1/auth/login")
    .send({ email: "admin@example.com", password: "StrongPass#123" });
  return res.body.data.token;
}

const auth = (token) => ({ Authorization: `Bearer ${token}` });

beforeEach(installFakes);

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

describe("auth", () => {
  test("register creates a customer, returns a token, hides the password hash", async () => {
    const res = await registerUser("  Rohit@Example.COM ");

    assert.equal(res.status, 201);
    assert.equal(res.body.data.user.email, "rohit@example.com");
    assert.equal(res.body.data.user.role, "customer");
    assert.ok(res.body.data.token);
    assert.equal(JSON.stringify(res.body).includes("passwordHash"), false);
    assert.equal(JSON.stringify(res.body).includes("StrongPass"), false);
    // The stored value must be a bcrypt hash, not the plain password.
    assert.match(users[0].passwordHash, /^\$2[aby]\$/);
  });

  test("register rejects a role field (cannot self-promote to admin)", async () => {
    const res = await request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "Evil",
        email: "evil@example.com",
        password: "StrongPass#123",
        role: "admin",
      });

    assert.equal(res.status, 400);
    assert.equal(users.length, 0);
  });

  test("register rejects weak password and bad email", async () => {
    const weak = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Rohit", email: "a@b.com", password: "short" });
    const badEmail = await request(app)
      .post("/api/v1/auth/register")
      .send({ name: "Rohit", email: "not-an-email", password: "StrongPass#123" });

    assert.equal(weak.status, 400);
    assert.equal(badEmail.status, 400);
  });

  test("register rejects a duplicate email with 409", async () => {
    await registerUser();
    const res = await registerUser("ROHIT@example.com");

    assert.equal(res.status, 409);
  });

  test("login works and wrong credentials give the same 401 message", async () => {
    await registerUser();

    const ok = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "rohit@example.com", password: "StrongPass#123" });
    const wrongPassword = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "rohit@example.com", password: "WrongPass#123" });
    const unknownEmail = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "nobody@example.com", password: "StrongPass#123" });

    assert.equal(ok.status, 200);
    assert.ok(ok.body.data.token);
    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownEmail.status, 401);
    assert.equal(wrongPassword.body.message, unknownEmail.body.message);
  });

  test("/auth/me needs a valid token", async () => {
    const reg = await registerUser();
    const token = reg.body.data.token;

    const none = await request(app).get("/api/v1/auth/me");
    const tampered = await request(app)
      .get("/api/v1/auth/me")
      .set(auth(token + "x"));
    const ok = await request(app).get("/api/v1/auth/me").set(auth(token));

    assert.equal(none.status, 401);
    assert.equal(tampered.status, 401);
    assert.equal(ok.status, 200);
    assert.equal(ok.body.data.email, "rohit@example.com");
  });
});

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------

describe("orders", () => {
  async function placeOrder(token, body) {
    return request(app)
      .post("/api/v1/orders")
      .set(auth(token))
      .send(
        body || {
          items: [{ slug: "digital-pulse-oximeter", quantity: 2 }],
          paymentMethod: "UPI",
          shippingAddress: validAddress,
        }
      );
  }

  test("requires login", async () => {
    const res = await request(app).get("/api/v1/orders");
    assert.equal(res.status, 401);
  });

  test("creates an order with server-calculated total and merged duplicates", async () => {
    const { body } = await registerUser();
    const res = await placeOrder(body.data.token, {
      items: [
        { slug: "digital-pulse-oximeter", quantity: 1 },
        { slug: "digital-pulse-oximeter", quantity: 2 },
        { slug: "ecg-machine", quantity: 1 },
      ],
      shippingAddress: validAddress,
    });

    assert.equal(res.status, 201);
    const order = res.body.data;
    assert.equal(order.status, "processing");
    assert.equal(order.paymentStatus, "Pending");
    assert.equal(order.paymentMethod, "COD");
    assert.equal(order.items.length, 2);
    assert.equal(order.items[0].quantity, 3);
    assert.equal(order.items[0].lineTotal, 3897);
    // 3 x 1299 + 42000.50 = 45897.50 (rounded money, no float noise)
    assert.equal(order.totalAmount, 45897.5);
    assert.match(order.orderNumber, /^MSI-/);
  });

  test("rejects client-supplied prices/status and bad input", async () => {
    const { body } = await registerUser();
    const token = body.data.token;

    const withPrice = await placeOrder(token, {
      items: [{ slug: "ecg-machine", quantity: 1, price: 1 }],
      shippingAddress: validAddress,
    });
    const withTotal = await placeOrder(token, {
      items: [{ slug: "ecg-machine", quantity: 1 }],
      totalAmount: 1,
      status: "delivered",
      shippingAddress: validAddress,
    });
    const badPincode = await placeOrder(token, {
      items: [{ slug: "ecg-machine", quantity: 1 }],
      shippingAddress: { ...validAddress, pincode: "123" },
    });
    const emptyCart = await placeOrder(token, {
      items: [],
      shippingAddress: validAddress,
    });
    const zeroQty = await placeOrder(token, {
      items: [{ slug: "ecg-machine", quantity: 0 }],
      shippingAddress: validAddress,
    });

    for (const res of [withPrice, withTotal, badPincode, emptyCart, zeroQty]) {
      assert.equal(res.status, 400);
    }
    assert.equal(orders.length, 0);
  });

  test("rejects unknown and out-of-stock products", async () => {
    const { body } = await registerUser();
    const token = body.data.token;

    const unknown = await placeOrder(token, {
      items: [{ slug: "does-not-exist", quantity: 1 }],
      shippingAddress: validAddress,
    });
    const soldOut = await placeOrder(token, {
      items: [{ slug: "broken-stock-item", quantity: 1 }],
      shippingAddress: validAddress,
    });

    assert.equal(unknown.status, 400);
    assert.equal(soldOut.status, 400);
    assert.equal(orders.length, 0);
  });

  test("customers see only their own orders (others get 404)", async () => {
    const alice = (await registerUser("alice@example.com", "Alice")).body.data;
    const bob = (await registerUser("bob@example.com", "Bob")).body.data;

    const created = await placeOrder(alice.token);
    const orderId = created.body.data.id;

    const aliceList = await request(app).get("/api/v1/orders").set(auth(alice.token));
    const bobList = await request(app).get("/api/v1/orders").set(auth(bob.token));
    const bobPeek = await request(app).get(`/api/v1/orders/${orderId}`).set(auth(bob.token));
    const alicePeek = await request(app).get(`/api/v1/orders/${orderId}`).set(auth(alice.token));

    assert.equal(aliceList.body.data.length, 1);
    assert.equal(aliceList.body.pagination.total, 1);
    assert.equal(bobList.body.data.length, 0);
    assert.equal(bobPeek.status, 404);
    assert.equal(alicePeek.status, 200);
  });

  test("invalid order id format returns 400", async () => {
    const { body } = await registerUser();
    const res = await request(app)
      .get("/api/v1/orders/not-an-id")
      .set(auth(body.data.token));
    assert.equal(res.status, 400);
  });

  test("customer can cancel a processing order once; second cancel is 409", async () => {
    const { body } = await registerUser();
    const created = await placeOrder(body.data.token);
    const id = created.body.data.id;

    const first = await request(app)
      .patch(`/api/v1/orders/${id}/cancel`)
      .set(auth(body.data.token));
    const second = await request(app)
      .patch(`/api/v1/orders/${id}/cancel`)
      .set(auth(body.data.token));

    assert.equal(first.status, 200);
    assert.equal(first.body.data.status, "cancelled");
    assert.equal(second.status, 409);
  });

  test("customer cannot cancel someone else's order or use admin routes", async () => {
    const alice = (await registerUser("alice@example.com", "Alice")).body.data;
    const bob = (await registerUser("bob@example.com", "Bob")).body.data;
    const id = (await placeOrder(alice.token)).body.data.id;

    const cancelOthers = await request(app)
      .patch(`/api/v1/orders/${id}/cancel`)
      .set(auth(bob.token));
    const adminStatus = await request(app)
      .patch(`/api/v1/orders/${id}/status`)
      .set(auth(alice.token))
      .send({ status: "shipped" });
    const adminList = await request(app)
      .get("/api/v1/orders/admin/all")
      .set(auth(alice.token));

    assert.equal(cancelOthers.status, 404);
    assert.equal(adminStatus.status, 403);
    assert.equal(adminList.status, 403);
    assert.equal(orders[0].status, "processing");
  });

  test("admin follows allowed status transitions only", async () => {
    const customer = (await registerUser()).body.data;
    const id = (await placeOrder(customer.token)).body.data.id;
    const adminToken = await createAdminToken();
    const patch = (body) =>
      request(app)
        .patch(`/api/v1/orders/${id}/status`)
        .set(auth(adminToken))
        .send(body);

    const skip = await patch({ status: "delivered" }); // processing -> delivered not allowed
    const empty = await patch({});
    const bogus = await patch({ status: "teleported" });
    const ship = await patch({ status: "shipped" });
    const paid = await patch({ paymentStatus: "Paid" });
    const cancelShipped = await patch({ status: "cancelled" });
    const deliver = await patch({ status: "delivered" });
    const reopen = await patch({ status: "processing" });

    assert.equal(skip.status, 409);
    assert.equal(empty.status, 400);
    assert.equal(bogus.status, 400);
    assert.equal(ship.status, 200);
    assert.equal(ship.body.data.status, "shipped");
    assert.equal(paid.status, 200);
    assert.equal(paid.body.data.paymentStatus, "Paid");
    assert.equal(cancelShipped.status, 409);
    assert.equal(deliver.status, 200);
    assert.equal(reopen.status, 409);

    // A customer can no longer cancel a delivered order.
    const lateCancel = await request(app)
      .patch(`/api/v1/orders/${id}/cancel`)
      .set(auth(customer.token));
    assert.equal(lateCancel.status, 409);
  });

  test("admin can read any order and list all with a status filter", async () => {
    const customer = (await registerUser()).body.data;
    const id = (await placeOrder(customer.token)).body.data.id;
    await placeOrder(customer.token);
    const adminToken = await createAdminToken();

    const one = await request(app).get(`/api/v1/orders/${id}`).set(auth(adminToken));
    const all = await request(app).get("/api/v1/orders/admin/all").set(auth(adminToken));
    const shipped = await request(app)
      .get("/api/v1/orders/admin/all?status=shipped")
      .set(auth(adminToken));
    const badFilter = await request(app)
      .get("/api/v1/orders/admin/all?status=nope")
      .set(auth(adminToken));

    assert.equal(one.status, 200);
    assert.equal(all.body.data.length, 2);
    assert.equal(shipped.body.data.length, 0);
    assert.equal(badFilter.status, 400);
  });
});

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

describe("analytics", () => {
  const today = new Date().toISOString().slice(0, 10);

  function fakeOverview() {
    analyticsRepository.getSalesOverview = async () => ({
      totals: [{ revenue: 1000.456, orders: 3, customers: 2 }],
      daily: [{ _id: today, revenue: 1000.456, orders: 3 }],
      topProducts: [{ _id: "ecg-machine", name: "ECG Machine", units: 2, revenue: 900.1 }],
      byCategory: [{ _id: "Cardiology", units: 2, revenue: 900.1 }],
      byStatus: [{ _id: "processing", count: 2 }, { _id: "cancelled", count: 1 }],
    });
  }

  test("requires login and the admin role", async () => {
    fakeOverview();
    const customer = (await registerUser()).body.data;

    const anonymous = await request(app).get("/api/v1/analytics/summary");
    const asCustomer = await request(app)
      .get("/api/v1/analytics/summary")
      .set(auth(customer.token));

    assert.equal(anonymous.status, 401);
    assert.equal(asCustomer.status, 403);
  });

  test("returns a chart-friendly summary for admins", async () => {
    fakeOverview();
    const adminToken = await createAdminToken();

    const res = await request(app)
      .get("/api/v1/analytics/summary?days=7")
      .set(auth(adminToken));

    assert.equal(res.status, 200);
    const data = res.body.data;
    assert.equal(data.rangeDays, 7);
    assert.equal(data.totals.revenue, 1000.46);
    assert.equal(data.totals.averageOrderValue, 333.49);
    assert.equal(data.salesByDay.length, 7);
    assert.equal(data.salesByDay[6].date, today);
    assert.equal(data.salesByDay[6].orders, 3);
    assert.equal(data.salesByDay[0].revenue, 0); // empty day filled with zero
    assert.deepEqual(data.ordersByStatus, {
      processing: 2,
      shipped: 0,
      delivered: 0,
      cancelled: 1,
    });
    assert.equal(data.topProducts[0].slug, "ecg-machine");
  });

  test("handles an empty database without errors", async () => {
    analyticsRepository.getSalesOverview = async () => ({
      totals: [],
      daily: [],
      topProducts: [],
      byCategory: [],
      byStatus: [],
    });
    const adminToken = await createAdminToken();

    const res = await request(app)
      .get("/api/v1/analytics/summary")
      .set(auth(adminToken));

    assert.equal(res.status, 200);
    assert.equal(res.body.data.rangeDays, 30);
    assert.equal(res.body.data.totals.averageOrderValue, 0);
    assert.equal(res.body.data.salesByDay.length, 30);
  });

  test("validates the days parameter", async () => {
    fakeOverview();
    const adminToken = await createAdminToken();

    for (const days of ["0", "400", "abc", "-5"]) {
      const res = await request(app)
        .get(`/api/v1/analytics/summary?days=${days}`)
        .set(auth(adminToken));
      assert.equal(res.status, 400, `days=${days} should be rejected`);
    }

    const unknown = await request(app)
      .get("/api/v1/analytics/summary?foo=1")
      .set(auth(adminToken));
    assert.equal(unknown.status, 400);
  });

  test("date range helpers are correct", () => {
    const now = new Date("2026-10-11T15:30:00Z");
    const start = analyticsService.getRangeStart(3, now);
    assert.equal(start.toISOString(), "2026-10-09T00:00:00.000Z");

    const rows = analyticsService.fillMissingDays(start, 3, [
      { _id: "2026-10-10", revenue: 50, orders: 1 },
    ]);
    assert.deepEqual(rows, [
      { date: "2026-10-09", revenue: 0, orders: 0 },
      { date: "2026-10-10", revenue: 50, orders: 1 },
      { date: "2026-10-11", revenue: 0, orders: 0 },
    ]);
  });
});

// ---------------------------------------------------------------------------
// Existing routes must keep working
// ---------------------------------------------------------------------------

describe("existing routes", () => {
  test("health, root and unknown routes behave as before", async () => {
    const health = await request(app).get("/api/v1/health");
    const root = await request(app).get("/");
    const unknown = await request(app).get("/api/v1/nothing-here");

    assert.equal(health.status, 200);
    assert.equal(root.status, 200);
    assert.equal(unknown.status, 404);
  });

  test("product list still validates its query", async () => {
    const bad = await request(app).get("/api/v1/products?limit=500");
    assert.equal(bad.status, 400);
  });
});