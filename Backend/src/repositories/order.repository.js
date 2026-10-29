/**
 * Performs database operations for orders.
 */

const Order = require("../models/order.model");

async function createOrder(data) {
  const order = await Order.create(data);
  return order.toObject();
}

async function findOrderById(orderId) {
  return Order.findById(orderId).lean();
}

/** Scoped to one customer, so users can never read each other's orders. */
async function findOrderByIdForUser(orderId, userId) {
  return Order.findOne({ _id: orderId, user: userId }).lean();
}

async function findOrdersByUser(userId, { page, limit }) {
  const filter = { user: userId };

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { items, total };
}

async function findAllOrders({ page, limit, status }) {
  const filter = {};
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return { items, total };
}

/**
 * Updates an order ONLY if its status is still `expectedStatus`.
 *
 * Why: two people (customer cancels, admin ships) could act at the same
 * moment. The status condition makes the update atomic; the loser gets null
 * and the service answers with a clear 409 conflict.
 */
async function updateOrderIfStatus(orderId, expectedStatus, changes) {
  return Order.findOneAndUpdate(
    { _id: orderId, status: expectedStatus },
    { $set: changes },
    { new: true, runValidators: true }
  ).lean();
}

module.exports = {
  createOrder,
  findOrderById,
  findOrderByIdForUser,
  findOrdersByUser,
  findAllOrders,
  updateOrderIfStatus,
};