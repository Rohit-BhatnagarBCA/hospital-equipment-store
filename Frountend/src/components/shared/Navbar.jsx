import { useState } from "react";
import {
  Search,
  ShoppingBag,
  UserRound,
  ChevronDown,
  User,
  Package,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import NavLinks from "../Navbar/NavLinks";

/*
  =========================================================
  NAVBAR COMPONENT
  ---------------------------------------------------------
  Medical Sales Intelligence

  Responsibilities:
  1. Brand / Logo
  2. Navigation Links
  3. Product Search
  4. Orders shortcut
  5. Profile dropdown
  6. Mobile account shortcut

  IMPORTANT:
  - Navbar is kept reusable.
  - Profile and Orders use React Router.
  - Search redirects to /products?search=...
  =========================================================
*/

function Navbar() {
  /*
    ---------------------------------------------------------
    State
    ---------------------------------------------------------
    Controls the profile dropdown.
  */
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  /*
    ---------------------------------------------------------
    React Router navigation
    ---------------------------------------------------------
    Used for product search.
  */
  const navigate = useNavigate();

  /*
    ---------------------------------------------------------
    Search Handler
    ---------------------------------------------------------
    Example:
      Search "ECG"
      -> /products?search=ECG
  */
  const handleSearch = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const searchValue = formData.get("search")?.trim();

    if (!searchValue) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(searchValue)}`);
  };

  /*
    ---------------------------------------------------------
    Logout Handler
    ---------------------------------------------------------
    Authentication will be connected later.

    For now we only close the dropdown.
  */
  const handleLogout = () => {
    setIsProfileOpen(false);

    // TODO:
    // Connect actual logout logic here when authentication
    // / backend authentication is implemented.
    console.log("Logout clicked");
  };

  return (
    <header
      className="
        sticky top-0 z-50
        border-b border-[var(--color-border)]
        bg-[var(--color-white)]/95
        backdrop-blur-md
      "
    >
      <div
        className="
          mx-auto flex h-[76px] max-w-[1440px]
          items-center gap-8
          px-6 lg:px-10
        "
      >
        {/* =================================================
            BRAND
            ================================================= */}

        <Link
          to="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Medical Sales Intelligence Home"
        >
          {/* Medical Cross / Brand Mark */}
          <div
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-xl
              bg-[var(--color-blue-light)]
              text-[var(--color-blue)]
              transition-transform duration-300
              group-hover:scale-105
            "
          >
            <div className="text-2xl font-bold leading-none">
              +
            </div>
          </div>

          {/* Brand Name */}
          <div className="hidden sm:block">
            <h1
              className="
                text-[15px]
                font-bold
                tracking-[-0.02em]
                text-[var(--color-navy)]
              "
            >
              Medical Sales
              <span className="text-[var(--color-blue)]">
                {" "}Intelligence
              </span>
            </h1>

            <p
              className="
                mt-0.5
                text-[10px]
                font-medium
                tracking-wide
                text-[var(--color-text-muted)]
              "
            >
              SMARTER HEALTHCARE COMMERCE
            </p>
          </div>
        </Link>

        {/* =================================================
            DESKTOP NAVIGATION
            -------------------------------------------------
            Existing reusable NavLinks component.
            ================================================= */}

        <NavLinks />

        {/* =================================================
            SEARCH BAR
            ================================================= */}

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden w-full max-w-[390px] md:block"
        >
          <label className="relative block">
            {/* Search Icon */}
            <Search
              size={18}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[var(--color-text-muted)]
              "
            />

            {/* Search Input */}
            <input
              type="search"
              name="search"
              placeholder="Search medical products..."
              aria-label="Search medical products"
              className="
                h-11 w-full
                rounded-xl
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                pl-11 pr-4
                text-sm
                text-[var(--color-text)]
                outline-none
                transition-all duration-200

                placeholder:text-[var(--color-text-muted)]

                focus:border-[var(--color-blue)]
                focus:bg-[var(--color-white)]
                focus:ring-4
                focus:ring-[var(--color-blue)]/10
              "
            />
          </label>
        </form>

        {/* =================================================
            RIGHT SIDE ACTIONS
            ================================================= */}

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* =================================================
              ORDERS / SHOPPING BAG
              -------------------------------------------------
              Clicking this takes user to My Orders.
              ================================================= */}

          <Link
            to="/profile/orders"
            aria-label="My Orders"
            title="My Orders"
            className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-lg
              text-[var(--color-navy)]
              transition-colors duration-200
              hover:bg-[var(--color-blue-light)]
            "
          >
            <ShoppingBag
              size={19}
              strokeWidth={1.8}
            />

            {/* Notification Indicator */}
            <span
              className="
                absolute right-1.5 top-1.5
                h-1.5 w-1.5
                rounded-full
                bg-[var(--color-orange)]
              "
            />
          </Link>

          {/* Divider */}
          <div
            className="
              mx-1 hidden h-7 w-px
              bg-[var(--color-border)]
              sm:block
            "
          />

          {/* =================================================
              USER PROFILE
              ================================================= */}

          <div className="relative hidden lg:block">
            {/* Profile Button */}
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen((previous) => !previous)
              }
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
              className="
                flex items-center gap-2
                rounded-xl
                px-2 py-1.5
                transition-colors duration-200
                hover:bg-[var(--color-background)]
              "
            >
              {/* Avatar */}
              <div
                className="
                  flex h-9 w-9
                  items-center justify-center
                  rounded-full
                  bg-[var(--color-navy)]
                  text-xs font-bold
                  text-white
                "
              >
                RB
              </div>

              {/* User Information */}
              <div className="text-left">
                <p
                  className="
                    text-xs font-semibold
                    text-[var(--color-navy)]
                  "
                >
                  Rohit Bhatnagar
                </p>

                <p
                  className="
                    text-[10px]
                    text-[var(--color-text-muted)]
                  "
                >
                  Sales Analyst
                </p>
              </div>

              {/* Dropdown Icon */}
              <ChevronDown
                size={14}
                className={`
                  text-[var(--color-text-muted)]
                  transition-transform duration-200
                  ${isProfileOpen ? "rotate-180" : ""}
                `}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
                ================================================= */}

            {isProfileOpen && (
              <div
                className="
                  absolute right-0 top-[calc(100%+10px)]
                  w-60
                  overflow-hidden
                  rounded-2xl
                  border border-[var(--color-border)]
                  bg-[var(--color-white)]
                  shadow-xl
                "
              >
                {/* Dropdown Header */}
                <div
                  className="
                    border-b
                    border-[var(--color-border)]
                    px-4 py-3
                  "
                >
                  <p
                    className="
                      text-sm font-semibold
                      text-[var(--color-navy)]
                    "
                  >
                    Rohit Bhatnagar
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-xs
                      text-[var(--color-text-muted)]
                    "
                  >
                    Sales Analyst
                  </p>
                </div>

                {/* Profile Link */}
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="
                    flex items-center gap-3
                    px-4 py-3
                    text-sm
                    text-[var(--color-navy)]
                    transition-colors
                    hover:bg-[var(--color-background)]
                  "
                >
                  <User
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>My Profile</span>
                </Link>

                {/* Orders Link */}
                <Link
                  to="/profile/orders"
                  onClick={() => setIsProfileOpen(false)}
                  className="
                    flex items-center gap-3
                    px-4 py-3
                    text-sm
                    text-[var(--color-navy)]
                    transition-colors
                    hover:bg-[var(--color-background)]
                  "
                >
                  <Package
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>My Orders</span>
                </Link>

                {/* Divider */}
                <div className="mx-4 border-t border-[var(--color-border)]" />

                {/* Logout */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex w-full
                    items-center gap-3
                    px-4 py-3
                    text-left
                    text-sm
                    text-[var(--color-navy)]
                    transition-colors
                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  <LogOut
                    size={17}
                    strokeWidth={1.8}
                  />

                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* =================================================
              MOBILE ACCOUNT BUTTON
              ================================================= */}

          <Link
            to="/profile"
            aria-label="My Profile"
            title="My Profile"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-lg
              text-[var(--color-navy)]
              transition-colors
              hover:bg-[var(--color-blue-light)]
              lg:hidden
            "
          >
            <UserRound
              size={19}
              strokeWidth={1.8}
            />
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;