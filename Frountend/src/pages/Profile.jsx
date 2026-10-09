/*
 * Profile Page
 * -------------------------------------------------------
 * Main customer profile page.
 *
 * This page contains:
 *
 * 1. Profile sidebar
 * 2. Profile information
 * 3. Order summary
 * 4. Recent orders
 *
 * IMPORTANT:
 * Orders are imported from ../data/orders.
 *
 * We do NOT keep another local orders array here.
 */

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";

import AccountSidebar from "../components/Account/AccountSidebar";
import ProfileSection from "../components/Account/ProfileSection";

import OrderSummary from "../components/Profile/Orders/OrderSummary";
import OrdersSection from "../components/Profile/Orders/OrdersSection";

import { orders } from "../data/orders";


function Profile() {

  // =======================================================
  // ORDER STATISTICS
  // =======================================================

  /*
   * Total number of orders.
   */
  const totalOrders = orders.length;


  /*
   * Active orders are orders which are not yet delivered
   * or cancelled.
   */
  const activeOrders = orders.filter(
    (order) =>
      order.status !== "delivered" &&
      order.status !== "cancelled"
  ).length;


  /*
   * Number of successfully delivered orders.
   */
  const deliveredOrders = orders.filter(
    (order) => order.status === "delivered"
  ).length;


  /*
   * Total amount spent across all orders.
   */
  const totalSpending = orders.reduce(
    (total, order) =>
      total + Number(order.amount || 0),
    0
  );


  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="min-h-screen bg-white">

      {/* Global navigation */}
      <Navbar />


      <main className="bg-[#f8fbff]">

        <div
          className="
            mx-auto
            max-w-[1440px]
            px-4
            py-8
            sm:px-6
            lg:px-8
          "
        >

          {/* =================================================
              PAGE HEADER
              ================================================= */}

          <div className="mb-8">

            <p
              className="
                mb-2
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#1769d1]
              "
            >
              My Account
            </p>

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-[#102a4c]
              "
            >
              My Profile
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage your profile information and view your
              recent medical equipment orders.
            </p>

          </div>


          {/* =================================================
              PROFILE LAYOUT
              ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              gap-6
              lg:grid-cols-[260px_minmax(0,1fr)]
            "
          >

            {/* =================================================
                SIDEBAR
                ================================================= */}

            <AccountSidebar />


            {/* =================================================
                MAIN PROFILE CONTENT
                ================================================= */}

            <div className="min-w-0 space-y-6">

              {/* Profile information */}
              <ProfileSection />


              {/* Order statistics */}
              <OrderSummary
                totalOrders={totalOrders}
                activeOrders={activeOrders}
                deliveredOrders={deliveredOrders}
                totalSpending={totalSpending}
              />


              {/* Recent orders */}
              <OrdersSection orders={orders} />

            </div>

          </div>

        </div>

      </main>


      {/* Floating AI assistant */}
      <AiAgent />


      {/* Global footer */}
      <Footer />

    </div>
  );
}


export default Profile;