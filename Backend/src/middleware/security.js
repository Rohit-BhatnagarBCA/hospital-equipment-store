
/**
 * Creates the shared security middleware used by the Express application.
 *
 * Helmet configures protective HTTP headers, CORS restricts browser-based
 * cross-origin access, and rate limiting reduces excessive repeated requests.
 *
 * These controls are one layer of security; they do not replace authentication,
 * authorization, input validation, or database query safeguards.
 */
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

function createSecurityMiddleware(frontendUrl) {
  const corsOptions = {
    origin: frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
    },
  });

  return {
    helmetMiddleware: helmet(),
    corsMiddleware: cors(corsOptions),
    apiRateLimiter,
  };
}

module.exports = createSecurityMiddleware;
