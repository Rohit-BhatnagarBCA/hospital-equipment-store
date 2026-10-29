/**
 * Analytics routes, mounted at /api/v1/analytics. Admin only.
 *
 *  GET /summary?days=30   revenue, orders, top products, categories, statuses
 */

const express = require("express");

const validate = require("../middleware/validate");
const { authenticate, authorize } = require("../middleware/auth");
const analyticsController = require("../controllers/analytics.controller");
const {
  summaryQuerySchema,
} = require("../validations/analytics.validation");

const router = express.Router();

// Business data must never be public: login AND admin role are required.
router.use(authenticate, authorize("admin"));

router.get(
  "/summary",
  validate({ query: summaryQuerySchema }),
  analyticsController.getSummary
);

module.exports = router;