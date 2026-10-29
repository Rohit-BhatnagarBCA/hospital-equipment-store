/**
 * Authentication and authorization middleware.
 *
 * authenticate  -> "Who are you?"   Verifies the Bearer token and sets req.user.
 * authorize     -> "May you do it?" Checks req.user.role against allowed roles.
 *
 * Usage in a route file:
 *   router.get("/private", authenticate, controller.handler);
 *   router.get("/admin-only", authenticate, authorize("admin"), controller.handler);
 *
 * Note: the role comes from the token, so if an admin is demoted their old
 * token keeps the admin role until it expires. Keep JWT_EXPIRES_IN short.
 */

const jwt = require("jsonwebtoken");

const env = require("../config/env");
const ApiError = require("../utils/ApiError");

function authenticate(req, res, next) {
  // Expected header:  Authorization: Bearer <token>
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new ApiError(401, "Authentication required"));
  }

  try {
    // Pinning the algorithm prevents "alg: none" and algorithm-swap attacks.
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    req.user = { id: payload.sub, role: payload.role };
    return next();
  } catch (error) {
    // Do not reveal whether the token was expired, malformed or forged.
    return next(new ApiError(401, "Invalid or expired token"));
  }
}

function authorize(...allowedRoles) {
  return function checkRole(req, res, next) {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action")
      );
    }
    return next();
  };
}

module.exports = {
  authenticate,
  authorize,
};