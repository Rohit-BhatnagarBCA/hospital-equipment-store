
/**
 * Health Check Routes
 *
 * These routes expose a lightweight endpoint for checking whether
 * the application is responding to HTTP requests.
 *
 * Health endpoints are useful during local development and monitoring.
 * This endpoint does not verify database readiness; that can be exposed
 * through a separate readiness endpoint when required.
 */

const express = require("express");

const router = express.Router();

/**
 * GET /
 *
 * Returns a successful response when the API process can handle requests.
 * Because this route does not query MongoDB, a successful response alone
 * does not guarantee that the database is available.
 */
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// Export the router so app.js can mount it under /api/v1/health.
module.exports = router;
