/**
 * Defines the MongoDB schema for customer orders.
 *
 * Key design decision - SNAPSHOTS:
 * Each order item copies the product name, price and category at purchase
 * time. If the catalogue price changes tomorrow, old orders (and old sales
 * reports) must still show what the customer actually paid.
 */

const mongoose = require("mongoose");

const {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} = require("../constants/order.constants");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    slug: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, default: "" },
    unitPrice: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

// Field names match the existing frontend address layout (orders.js).
const shippingAddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    addressLine1: { type: String, required: true, trim: true, maxlength: 200 },
    addressLine2: { type: String, default: "", trim: true, maxlength: 200 },
    pincode: { type: String, required: true, trim: true, maxlength: 10 },
    country: { type: String, default: "India", trim: true, maxlength: 60 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    // Customer-facing number, for example MSI-LZ3K9A-4F2.
    orderNumber: { type: String, required: true, unique: true },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: "An order must contain at least one item",
      },
    },

    // Calculated by the server from database prices, never taken from the client.
    totalAmount: { type: Number, required: true, min: 0 },

    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "processing",
    },

    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "Pending",
    },

    shippingAddress: { type: shippingAddressSchema, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

// "My orders, newest first" - the most common customer query.
orderSchema.index({ user: 1, createdAt: -1 });

// Sales reports filter by date and status.
orderSchema.index({ createdAt: -1, status: 1 });

module.exports = mongoose.model("Order", orderSchema);