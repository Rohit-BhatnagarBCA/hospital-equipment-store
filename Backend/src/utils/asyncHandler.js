
/**
 * Wraps an asynchronous Express handler and forwards rejected promises.
 *
 * This keeps controllers focused on business logic instead of repeating
 * try/catch blocks in every route handler.
 *
 * @param {Function} handler - An asynchronous Express request handler.
 * @returns {Function} An Express-compatible handler.
 */
function asyncHandler(handler) {
  return function wrappedHandler(req, res, next) {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;
