/**
 * Express Application Configuration
 *
 * Registers shared middleware and API routes.
 * This file configures the app but does not start the HTTP server.
 */

require("dotenv").config();

const express = require("express");
const env = require("./config/env");
const createSecurityMiddleware = require("./middleware/security");

const healthRoutes = require("./routes/health.routes");
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const analyticsRoutes = require("./routes/analytics.routes");
const quoteRoutes = require("./routes/quote.routes");

const app = express();

// Avoid exposing the Express framework in response headers.
app.disable("x-powered-by");

// Configure security middleware in one place to avoid duplication.
const {
  helmetMiddleware,
  corsMiddleware,
  apiRateLimiter,
} = createSecurityMiddleware(env.FRONTEND_URL);

app.use(helmetMiddleware);
app.use(corsMiddleware);

// Limit incoming JSON payload size.
app.use(express.json({ limit: "20kb" }));

// Apply a shared rate limit to incoming requests.
app.use(apiRateLimiter);

// Basic endpoint to confirm that the API is running.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Medical Sales Intelligence API is running",
  });
});

// Register health endpoints under the versioned API prefix.
app.use("/api/v1/health", healthRoutes);

// Public product catalogue endpoints.
app.use("/api/v1/products", productRoutes);

// NEW: registration, login and "who am I".
app.use("/api/v1/auth", authRoutes);

// NEW: customer orders (login required) and admin order management.
app.use("/api/v1/orders", orderRoutes);

// NEW: sales dashboard data (admin only).
app.use("/api/v1/analytics", analyticsRoutes);

// Accept quotation requests separately from the public product catalogue.
app.use("/api/v1/quotes", quoteRoutes);

// All routes must be registered BEFORE the 404 handler.
// Return a consistent response for unknown routes.
app.use(require("./middleware/notFound"));

// Handle errors after all routes and the not-found middleware.
app.use(require("./middleware/errorHandler"));


module.exports = app;