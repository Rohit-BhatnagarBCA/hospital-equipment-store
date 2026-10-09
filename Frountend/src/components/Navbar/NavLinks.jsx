/*
 * NavLinks
 * -------------------------------------------------------
 * Handles the primary navigation links displayed in the
 * desktop navbar.
 *
 * Structure:
 *
 * Products
 * Categories
 * Sales Analytics
 * AI Assistant
 *
 * IMPORTANT:
 * - Products is a normal React Router route.
 * - Categories uses the existing CategoryMenu component.
 * - Sales Analytics and AI Assistant are kept as
 *   "coming soon" actions until their actual pages/routes
 *   are created.
 *
 * This prevents the navbar from sending the user to
 * non-existing routes.
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

import CategoryMenu from "./CategoryMenu";


function NavLinks() {

  /*
   * =======================================================
   * CATEGORY DROPDOWN STATE
   * =======================================================
   *
   * Controls whether the Categories dropdown is visible.
   */

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);


  /*
   * =======================================================
   * NAVIGATION ITEM STYLES
   * =======================================================
   *
   * Keeping the common classes in one place prevents us
   * from repeating the same long Tailwind classes.
   */

  const navItemClasses = `
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
  `;


  /*
   * =======================================================
   * COMING SOON HANDLER
   * =======================================================
   *
   * Sales Analytics and AI Assistant pages are not part
   * of the current AppRoutes yet.
   *
   * We don't create fake routes.
   */

  const handleComingSoon = (feature) => {
    console.log(`${feature} page coming soon`);
  };


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
          PRODUCTS
          =================================================
          
          Products is already a real route:

          /products

          So this is a normal React Router Link.
      ================================================= */}

      <Link
        to="/products"
        className={navItemClasses}
      >
        Products
      </Link>


      {/* =================================================
          CATEGORIES
          =================================================

          Categories does not navigate directly.

          It opens the existing CategoryMenu component.
      ================================================= */}

      <div
        className="relative"
        onMouseEnter={() => setIsCategoryOpen(true)}
        onMouseLeave={() => setIsCategoryOpen(false)}
      >

        {/* Category Trigger */}

        <button
          type="button"
          aria-haspopup="true"
          aria-expanded={isCategoryOpen}
          onClick={() =>
            setIsCategoryOpen((previous) => !previous)
          }
          className={navItemClasses}
        >

          <span>
            Categories
          </span>

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
            CATEGORY MENU
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
          SALES ANALYTICS
          =================================================

          IMPORTANT:
          /sales-analytics route does not exist yet.

          So don't use <Link> here right now.
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          handleComingSoon("Sales Analytics")
        }
        className={navItemClasses}
      >
        Sales Analytics
      </button>


      {/* =================================================
          AI ASSISTANT
          =================================================

          IMPORTANT:
          /ai-assistant route does not exist yet.

          The floating AiAgent already exists separately.
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          handleComingSoon("AI Assistant")
        }
        className={navItemClasses}
      >
        AI Assistant
      </button>

    </nav>
  );
}


export default NavLinks;