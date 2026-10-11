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

// Register public product catalogue endpoints BEFORE the 404 handler.
app.use("/api/v1/products", productRoutes);

// Return a consistent response for unknown routes.
app.use(require("./middleware/notFound"));

// Handle errors after all routes and the not-found middleware.
app.use(require("./middleware/errorHandler"));


module.exports = app;