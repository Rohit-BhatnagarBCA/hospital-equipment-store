
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
const adminProductRoutes = require("./routes/admin-product.routes");

const app = express();

app.disable("x-powered-by");

const {
  helmetMiddleware,
  corsMiddleware,
  apiRateLimiter,
} = createSecurityMiddleware(env.FRONTEND_URL);

app.use(helmetMiddleware);
app.use(corsMiddleware);

// Parse JSON requests. Multipart requests are handled by Multer.
app.use(express.json({ limit: "20kb" }));

app.use(apiRateLimiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Medical Sales Intelligence API is running",
  });
});

// Health check routes.
app.use("/api/v1/health", healthRoutes);

// Public product catalogue routes.
app.use("/api/v1/products", productRoutes);

// Protected admin product management routes.
app.use("/api/v1/admin/products", adminProductRoutes);

// Handle unknown routes.
app.use(require("./middleware/notFound"));

// Handle application errors.
app.use(require("./middleware/errorHandler"));

module.exports = app;
