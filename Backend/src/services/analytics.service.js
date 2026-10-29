/**
 * Business logic for the sales dashboard.
 *
 * The repository returns raw aggregation output. This service turns it into a
 * clean, chart-friendly response:
 *  - money is rounded to 2 decimals
 *  - days without sales are filled with zeros (so charts have no gaps)
 *  - every order status appears, even when its count is 0
 */

const analyticsRepository = require("../repositories/analytics.repository");
const { ORDER_STATUSES } = require("../constants/order.constants");

const DAY_IN_MS = 24 * 60 * 60 * 1000;

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

/** Midnight (UTC) of the first day in the requested range, today included. */
function getRangeStart(days, now = new Date()) {
  const todayStart = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );

  return new Date(todayStart - (days - 1) * DAY_IN_MS);
}

/** Builds one row per day from `start` for `days` days, merging real sales. */
function fillMissingDays(start, days, dailyRows) {
  const byDate = new Map(dailyRows.map((row) => [row._id, row]));
  const filled = [];

  for (let index = 0; index < days; index += 1) {
    const date = new Date(start.getTime() + index * DAY_IN_MS)
      .toISOString()
      .slice(0, 10);
    const row = byDate.get(date);

    filled.push({
      date,
      revenue: row ? roundMoney(row.revenue) : 0,
      orders: row ? row.orders : 0,
    });
  }

  return filled;
}

async function getSalesSummary({ days }, now = new Date()) {
  const since = getRangeStart(days, now);
  const raw = await analyticsRepository.getSalesOverview({ since });

  const totals = raw.totals[0] || { revenue: 0, orders: 0, customers: 0 };

  // Start every status at 0, then fill in what the database returned.
  const ordersByStatus = Object.fromEntries(
    ORDER_STATUSES.map((status) => [status, 0])
  );
  for (const row of raw.byStatus) {
    ordersByStatus[row._id] = row.count;
  }

  return {
    rangeDays: days,
    since: since.toISOString(),
    totals: {
      revenue: roundMoney(totals.revenue),
      orders: totals.orders,
      customers: totals.customers,
      averageOrderValue: totals.orders
        ? roundMoney(totals.revenue / totals.orders)
        : 0,
    },
    salesByDay: fillMissingDays(since, days, raw.daily),
    topProducts: raw.topProducts.map((row) => ({
      slug: row._id,
      name: row.name,
      units: row.units,
      revenue: roundMoney(row.revenue),
    })),
    salesByCategory: raw.byCategory.map((row) => ({
      category: row._id,
      units: row.units,
      revenue: roundMoney(row.revenue),
    })),
    ordersByStatus,
  };
}

module.exports = {
  getSalesSummary,
  // Exported so the date logic can be unit-tested directly.
  getRangeStart,
  fillMissingDays,
};