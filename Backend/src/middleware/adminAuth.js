/**
 * Protects admin routes using a signed JWT.
 * The token must contain role: "admin".
 */

const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");

function requireAdmin(req, res, next) {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw new ApiError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      throw new ApiError(403, "Admin access required");
    }

    req.user = {
      id: decoded.id || decoded.userId || null,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) return next(error);

    return next(new ApiError(401, "Invalid or expired authentication token"));
  }
}

module.exports = requireAdmin;