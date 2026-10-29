/**
 * Validation schemas for order endpoints.
 *
 * Note what the client is NOT allowed to send: prices, totals, status,
 * payment status. The server decides all of those.
 */
const { z } = require("zod");

const {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
} = require("../constants/order.constants");

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-zA-Z0-9_-]+$/, "Product slug contains invalid characters");

const orderItemInputSchema = z
  .object({
    slug: slugSchema,
    quantity: z.coerce.number().int().min(1).max(100),
  })
  .strict();

// Indian-style address fields to match the existing UI (pincode, not zip).
const shippingAddressInputSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    phone: z
      .string()
      .trim()
      .regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
    addressLine1: z.string().trim().min(5).max(200),
    addressLine2: z.string().trim().max(200).default(""),
    pincode: z.string().trim().regex(/^\d{6}$/, "Pincode must be 6 digits"),
    country: z.string().trim().min(2).max(60).default("India"),
  })
  .strict();

const createOrderSchema = z
  .object({
    items: z.array(orderItemInputSchema).min(1).max(50),
    paymentMethod: z.enum(PAYMENT_METHODS).default("COD"),
    shippingAddress: shippingAddressInputSchema,
  })
  .strict();

// MongoDB ObjectIds are 24 hexadecimal characters.
const orderParamsSchema = z
  .object({
    orderId: z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid order id"),
  })
  .strict();

const listOrdersSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
  })
  .strict();

const adminListOrdersSchema = z
  .object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.enum(ORDER_STATUSES).optional(),
  })
  .strict();

// Admin update: at least one of the two fields must be present.
const updateOrderSchema = z
  .object({
    status: z.enum(ORDER_STATUSES).optional(),
    paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  })
  .strict()
  .refine(
    (value) => value.status !== undefined || value.paymentStatus !== undefined,
    { message: "Provide status and/or paymentStatus" }
  );

module.exports = {
  createOrderSchema,
  orderParamsSchema,
  listOrdersSchema,
  adminListOrdersSchema,
  updateOrderSchema,
};