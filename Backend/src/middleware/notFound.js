
/**
 * Handles requests that do not match any registered route.
 *
 * Register this middleware after all application routes so valid endpoints
 * are matched first.
 */
function notFound(req, res) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

module.exports = notFound;
