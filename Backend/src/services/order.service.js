/**
 * Business logic for orders.
 *
 * Rules enforced here (not in controllers):
 *  - Prices and totals are calculated from the database, never from the client.
 *  - Only active, in-stock products can be ordered.
 *  - Customers can see only their own orders; admins can see any order.
 *  - Customers can cancel only orders that are still "processing".
 *  - Admins move orders forward through allowed status transitions only.
 */

const ApiError = require("../utils/ApiError");
const orderRepository = require("../repositories/order.repository");
const productRepository = require("../repositories/product.repository");
const {
  ALLOWED_STATUS_TRANSITIONS,
} = require("../constants/order.constants");

const MAX_QUANTITY_PER_PRODUCT = 100;

/** Rounds money to 2 decimals to avoid floating-point noise (0.1 + 0.2). */
function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

/** Example: MSI-LZ3K9A-4F2 (time part + random part keeps it unique). */
function generateOrderNumber() {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `MSI-${timePart}-${randomPart}`;
}

/** Shapes a database order for API responses. */
function toOrderResponse(order) {
  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    date: order.createdAt,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    shippingAddress: order.shippingAddress,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

function buildPagination({ page, limit }, total) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) };
}

async function createOrder(userId, payload) {
  // 1. Merge duplicate slugs: [{a,1},{a,2}] becomes a x3.
  const quantityBySlug = new Map();
  for (const item of payload.items) {
    quantityBySlug.set(
      item.slug,
      (quantityBySlug.get(item.slug) || 0) + item.quantity
    );
  }

  for (const [slug, quantity] of quantityBySlug) {
    if (quantity > MAX_QUANTITY_PER_PRODUCT) {
      throw new ApiError(
        400,
        `Maximum ${MAX_QUANTITY_PER_PRODUCT} units per product (${slug})`
      );
    }
  }

  // 2. Load all products with ONE query and index them by slug.
  const products = await productRepository.findActiveProductsBySlugs([
    ...quantityBySlug.keys(),
  ]);
  const productBySlug = new Map(products.map((p) => [p.slug, p]));

  // 3. Build item snapshots using DATABASE prices.
  const items = [];
  for (const [slug, quantity] of quantityBySlug) {
    const product = productBySlug.get(slug);

    if (!product) {
      throw new ApiError(400, `Product is not available: ${slug}`);
    }

    // Stock is a text label in the current schema, so we can only block
    // products explicitly marked as out of stock.
    if (/out of stock/i.test(product.stock || "")) {
      throw new ApiError(400, `Product is out of stock: ${product.name}`);
    }

    items.push({
      product: product._id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images?.[0] || "",
      unitPrice: product.price,
      quantity,
      lineTotal: roundMoney(product.price * quantity),
    });
  }

  const totalAmount = roundMoney(
    items.reduce((sum, item) => sum + item.lineTotal, 0)
  );

  // 4. Save. Retry if the (very unlikely) order number already exists.
  let lastError;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const order = await orderRepository.createOrder({
        orderNumber: generateOrderNumber(),
        user: userId,
        items,
        totalAmount,
        paymentMethod: payload.paymentMethod,
        shippingAddress: payload.shippingAddress,
      });

      return toOrderResponse(order);
    } catch (error) {
      if (error && error.code === 11000) {
        lastError = error;
        continue;
      }
      throw error;
    }
  }

  throw lastError;
}

async function listMyOrders(userId, query) {
  const { items, total } = await orderRepository.findOrdersByUser(
    userId,
    query
  );

  return {
    orders: items.map(toOrderResponse),
    pagination: buildPagination(query, total),
  };
}

async function listAllOrders(query) {
  const { items, total } = await orderRepository.findAllOrders(query);

  return {
    orders: items.map(toOrderResponse),
    pagination: buildPagination(query, total),
  };
}

/**
 * Admins can open any order; customers only their own.
 * A customer asking for someone else's order gets 404 (not 403), so the
 * existence of other people's orders is not revealed.
 */
async function getOrder(user, orderId) {
  const order =
    user.role === "admin"
      ? await orderRepository.findOrderById(orderId)
      : await orderRepository.findOrderByIdForUser(orderId, user.id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return toOrderResponse(order);
}

async function cancelMyOrder(userId, orderId) {
  const order = await orderRepository.findOrderByIdForUser(orderId, userId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  if (order.status !== "processing") {
    throw new ApiError(
      409,
      "Only orders that are still processing can be cancelled"
    );
  }

  const updated = await orderRepository.updateOrderIfStatus(
    orderId,
    "processing",
    { status: "cancelled" }
  );

  // null means the status changed between our read and our write.
  if (!updated) {
    throw new ApiError(409, "Order status changed. Please refresh and retry");
  }

  return toOrderResponse(updated);
}

async function updateOrderAsAdmin(orderId, { status, paymentStatus }) {
  const order = await orderRepository.findOrderById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  const changes = {};

  if (status !== undefined && status !== order.status) {
    const allowed = ALLOWED_STATUS_TRANSITIONS[order.status] || [];

    if (!allowed.includes(status)) {
      throw new ApiError(
        409,
        `Cannot change order status from ${order.status} to ${status}`
      );
    }

    changes.status = status;
  }

  if (paymentStatus !== undefined) {
    changes.paymentStatus = paymentStatus;
  }

  // Nothing to change (for example the same status was sent again).
  if (Object.keys(changes).length === 0) {
    return toOrderResponse(order);
  }

  const updated = await orderRepository.updateOrderIfStatus(
    orderId,
    order.status,
    changes
  );

  if (!updated) {
    throw new ApiError(409, "Order status changed. Please refresh and retry");
  }

  return toOrderResponse(updated);
}

module.exports = {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrder,
  cancelMyOrder,
  updateOrderAsAdmin,
};