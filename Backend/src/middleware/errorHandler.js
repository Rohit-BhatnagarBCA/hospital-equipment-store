
/**
 * Converts application errors into consistent JSON responses.
 *
 * Why this matters:
 * A single error-handling policy prevents controllers from exposing sensitive
 * implementation details and keeps the API response format predictable.
 */

function errorHandler(err, req, res, next) {
  // Delegate if the response has already started; Express can finish handling it.
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number.isInteger(err.statusCode)
    ? err.statusCode
    : 500;

  // Log the full error on the server for debugging, not in the client response.
  req.log?.error({ err }, "Request failed");

  const message =
    statusCode >= 500 && process.env.NODE_ENV === "production"
      ? "Internal server error"
      : err.message || "An unexpected error occurred";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

module.exports = errorHandler;
