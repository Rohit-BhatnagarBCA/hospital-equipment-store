/*
 * Account Page
 * -------------------------------------------------------
 * Main account/dashboard page for the customer.
 *
 * Responsibilities:
 * - Provide the main account layout
 * - Display account navigation
 * - Render account feature sections
 * - Keep account features separated into reusable components
 *
 * IMPORTANT:
 * This page does NOT contain the actual business logic of
 * profile, orders, wishlist or security.
 *
 * Those features will live inside:
 *
 * src/components/Account/
 *
 * Future:
 * - User information will come from the backend API.
 * - Authentication state will be connected later.
 * - Protected route handling will be added with auth.
 */

import { useState } from "react";

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";

import AccountSidebar from "../components/Account/AccountSidebar";
import ProfileSection from "../components/Account/ProfileSection";
import AddressSection from "../components/Account/AddressSection";
import AccountOrders from "../components/Account/AccountOrders";
import WishlistSection from "../components/Account/WishlistSection";
import SecuritySection from "../components/Account/SecuritySection";


function Account() {

  /*
   * =======================================================
   * ACTIVE ACCOUNT SECTION
   * =======================================================
   *
   * Controls which account feature is currently visible.
   *
   * IMPORTANT:
   * This is only frontend navigation for now.
   *
   * Later, individual sections can also have their own
   * routes if the application requires deep linking.
   */

  const [activeSection, setActiveSection] = useState("profile");


  /*
   * =======================================================
   * ACCOUNT SECTION RENDERER
   * =======================================================
   *
   * Keeps the main Account JSX clean.
   *
   * Each feature is handled by its own component.
   */

  const renderActiveSection = () => {

    switch (activeSection) {

      case "profile":
        return <ProfileSection />;

      case "addresses":
        return <AddressSection />;

      case "orders":
        return <AccountOrders />;

      case "wishlist":
        return <WishlistSection />;

      case "security":
        return <SecuritySection />;

      default:
        return <ProfileSection />;
    }
  };


  return (
    <div className="min-h-screen bg-[#f8fbff]">

      {/* =================================================
          GLOBAL NAVIGATION
          ================================================= */}

      <Navbar />


      <main>

        {/* =================================================
            ACCOUNT HEADER
            ================================================= */}

        <section className="border-b border-slate-200 bg-white">

          <div className="
            mx-auto
            max-w-[1440px]
            px-4
            py-10
            sm:px-6
            lg:px-8
          ">

            {/* Small label */}

            <p className="
              text-xs
              font-bold
              uppercase
              tracking-[0.16em]
              text-[#1769d1]
            ">
              My Account
            </p>


            {/* Main heading */}

            <h1 className="
              mt-2
              text-3xl
              font-bold
              tracking-tight
              text-[#102a4c]
              sm:text-4xl
            ">
              Account Dashboard
            </h1>


            {/* Supporting text */}

            <p className="
              mt-3
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
              sm:text-base
            ">
              Manage your profile, addresses, orders,
              wishlist and account security from one place.
            </p>

          </div>

        </section>


        {/* =================================================
            ACCOUNT CONTENT
            ================================================= */}

        <section className="
          px-4
          py-8
          sm:px-6
          lg:px-8
          lg:py-10
        ">

          <div className="
            mx-auto
            grid
            max-w-[1440px]
            gap-6
            lg:grid-cols-[260px_1fr]
            lg:items-start
          ">


            {/* =================================================
                ACCOUNT SIDEBAR
                ================================================= */}

            <AccountSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />


            {/* =================================================
                ACTIVE ACCOUNT FEATURE
                ================================================= */}

            <div className="
              min-w-0
              rounded-2xl
              border
              border-slate-200
              bg-white
              p-5
              shadow-sm
              sm:p-7
            ">

              {renderActiveSection()}

            </div>

          </div>

        </section>

      </main>


      {/* Floating AI assistant */}

      <AiAgent />


      {/* Global footer */}

      <Footer />

    </div>
  );
}


export default Account;