/**
 * Order constants shared by the model, validation and service layers.
 *
 * Why a separate file:
 * The allowed statuses and transitions are business rules. Keeping them in one
 * place means a rule change is a one-file edit instead of a hunt through the
 * model, the validators and the services.
 *
 * The status names match the existing frontend (OrderStatus component):
 * processing, shipped, delivered, cancelled.
 */

const ORDER_STATUSES = ["processing", "shipped", "delivered", "cancelled"];

/**
 * Which status an order may move to from each status.
 * - processing -> shipped or cancelled
 * - shipped    -> delivered (a shipped order can no longer be cancelled)
 * - delivered / cancelled are final.
 */
const ALLOWED_STATUS_TRANSITIONS = {
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

// No payment gateway is connected yet, so these are labels only.
const PAYMENT_METHODS = ["COD", "UPI", "Bank Transfer"];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed"];

module.exports = {
  ORDER_STATUSES,
  ALLOWED_STATUS_TRANSITIONS,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
};