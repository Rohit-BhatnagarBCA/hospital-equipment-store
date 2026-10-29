/**
 * Authentication routes, mounted at /api/v1/auth.
 *
 *  POST /register  create a customer account, returns { user, token }
 *  POST /login     returns { user, token }
 *  GET  /me        returns the logged-in user (requires Bearer token)
 */

const express = require("express");
const rateLimit = require("express-rate-limit");

const env = require("../config/env");
const validate = require("../middleware/validate");
const { authenticate } = require("../middleware/auth");
const authController = require("../controllers/auth.controller");
const {
  registerSchema,
  loginSchema,
} = require("../validations/auth.validation");

const router = express.Router();

// Stricter limit than the global one: slows down password-guessing attacks.
// Disabled while running automated tests so tests are not blocked.
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => env.NODE_ENV === "test",
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

router.post(
  "/register",
  authRateLimiter,
  validate({ body: registerSchema }),
  authController.register
);

router.post(
  "/login",
  authRateLimiter,
  validate({ body: loginSchema }),
  authController.login
);

router.get("/me", authenticate, authController.getMe);

module.exports = router;