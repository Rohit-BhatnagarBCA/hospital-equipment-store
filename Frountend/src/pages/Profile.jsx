/*
 * Profile Page
 * -------------------------------------------------------
 * Main customer account dashboard.
 *
 * Responsibilities:
 * - Display customer profile
 * - Display account sidebar
 * - Display order summary
 * - Display recent orders
 *
 * Current structure:
 *
 * Profile.jsx
 *    │
 *    ├── AccountSidebar
 *    ├── ProfileSection
 *    ├── OrderSummary
 *    └── OrdersSection
 *
 * IMPORTANT:
 * This page currently uses frontend/demo order data.
 *
 * Later:
 *
 * Backend API
 *      ↓
 * Authenticated customer
 *      ↓
 * Real profile + order data
 */

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";


// =========================================================
// ACCOUNT COMPONENTS
// =========================================================

// Actual sidebar file in this project.
import AccountSidebar from "../components/Account/AccountSidebar";

// Profile information section.
import ProfileSection from "../components/Account/ProfileSection";


// =========================================================
// ORDER COMPONENTS
// =========================================================

// Order summary is inside the Orders folder.
import OrderSummary from "../components/Profile/Orders/OrderSummary";

// Recent order list.
import OrdersSection from "../components/Profile/Orders/OrdersSection";


// =========================================================
// TEMPORARY DEMO ORDERS
// =========================================================
//
// These orders are only for frontend UI development.
//
// Later they will come from:
// GET /api/orders
//

const orders = [

  {
    id: "ORD-1001",
    orderNumber: "MSI-1001",
    date: "2026-09-28",

    product: {
      name: "Advanced Patient Monitoring System",
      image: "/products/patient-monitor.png",
    },

    quantity: 1,
    amount: 85000,
    status: "delivered",
  },


  {
    id: "ORD-1002",
    orderNumber: "MSI-1002",
    date: "2026-09-30",

    product: {
      name: "ICU Ventilator Pro",
      image: "/products/icu-ventilator.png",
    },

    quantity: 2,
    amount: 145000,
    status: "shipped",
  },


  {
    id: "ORD-1003",
    orderNumber: "MSI-1003",
    date: "2026-10-01",

    product: {
      name: "Digital ECG Machine",
      image: "/products/digital-ecg.png",
    },

    quantity: 1,
    amount: 42000,
    status: "processing",
  },

];



function Profile() {

  /*
   * =======================================================
   * ORDER SUMMARY CALCULATIONS
   * =======================================================
   */

  // Total number of orders.
  const totalOrders = orders.length;


  // Orders which are still active.
  //
  // Delivered and cancelled orders are not considered
  // active.
  const activeOrders = orders.filter(
    (order) => {

      const status = String(order.status || "")
        .toLowerCase();

      return (
        status !== "delivered" &&
        status !== "cancelled"
      );

    }
  ).length;


  // Total delivered orders.
  const deliveredOrders = orders.filter(
    (order) =>
      String(order.status || "").toLowerCase() ===
      "delivered"
  ).length;


  // Total amount spent across all orders.
  const totalSpending = orders.reduce(
    (total, order) =>
      total + Number(order.amount || 0),
    0
  );


  return (

    <div className="min-h-screen bg-[#f8fbff]">


      {/* =================================================
          GLOBAL NAVBAR
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

          <div
            className="
              mx-auto
              max-w-[1440px]
            "
          >

            {/* Small section label */}

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
              lg:grid-cols-[270px_minmax(0,1fr)]
              lg:items-start
            "
          >


            {/* =================================================
                ACCOUNT SIDEBAR
                ================================================= */}

            <AccountSidebar />


            {/* =================================================
                MAIN ACCOUNT CONTENT
                ================================================= */}

            <div
              className="
                min-w-0
                space-y-8
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
                  RECENT ORDERS
                  ================================================= */}

              <OrdersSection
                orders={orders}
              />


            </div>

          </div>

        </section>

      </main>


      {/* =================================================
          FLOATING AI ASSISTANT
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