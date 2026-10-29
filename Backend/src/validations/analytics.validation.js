
/*
 * Analytics Validation
 * -------------------------------------------------------
 * Purpose:
 * Validate query parameters received by analytics routes.
 *
 * Why:
 * Request query values arrive as strings. Validation converts
 * "30" into the number 30 and rejects invalid values.
 *
 * Security:
 * Restrict the requested date range to avoid unexpectedly
 * expensive analytics queries.
 */

const { z } = require("zod");

const summaryQuerySchema = z.object({
  // Default to the last 30 days when the client sends no value.
  days: z.coerce
    .number()
    .int("Days must be a whole number.")
    .min(1, "Days must be at least 1.")
    .max(365, "Days cannot exceed 365.")
    .default(30),
});

module.exports = {
  summaryQuerySchema,
};