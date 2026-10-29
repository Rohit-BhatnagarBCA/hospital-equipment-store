/**
 * Handles HTTP input/output for orders.
 * All rules live in order.service.js; req.user is set by the authenticate
 * middleware and validated input is in res.locals.validated.
 */

const orderService = require("../services/order.service");
const asyncHandler = require("../utils/asyncHandler");

const createOrder = asyncHandler(async (req, res) => {
  const order = await orderService.createOrder(
    req.user.id,
    res.locals.validated.body
  );

  res.status(201).json({ success: true, data: order });
});

const listMyOrders = asyncHandler(async (req, res) => {
  const result = await orderService.listMyOrders(
    req.user.id,
    res.locals.validated.query
  );

  res.status(200).json({
    success: true,
    data: result.orders,
    pagination: result.pagination,
  });
});

const listAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.listAllOrders(res.locals.validated.query);

  res.status(200).json({
    success: true,
    data: result.orders,
    pagination: result.pagination,
  });
});

const getOrder = asyncHandler(async (req, res) => {
  const order = await orderService.getOrder(
    req.user,
    res.locals.validated.params.orderId
  );

  res.status(200).json({ success: true, data: order });
});

const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelMyOrder(
    req.user.id,
    res.locals.validated.params.orderId
  );

  res.status(200).json({ success: true, data: order });
});

const updateOrder = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderAsAdmin(
    res.locals.validated.params.orderId,
    res.locals.validated.body
  );

  res.status(200).json({ success: true, data: order });
});

module.exports = {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrder,
  cancelOrder,
  updateOrder,
};