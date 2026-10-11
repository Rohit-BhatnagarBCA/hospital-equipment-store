
/**
 * Represents an expected API error with an HTTP status code.
 *
 * Use this class for conditions such as a missing product or invalid request.
 * Unexpected programming errors should continue to the central error handler.
 */
 
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.isOperational = true;

    // Preserve the location where the error was created for debugging.
    Error.captureStackTrace?.(this, ApiError);
  }
}

module.exports = ApiError;
