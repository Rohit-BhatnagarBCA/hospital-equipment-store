
/**
 * Defines validation schemas for public product catalogue endpoints.
 *
 * Query values arrive as strings, so numeric parameters are converted and
 * validated before the repository uses them.
 */
const { z } = require("zod");

const listProductsSchema = z.object({
  search: z.string().trim().max(100).optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(12),
}).strict();

const productParamsSchema = z.object({
  slug: z.string().trim().min(1).max(160).regex(
    /^[a-zA-Z0-9_-]+$/,
    "Product slug contains invalid characters"
  ),
}).strict();

module.exports = {
  listProductsSchema,
  productParamsSchema,
};
