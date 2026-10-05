/*
 * Profile Page
 * -------------------------------------------------------
 * Customer account dashboard.
 *
 * Responsibilities:
 * - Display customer profile information
 * - Display profile sidebar
 * - Display order summary
 * - Display recent orders
 * - Provide a central account dashboard
 *
 * IMPORTANT:
 * This page is currently using frontend/demo data.
 *
 * Later this page can be connected to:
 * - Authenticated user API
 * - Orders API
 * - Profile API
 * - Account settings API
 *
 * Current component structure:
 *
 * Profile.jsx
 *    │
 *    ├── ProfileSidebar
 *    │
 *    ├── ProfileSection
 *    │
 *    ├── OrderSummary
 *    │
 *    └── OrdersSection
 */

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";

import ProfileSidebar from "../components/Profile/ProfileSidebar";
import ProfileSection from "../components/Profile/ProfileSection";
import OrderSummary from "../components/Profile/OrderSummary";
import OrdersSection from "../components/Profile/OrdersSection";


/*
 * =========================================================
 * DEMO ORDER DATA
 * =========================================================
 *
 * Temporary frontend data.
 *
 * Later:
 *
 * GET /api/orders
 *
 * will provide the authenticated user's actual orders.
 */

const orders = [
  {
    id: "ORD-1004",
    orderNumber: "ORD-1004",
    date: "2026-10-01",
    product: {
      name: "Advanced Patient Monitor",
      image: null,
    },
    quantity: 1,
    amount: 85000,
    status: "processing",
  },

  {
    id: "ORD-1003",
    orderNumber: "ORD-1003",
    date: "2026-09-25",
    product: {
      name: "ICU Ventilator System",
      image: null,
    },
    quantity: 1,
    amount: 245000,
    status: "confirmed",
  },

  {
    id: "ORD-1002",
    orderNumber: "ORD-1002",
    date: "2026-09-18",
    product: {
      name: "Digital ECG Machine",
      image: null,
    },
    quantity: 2,
    amount: 96000,
    status: "shipped",
  },

  {
    id: "ORD-1001",
    orderNumber: "ORD-1001",
    date: "2026-09-05",
    product: {
      name: "Hospital Infusion Pump",
      image: null,
    },
    quantity: 2,
    amount: 58000,
    status: "delivered",
  },
];


function Profile() {

  /*
   * =======================================================
   * ORDER SUMMARY DATA
   * =======================================================
   *
   * These values are calculated from the order list.
   *
   * Later the backend can provide these values directly.
   */

  const totalOrders = orders.length;

  const activeOrders = orders.filter(
    (order) =>
      ["processing", "confirmed", "shipped"].includes(
        String(order.status || "").toLowerCase()
      )
  ).length;

  const deliveredOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() ===
      "delivered"
  ).length;

  const totalSpending = orders.reduce(
    (total, order) =>
      total + Number(order.amount || 0),
    0
  );


  /*
   * =======================================================
   * PAGE UI
   * =======================================================
   */

  return (

    <div className="min-h-screen bg-[#f8fbff]">

      {/* =================================================
          GLOBAL NAVIGATION
          ================================================= */}

      <Navbar />


      <main>

        {/* =================================================
            PAGE HEADER
            ================================================= */}

        <section
          className="
            border-b
            border-slate-100
            bg-white
            px-4
            py-10
            sm:px-6
            sm:py-12
            lg:px-8
          "
        >

          <div className="mx-auto max-w-[1440px]">

            {/* Small label */}

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#1769d1]
              "
            >

              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#1769d1]
                "
              />

              My Account

            </div>


            {/* Page title */}

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-[#102a4c]
                sm:text-4xl
              "
            >
              Profile Dashboard
            </h1>


            {/* Description */}

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Manage your profile, review your orders and
              keep track of your medical equipment purchases.
            </p>

          </div>

        </section>


        {/* =================================================
            PROFILE DASHBOARD
            ================================================= */}

        <section
          className="
            px-4
            py-8
            sm:px-6
            sm:py-10
            lg:px-8
            lg:py-12
          "
        >

          <div
            className="
              mx-auto
              grid
              max-w-[1440px]
              gap-6
              lg:grid-cols-[280px_minmax(0,1fr)]
              lg:items-start
            "
          >

            {/* =================================================
                PROFILE SIDEBAR
                ================================================= */}

            <ProfileSidebar />


            {/* =================================================
                MAIN PROFILE CONTENT
                ================================================= */}

            <div
              className="
                min-w-0
                space-y-6
              "
            >

              {/* =================================================
                  PROFILE INFORMATION
                  ================================================= */}

              <ProfileSection />


              {/* =================================================
                  ORDER SUMMARY
                  ================================================= */}

              <OrderSummary
                totalOrders={totalOrders}
                activeOrders={activeOrders}
                deliveredOrders={deliveredOrders}
                totalSpending={totalSpending}
              />


              {/* =================================================
                  ORDERS
                  ================================================= */}

              <OrdersSection
                orders={orders}
              />

            </div>

          </div>

        </section>

      </main>


      {/* =================================================
          FLOATING AI AGENT
          ================================================= */}

      <AiAgent />


      {/* =================================================
          GLOBAL FOOTER
          ================================================= */}

      <Footer />

    </div>

  );
}


export default Profile;