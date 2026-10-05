/*
 * NavLinks
 * -------------------------------------------------------
 * Handles the primary navigation links displayed in the
 * desktop navbar.
 *
 * Why this component is separated from Navbar.jsx:
 * - Keeps the main Navbar component clean.
 * - Makes navigation easier to maintain.
 * - Allows individual navigation behavior to be expanded
 *   without making Navbar.jsx too large.
 *
 * Category-specific behavior is handled here by connecting
 * the Categories navigation item with CategoryMenu.jsx.
 */


import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import CategoryMenu from "./CategoryMenu";


/*
 * Navigation configuration
 * -------------------------------------------------------
 * Keeping navigation items in a data structure allows us
 * to add or remove normal navigation links without
 * rewriting the main navigation JSX.
 *
 * Categories is handled separately because it has an
 * interactive dropdown menu.
 */
const navigationLinks = [
  {
    label: "Products",
    path: "/products",
  },

  {
    label: "Sales Analytics",
    path: "/sales-analytics",
  },

  {
    label: "AI Assistant",
    path: "/ai-assistant",
  },
];


function NavLinks() {

  /*
   * Controls whether the category menu is visible.
   *
   * This state is kept locally because the category menu
   * only belongs to the navigation component.
   */
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);


  return (
    <nav
      aria-label="Primary navigation"
      className="
        hidden
        items-center
        gap-1
        xl:flex
      "
    >

      {/* =================================================
          PRODUCTS LINK
          =================================================
          
          Products is a normal application route and does
          not need a dropdown menu.
      ================================================= */}

      <Link
        to="/products"
        className="
          group
          flex
          items-center
          gap-1.5
          rounded-lg
          px-3
          py-2
          text-sm
          font-medium
          text-[var(--color-text-muted)]
          transition-all
          duration-200
          hover:bg-[var(--color-blue-light)]
          hover:text-[var(--color-navy)]
        "
      >
        Products
      </Link>


      {/* =================================================
          CATEGORIES
          =================================================

          Categories uses an interactive menu instead of a
          normal route link.

          The wrapper controls both the navigation trigger
          and the dropdown menu so the menu remains open
          while the pointer moves from the trigger into the
          menu.
      ================================================= */}

      <div
        className="relative"
        onMouseEnter={() => setIsCategoryOpen(true)}
        onMouseLeave={() => setIsCategoryOpen(false)}
      >

        {/* Category trigger */}

        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={isCategoryOpen}
          onClick={() => setIsCategoryOpen((previous) => !previous)}
          className="
            group
            flex
            items-center
            gap-1.5
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-[var(--color-text-muted)]
            transition-all
            duration-200
            hover:bg-[var(--color-blue-light)]
            hover:text-[var(--color-navy)]
          "
        >

          Categories

          <ChevronDown
            size={14}
            strokeWidth={1.8}
            className={`
              transition-transform
              duration-200
              ${isCategoryOpen ? "rotate-180" : ""}
            `}
          />

        </button>


        {/* =================================================
            CATEGORY DROPDOWN
            =================================================

            The menu is rendered only while the category
            navigation item is active.

            "top-full" places the menu directly below the
            navigation trigger.
        ================================================= */}

        {isCategoryOpen && (
          <div
            className="
              absolute
              left-0
              top-full
              z-50
              pt-3
            "
          >

            <CategoryMenu />

          </div>
        )}

      </div>


      {/* =================================================
          OTHER NAVIGATION LINKS
          ================================================= */}

      {navigationLinks.map((item) => (

        /*
         * React Router's Link provides client-side
         * navigation without a full browser reload.
         */
        <Link
          key={item.label}
          to={item.path}
          className="
            group
            flex
            items-center
            gap-1.5
            rounded-lg
            px-3
            py-2
            text-sm
            font-medium
            text-[var(--color-text-muted)]
            transition-all
            duration-200
            hover:bg-[var(--color-blue-light)]
            hover:text-[var(--color-navy)]
          "
        >
          {item.label}
        </Link>

      ))}

    </nav>
  );
}
  
export default NavLinks;