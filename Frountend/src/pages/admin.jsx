
/*
 * AdminDashboard
 * -------------------------------------------------------
 * Displays medical equipment sales, revenue, inventory,
 * and product performance using responsive Recharts charts.
 *
 * Live data:
 * - Product count from the backend catalogue API.
 * - Inventory status from actual product stock quantities.
 *
 * Demo data:
 * - Revenue, order activity, and top-selling product charts.
 * These will be connected when their backend APIs are ready.
 */

import { useEffect, useMemo, useState } from "react";

import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Boxes,
  ClipboardList,
  IndianRupee,
  Package,
  ShoppingCart,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { fetchAdminOverview } from "../services/adminApi";
import "../components/admin/admin.css";

const LOW_STOCK_THRESHOLD = 10;

// Demo sales data until a real orders/revenue API is available.
const salesData = [
  { month: "Jan", revenue: 125000, orders: 42 },
  { month: "Feb", revenue: 158000, orders: 56 },
  { month: "Mar", revenue: 142000, orders: 49 },
  { month: "Apr", revenue: 195000, orders: 68 },
  { month: "May", revenue: 178000, orders: 61 },
  { month: "Jun", revenue: 225000, orders: 79 },
  { month: "Jul", revenue: 208000, orders: 73 },
  { month: "Aug", revenue: 264000, orders: 91 },
  { month: "Sep", revenue: 238000, orders: 84 },
  { month: "Oct", revenue: 298000, orders: 103 },
  { month: "Nov", revenue: 276000, orders: 96 },
  { month: "Dec", revenue: 342000, orders: 118 },
];

// Demo product performance until a real sales API is implemented.
const topProducts = [
  { name: "Patient Monitors", sales: 86 },
  { name: "Oxygen Concentrators", sales: 72 },
  { name: "Wheelchairs", sales: 64 },
  { name: "ECG Machines", sales: 51 },
  { name: "Infusion Pumps", sales: 39 },
];

