/*
 * ProfileSidebar
 * -------------------------------------------------------
 * Reusable navigation sidebar for the user's profile area.
 *
 * Responsibilities:
 * - Display profile navigation
 * - Highlight the active section
 * - Provide navigation to profile-related pages
 * - Keep profile navigation separate from ProfileSection
 *
 * IMPORTANT:
 * This component does NOT contain user authentication logic.
 *
 * Future:
 * - Active route handling
 * - Protected routes
 * - Orders page
 * - Saved products
 * - Security settings
 * - Logout API
 */

import { NavLink } from "react-router-dom";

import {
  UserRound,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Settings,
  LogOut,
} from "lucide-react";


/*
 * =========================================================
 * PROFILE NAVIGATION
 * =========================================================
 *
 * Keeping navigation items inside a data structure makes
 * the sidebar easier to maintain.
 *
 * New profile sections can be added without rewriting
 * the complete JSX structure.
 */

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

  {
    label: "Saved Products",
    path: "/profile/saved",
    icon: Heart,
  },

  {
    label: "Security",
    path: "/profile/security",
    icon: ShieldCheck,
  },

  {
    label: "Account Settings",
    path: "/profile/settings",
    icon: Settings,
  },
];


function ProfileSidebar() {
  /*
   * =======================================================
   * LOGOUT HANDLER
   * =======================================================
   *
   * This is only a placeholder for now.
   *
   * Later this will call the authentication system:
   *
   * logout()
   *      ↓
   * Backend
   *      ↓
   * Session / token removed
   *      ↓
   * Redirect to login
   *
   * We are intentionally NOT putting authentication logic
   * directly inside this UI component yet.
   */

  const handleLogout = () => {
    console.log("Logout clicked");

    /*
     * Future:
     *
     * await logout();
     * navigate("/login");
     */
  };


  return (
    <aside
      className="
        w-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        lg:w-[270px]
        lg:shrink-0
      "
    >

      {/* =================================================
          PROFILE SIDEBAR HEADER
          ================================================= */}

      <div className="border-b border-slate-100 p-5">

        <div className="flex items-center gap-3">

          {/* User avatar */}

          <div
            className="
              flex
              h-12
              w-12
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#102a4c]
              text-sm
              font-bold
              text-white
            "
          >
            RB
          </div>


          {/* User information */}

          <div className="min-w-0">

            <h2
              className="
                truncate
                text-sm
                font-bold
                text-[#102a4c]
              "
            >
              Rohit Bhatnagar
            </h2>

            <p
              className="
                mt-0.5
                truncate
                text-xs
                text-slate-500
              "
            >
              Sales Analyst
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          NAVIGATION
          ================================================= */}

      <nav
        aria-label="Profile navigation"
        className="p-3"
      >

        <p
          className="
            mb-2
            px-3
            py-2
            text-[10px]
            font-bold
            uppercase
            tracking-[0.14em]
            text-slate-400
          "
        >
          Account
        </p>


        <div className="space-y-1">

          {profileNavigation.map((item) => {

            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/profile"}
                className={({ isActive }) => `
                  group
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isActive
                      ? `
                        bg-[#eaf3ff]
                        text-[#1769d1]
                      `
                      : `
                        text-slate-600
                        hover:bg-slate-50
                        hover:text-[#102a4c]
                      `
                  }
                `}
              >

                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className="
                        shrink-0
                        transition-transform
                        duration-200
                        group-hover:scale-105
                      "
                    />

                    <span>
                      {item.label}
                    </span>
                  </>
                )}

              </NavLink>
            );

          })}

        </div>

      </nav>


      {/* =================================================
          LOGOUT
          ================================================= */}

      <div className="border-t border-slate-100 p-3">

        <button
          type="button"
          onClick={handleLogout}
          className="
            group
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            px-3
            py-2.5
            text-sm
            font-medium
            text-slate-600
            transition-all
            duration-200
            hover:bg-red-50
            hover:text-red-600
          "
        >

          <LogOut
            size={18}
            strokeWidth={1.8}
            className="
              transition-transform
              duration-200
              group-hover:-translate-x-0.5
            "
          />

          <span>
            Logout
          </span>

        </button>

      </div>

    </aside>
  );
}


export default ProfileSidebar;