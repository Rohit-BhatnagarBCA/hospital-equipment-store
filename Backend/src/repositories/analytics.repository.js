/**
 * Runs the MongoDB aggregation queries behind the sales dashboard.
 *
 * Why aggregation:
 * MongoDB calculates the totals itself, so we never download every order into
 * Node.js just to add numbers together.
 *
 * Why $facet:
 * One pass over the matching orders produces all report sections at once
 * (totals, daily sales, top products, categories, statuses).
 *
 * Business rule: cancelled orders are NOT counted as sales. They only appear
 * in the status breakdown.
 */

const Order = require("../models/order.model");

async function getSalesOverview({ since }) {
  const notCancelled = { status: { $ne: "cancelled" } };

  const [result] = await Order.aggregate([
    // Narrow down to the requested period first (uses the createdAt index).
    { $match: { createdAt: { $gte: since } } },

    {
      $facet: {
        // Revenue, order count and number of distinct customers.
        totals: [
          { $match: notCancelled },
          {
            $group: {
              _id: null,
              revenue: { $sum: "$totalAmount" },
              orders: { $sum: 1 },
              customers: { $addToSet: "$user" },
            },
          },
          {
            $project: {
              _id: 0,
              revenue: 1,
              orders: 1,
              customers: { $size: "$customers" },
            },
          },
        ],

        // Sales per calendar day (UTC). Days with no sales are added later.
        daily: [
          { $match: notCancelled },
          {
            $group: {
              _id: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "UTC",
                },
              },
              revenue: { $sum: "$totalAmount" },
              orders: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],

        // Best-selling products by revenue (one row per product).
        topProducts: [
          { $match: notCancelled },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.slug",
              name: { $first: "$items.name" },
              units: { $sum: "$items.quantity" },
              revenue: { $sum: "$items.lineTotal" },
            },
          },
          { $sort: { revenue: -1 } },
          { $limit: 5 },
        ],

        // Revenue per product category.
        byCategory: [
          { $match: notCancelled },
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.category",
              units: { $sum: "$items.quantity" },
              revenue: { $sum: "$items.lineTotal" },
            },
          },
          { $sort: { revenue: -1 } },
        ],

        // Order counts per status, including cancelled.
        byStatus: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
      },
    },
  ]);

  return result;
}

module.exports = {
  getSalesOverview,
};