// Demo recent orders until the backend orders API is available.
const recentOrders = [
  {
    id: "ORD-1048",
    customer: "City Care Hospital",
    product: "Patient Monitor",
    amount: 48500,
    status: "Delivered",
  },
  {
    id: "ORD-1047",
    customer: "Aarogya Medical Center",
    product: "Oxygen Concentrator",
    amount: 32000,
    status: "Processing",
  },
  {
    id: "ORD-1046",
    customer: "LifeLine Clinic",
    product: "ECG Machine",
    amount: 67500,
    status: "Pending",
  },
  {
    id: "ORD-1045",
    customer: "Sunrise Hospital",
    product: "Wheelchair",
    amount: 12500,
    status: "Delivered",
  },
  {
    id: "ORD-1044",
    customer: "HealthFirst Center",
    product: "Infusion Pump",
    amount: 28000,
    status: "Processing",
  },
];

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const formatCompactCurrency = (amount) => {
  const value = Number(amount) || 0;

  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(0)}K`;
  }

  return `₹${value}`;
};

// Reusable tooltip for revenue and order charts.
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="admin-chart-tooltip">
      <p className="admin-tooltip-label">{label}</p>

      {payload.map((item) => (
        <div className="admin-tooltip-row" key={item.dataKey}>
          <span
            className="admin-tooltip-dot"
            style={{ backgroundColor: item.color }}
          />

          <span>{item.name}:</span>

          <strong>
            {item.dataKey === "revenue"
              ? formatCurrency(item.value)
              : item.value}
          </strong>
        </div>
      ))}
    </div>
  );
}

// Reusable metric card used by the dashboard summary.
function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  tone,
  positive = true,
}) {
  return (
    <article className="admin-metric-card">
      <div className="admin-metric-top">
        <div className={`admin-metric-icon ${tone}`}>
          <Icon size={21} />
        </div>

        {change && (
          <span
            className={`admin-metric-change ${
              positive ? "positive" : "negative"
            }`}
          >
            {positive ? (
              <ArrowUpRight size={15} />
            ) : (
              <ArrowDownRight size={15} />
            )}
            {change}
          </span>
        )}
      </div>

      <p className="admin-metric-title">{title}</p>
      <h2 className="admin-metric-value">{value}</h2>
      <p className="admin-metric-description">{description}</p>
    </article>
  );
}

export default function AdminDashboard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load real catalogue and inventory information on mount.
  useEffect(() => {
    let isMounted = true;

    async function loadOverview() {
      try {
        setLoading(true);
        setError("");

        const result = await fetchAdminOverview();

        if (isMounted) {
          setOverview(result);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err.message || "Unable to load product and inventory data."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadOverview();

    return () => {
      isMounted = false;
    };
  }, []);

  const products = overview?.products || [];

  // Calculate inventory status using the real stock quantity.
  const inventoryStats = useMemo(() => {
    const stats = {
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      inventoryUnits: 0,
    };

    for (const product of products) {
      const rawStock = Number(
        product.stockQuantity ?? product.stock ?? 0
      );

      const stock = Number.isFinite(rawStock)
        ? Math.max(0, rawStock)
        : 0;

      stats.inventoryUnits += stock;

      if (stock === 0) {
        stats.outOfStock += 1;
      } else if (stock <= LOW_STOCK_THRESHOLD) {
        stats.lowStock += 1;
      } else {
        stats.inStock += 1;
      }
    }

    return stats;
  }, [products]);

  const inventoryData = [
    {
      name: "In Stock",
      value: inventoryStats.inStock,
      color: "#16a34a",
    },
    {
      name: "Low Stock",
      value: inventoryStats.lowStock,
      color: "#f59e0b",
    },
    {
      name: "Out of Stock",
      value: inventoryStats.outOfStock,
      color: "#ef4444",
    },
  ];

  // Display an empty-state slice when no products are available.
  const inventoryChartData =
    products.length > 0
      ? inventoryData
      : [{ name: "No inventory data", value: 1, color: "#e5e7eb" }];

  const totalProducts = overview?.totalProducts ?? products.length;

  const inventoryUnavailable = loading || Boolean(error);

  return (
    <div className="admin-dashboard">
      {/* Dashboard introduction */}
      <div className="admin-dashboard-heading">
        <div>
          <div className="admin-eyebrow">
            <Activity size={15} />
            MEDICAL COMMERCE ANALYTICS
          </div>

          <h1>Dashboard Overview</h1>

          <p>
            Track sales, monitor medical inventory, and review order activity.
          </p>
        </div>

        <div className="admin-demo-indicator">
          <span />
          {loading
            ? "Loading catalogue..."
            : error
              ? "Catalogue unavailable"
              : "Catalogue connected"}
        </div>
      </div>

      {/* Show a recoverable API error without hiding the dashboard. */}
      {error && (
        <div
          role="alert"
          style={{
            padding: "14px 16px",
            marginBottom: 20,
            border: "1px solid #fecaca",
            borderRadius: 10,
            background: "#fef2f2",
            color: "#991b1b",
          }}
        >
          <strong>Unable to load live inventory data.</strong>
          <p style={{ margin: "6px 0 10px" }}>{error}</p>

          <button
            type="button"
            onClick={() => {
              setOverview(null);
              setError("Please reload the dashboard to retry the request.");
              window.location.reload();
            }}
            style={{
              padding: "8px 12px",
              border: 0,
              borderRadius: 6,
              background: "#b91c1c",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary metrics */}
      <section
        className="admin-metrics-grid"
        aria-label="Business metrics"
      >
        <MetricCard
          title="Total Revenue"
          value="₹12.8L"
          change="12.8%"
          description="Demo analytics — not connected to sales API"
          icon={IndianRupee}
          tone="blue"
        />

        <MetricCard
          title="Total Orders"
          value="1,284"
          change="8.2%"
          description="Demo analytics — not connected to orders API"
          icon={ShoppingCart}
          tone="purple"
        />

        <MetricCard
          title="Medical Products"
          value={
            loading
              ? "Loading..."
              : error
                ? "Unavailable"
                : String(totalProducts)
          }
          description={
            error
              ? "Unable to load catalogue"
              : "Products in the public catalogue"
          }
          icon={Package}
          tone="green"
        />

        <MetricCard
          title="Low Stock Alerts"
          value={
            inventoryUnavailable
              ? loading
                ? "Loading..."
                : "Unavailable"
              : String(inventoryStats.lowStock)
          }
          description={
            error
              ? "Unable to load inventory"
              : `Out of stock: ${
                  inventoryUnavailable ? "—" : inventoryStats.outOfStock
                } · Threshold: ${LOW_STOCK_THRESHOLD} units`
          }
          icon={TriangleAlert}
          tone="orange"
          positive={false}
        />
      </section>

      {/* Revenue chart and live inventory breakdown */}
      <section className="admin-dashboard-main-grid">
        <article className="admin-panel admin-revenue-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Revenue Overview</h2>
              <p>Monthly revenue performance — demo data</p>
            </div>

            <span className="admin-panel-tag">
              <TrendingUp size={14} />
              Demo trend
            </span>
          </div>

          <div className="admin-revenue-summary">
            <strong>₹12,80,000</strong>
            <span>
              <ArrowUpRight size={15} />
              12.8% demo growth
            </span>
          </div>

          <div className="admin-chart-container admin-revenue-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={salesData}
                margin={{ top: 12, right: 8, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="revenueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#2563eb"
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor="#2563eb"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#e9edf5"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b8498", fontSize: 12 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b8498", fontSize: 11 }}
                  tickFormatter={formatCompactCurrency}
                  width={52}
                />

                <Tooltip content={<ChartTooltip />} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#2563eb"
                  strokeWidth={3}
                  fill="url(#revenueGradient)"
                  activeDot={{ r: 5, strokeWidth: 2, fill: "#ffffff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="admin-panel admin-inventory-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Inventory Status</h2>
              <p>Live product stock distribution</p>
            </div>

            <div className="admin-panel-icon">
              <Boxes size={19} />
            </div>
          </div>

          <div className="admin-inventory-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="62%"
                  outerRadius="84%"
                  paddingAngle={products.length > 0 ? 4 : 0}
                  stroke="none"
                >
                  {inventoryChartData.map((item) => (
                    <Cell key={item.name} fill={item.color} />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="admin-inventory-center">
              <strong>
                {loading ? "..." : error ? "—" : totalProducts}
              </strong>
              <span>Products</span>
            </div>
          </div>

          <div className="admin-inventory-legend">
            {inventoryData.map((item) => (
              <div
                className="admin-inventory-legend-row"
                key={item.name}
              >
                <div>
                  <span
                    className="admin-legend-dot"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>

                <strong>
                  {inventoryUnavailable ? "—" : item.value}
                </strong>
              </div>
            ))}
          </div>

          <p
            style={{
              margin: "12px 0",
              color: "#7b8498",
              fontSize: 12,
            }}
          >
            Low stock means 1–{LOW_STOCK_THRESHOLD} units. Out of stock means
            0 units.
          </p>

          <a className="admin-text-link" href="/admin/inventory">
            Manage inventory <ArrowRight size={15} />
          </a>
        </article>
      </section>

      {/* Product performance chart remains demo until sales API exists. */}
      <section className="admin-dashboard-secondary-grid">
        <article className="admin-panel admin-products-chart-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Top-Selling Equipment</h2>
              <p>Demo sales volume — connect sales data for live results</p>
            </div>
          </div>

          <div className="admin-chart-container admin-products-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={topProducts}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid
                  stroke="#e9edf5"
                  strokeDasharray="4 5"
                  horizontal={false}
                />

                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b8498", fontSize: 11 }}
                />

                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={145}
                  tick={{ fill: "#596579", fontSize: 11 }}
                />

                <Tooltip cursor={{ fill: "#f3f6fb" }} />

                <Bar
                  dataKey="sales"
                  name="Units sold (demo)"
                  fill="#0d9488"
                  radius={[0, 6, 6, 0]}
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="admin-panel admin-orders-summary-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Order Activity</h2>
              <p>Monthly order volume — demo data</p>
            </div>
          </div>

          <div className="admin-chart-container admin-orders-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 10, right: 0, left: -18, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#e9edf5"
                  strokeDasharray="4 5"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b8498", fontSize: 10 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#7b8498", fontSize: 10 }}
                />

                <Tooltip content={<ChartTooltip />} />

                <Bar
                  dataKey="orders"
                  name="Orders (demo)"
                  fill="#8b5cf6"
                  radius={[5, 5, 0, 0]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* Recent order table remains demo until the orders API exists. */}
      <section className="admin-panel admin-recent-orders">
        <div className="admin-panel-heading">
          <div>
            <h2>Recent Orders</h2>
            <p>Sample order activity — not live backend data</p>
          </div>

          <a className="admin-text-link" href="/admin/orders">
            View all <ArrowRight size={15} />
          </a>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Equipment</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="admin-order-id">{order.id}</td>
                  <td className="admin-customer-name">{order.customer}</td>
                  <td>{order.product}</td>
                  <td className="admin-order-amount">
                    {formatCurrency(order.amount)}
                  </td>
                  <td>
                    <span
                      className={`admin-order-status ${order.status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      <span />
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="admin-orders-footer">
          <ClipboardList size={16} />
          Sample order activity — connect the orders API for live data.
        </div>
      </section>
    </div>
  );
}
