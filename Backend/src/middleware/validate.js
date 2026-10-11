
/**
 * Validates selected parts of an incoming request using a Zod schema.
 *
 * @param {Object} schemas - Optional Zod schemas for params, query, and body.
 * @returns {Function} Express middleware that rejects invalid input.
 */
function validate(schemas) {
  return function validateRequest(req, res, next) {
    const validated = {};

    for (const key of ["params", "query", "body"]) {
      if (!schemas[key]) continue;

      const result = schemas[key].safeParse(req[key]);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: "Request validation failed",
          errors: result.error.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        });
      }

      validated[key] = result.data;
    }

    // Store validated values separately rather than trusting raw request input.
    res.locals.validated = validated;

    next();
  };
}

module.exports = validate;
