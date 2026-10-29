
/**
 * Validates public quotation submissions before database operations.
 */

const { z } = require("zod");

const createQuoteSchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(20).regex(
    /^[+()\d\s-]+$/,
    "Enter a valid phone number"
  ),
  message: z.string().trim().max(1000).optional().default(""),
  productSlug: z.string().trim().min(1).max(160).regex(/^[a-zA-Z0-9_-]+$/),
  quantity: z.coerce.number().int().min(1).max(10000),
}).strict();

module.exports = { createQuoteSchema };