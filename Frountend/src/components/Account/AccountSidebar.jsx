/*
 * Account Sidebar
 * -------------------------------------------------------
 * Navigation for customer account pages.
 *
 * Currently available:
 *
 * /profile
 * /profile/orders
 *
 * Saved Products, Security and Account Settings will be
 * added later when their actual pages are created.
 */

import { NavLink } from "react-router-dom";

import {
  UserRound,
  ShoppingBag,
  LogOut,
} from "lucide-react";


function AccountSidebar() {

  // =======================================================
  // VALID PROFILE NAVIGATION
  // =======================================================

  const profileNavigation = [
    {
      label: "Profile Overview",
      path: "/profile",
      icon: UserRound,
    },

    {
      label: "My Orders",
      path: "/profile/orders",
      icon: ShoppingBag,
    },
  ];


  // =======================================================
  // LOGOUT
  // =======================================================

  const handleLogout = () => {

    /*
     * Authentication is not connected yet.
     *
     * Later this function will:
     *
     * 1. Clear authentication token
     * 2. Clear user session
     * 3. Redirect to login
     *
     * For now we only keep the handler ready.
     */

    console.log("Logout clicked");

  };


  // =======================================================
  // UI
  // =======================================================

  return (
    <aside
      className="
        h-fit
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-3
        shadow-sm
      "
    >

      {/* =================================================
          PROFILE LABEL
          ================================================= */}

      <div
        className="
          mb-2
          px-3
          py-2
          text-xs
          font-bold
          uppercase
          tracking-[0.14em]
          text-slate-400
        "
      >
        My Account
      </div>


      {/* =================================================
          NAVIGATION
          ================================================= */}

      <nav className="space-y-1">

        {profileNavigation.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/profile"}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-semibold
                  transition

                  ${
                    isActive
                      ? `
                        bg-[#eef6ff]
                        text-[#1769d1]
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-[#1769d1]
                      `
                  }
                `
              }
            >

              <Icon size={18} />

              <span>
                {item.label}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* =================================================
          DIVIDER
          ================================================= */}

      <div className="my-3 border-t border-slate-100" />


      {/* =================================================
          LOGOUT
          ================================================= */}

      <button
        type="button"
        onClick={handleLogout}
        className="
          flex
          w-full
          items-center
          gap-3
          rounded-xl
          px-3
          py-3
          text-sm
          font-semibold
          text-slate-600
          transition
          hover:bg-red-50
          hover:text-red-600
        "
      >

        <LogOut size={18} />

        <span>
          Logout
        </span>

      </button>

    </aside>
  );
}


export default AccountSidebar;