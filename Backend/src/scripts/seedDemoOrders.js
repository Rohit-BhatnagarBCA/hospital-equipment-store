/**
 * Seed DEMO orders so the sales dashboard has data to show
 *
 * PURPOSE:
 * The analytics endpoint is empty until orders exist. This script creates
 * random sample orders spread over the last 30 days.
 *
 * IMPORTANT:
 * This is FAKE development data. Do not use it in production.
 * Every demo order number starts with "DEMO-" so it can be removed safely.
 *
 * USAGE:
 *   npm run seed:products                      (products must exist first)
 *   npm run seed:demo-orders                   (adds 60 demo orders)
 *   npm run seed:demo-orders -- --count=120    (custom number of orders)
 *   npm run seed:demo-orders -- --clear        (removes all demo data)
 *
 * The demo customer gets a random password nobody knows, so nobody can log
 * in as it. Orders are inserted directly into the collection so their
 * createdAt dates can be set in the past.
 */

require("dotenv").config();

const crypto = require("node:crypto");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const connectDatabase = require("../config/database");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Order = require("../models/order.model");

const DEMO_EMAIL = "demo.customer@example.com";
const DEMO_PREFIX = "DEMO-";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Weighted so the data looks realistic: most orders get delivered.
const STATUS_WEIGHTS = [
  ["delivered", 45],
  ["shipped", 20],
  ["processing", 25],
  ["cancelled", 10],
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickStatus() {
  const total = STATUS_WEIGHTS.reduce((sum, [, weight]) => sum + weight, 0);
  let roll = Math.random() * total;

  for (const [status, weight] of STATUS_WEIGHTS) {
    roll -= weight;
    if (roll < 0) return status;
  }
  return "processing";
}

function getCountFromArguments() {
  const argument = process.argv.find((arg) => arg.startsWith("--count="));
  const count = argument ? Number(argument.split("=")[1]) : 60;

  if (!Number.isInteger(count) || count < 1 || count > 1000) {
    throw new Error("--count must be a whole number between 1 and 1000");
  }
  return count;
}

async function clearDemoData() {
  const orders = await Order.deleteMany({
    orderNumber: { $regex: `^${DEMO_PREFIX}` },
  });
  const users = await User.deleteOne({ email: DEMO_EMAIL });

  console.log(
    `Removed ${orders.deletedCount} demo orders and ${users.deletedCount} demo user.`
  );
}

async function seedDemoOrders(count) {
  const products = await Product.find({ status: "active" }).lean();
  if (products.length === 0) {
    throw new Error("No active products found. Run: npm run seed:products");
  }

  // Create the demo customer once; reuse it on later runs.
  let customer = await User.findOne({ email: DEMO_EMAIL }).lean();
  if (!customer) {
    const unknownPassword = crypto.randomBytes(24).toString("hex");
    const created = await User.create({
      name: "Demo Customer",
      email: DEMO_EMAIL,
      passwordHash: await bcrypt.hash(unknownPassword, 12),
      role: "customer",
    });
    customer = created.toObject();
  }

  const now = Date.now();
  const documents = [];

  for (let index = 0; index < count; index += 1) {
    // Pick 1-3 different products with quantity 1-3 each.
    const shuffled = [...products].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, randomInt(1, Math.min(3, products.length)));

    const items = chosen.map((product) => {
      const quantity = randomInt(1, 3);
      return {
        product: product._id,
        slug: product.slug,
        name: product.name,
        category: product.category,
        image: product.images?.[0] || "",
        unitPrice: product.price,
        quantity,
        lineTotal: Math.round(product.price * quantity * 100) / 100,
      };
    });

    const status = pickStatus();
    const createdAt = new Date(now - Math.random() * 30 * DAY_IN_MS);

    documents.push({
      orderNumber: `${DEMO_PREFIX}${Date.now().toString(36).toUpperCase()}-${index}`,
      user: customer._id,
      items,
      totalAmount:
        Math.round(items.reduce((sum, item) => sum + item.lineTotal, 0) * 100) /
        100,
      status,
      paymentMethod: "UPI",
      paymentStatus: status === "delivered" ? "Paid" : "Pending",
      shippingAddress: {
        name: "Demo Customer",
        phone: "9999999999",
        addressLine1: "Demo Street 1",
        addressLine2: "Indore, Madhya Pradesh",
        pincode: "452010",
        country: "India",
      },
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Raw insert keeps the past createdAt dates exactly as generated.
  await Order.collection.insertMany(documents);
  console.log(`Inserted ${documents.length} demo orders.`);
}

async function run() {
  const shouldClear = process.argv.includes("--clear");

  // Validate arguments BEFORE touching the database.
  const count = shouldClear ? 0 : getCountFromArguments();

  await connectDatabase();

  if (shouldClear) {
    await clearDemoData();
  } else {
    await seedDemoOrders(count);
  }
}

run()
  .catch((error) => {
    console.error("Demo order script failed:", error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });