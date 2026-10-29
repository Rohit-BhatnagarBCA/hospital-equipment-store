/**
 * Order routes, mounted at /api/v1/orders. Every route requires login.
 *
 *  POST  /                  place an order
 *  GET   /                  my orders (paginated)
 *  GET   /admin/all         all orders (admin only, optional ?status=)
 *  GET   /:orderId          one order (own order, or any order for admins)
 *  PATCH /:orderId/cancel   cancel my order (only while processing)
 *  PATCH /:orderId/status   change status / payment status (admin only)
 *
 * "/admin/all" is registered BEFORE "/:orderId" so it is never mistaken for an id.
 */

const express = require("express");

const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const orderController = require("../controllers/order.controller");
const {
  createOrderSchema,
  orderParamsSchema,
  listOrdersSchema,
  adminListOrdersSchema,
  updateOrderSchema,
} = require("../validations/order.validation");

const router = express.Router();

// Everything below needs a valid login token.
router.use(authenticate);

router.post(
  "/",
  validate({ body: createOrderSchema }),
  orderController.createOrder
);

router.get(
  "/",
  validate({ query: listOrdersSchema }),
  orderController.listMyOrders
);

router.get(
  "/admin/all",
  authorize("admin"),
  validate({ query: adminListOrdersSchema }),
  orderController.listAllOrders
);

router.get(
  "/:orderId",
  validate({ params: orderParamsSchema }),
  orderController.getOrder
);

router.patch(
  "/:orderId/cancel",
  validate({ params: orderParamsSchema }),
  orderController.cancelOrder
);

router.patch(
  "/:orderId/status",
  authorize("admin"),
  validate({ params: orderParamsSchema, body: updateOrderSchema }),
  orderController.updateOrder
);

module.exports = router;