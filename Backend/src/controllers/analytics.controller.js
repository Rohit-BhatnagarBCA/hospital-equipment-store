/**
 * Handles HTTP input/output for the sales dashboard.
 */

const analyticsService = require("../services/analytics.service");
const asyncHandler = require("../utils/asyncHandler");

const getSummary = asyncHandler(async (req, res) => {
  const summary = await analyticsService.getSalesSummary(
    res.locals.validated.query
  );

  res.status(200).json({ success: true, data: summary });
});

module.exports = {
  getSummary,
};