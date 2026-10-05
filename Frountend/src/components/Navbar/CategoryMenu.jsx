/*
 * CategoryMenu
 * -------------------------------------------------------
 * Displays the main medical equipment mega-menu used by
 * the website navigation.
 *
 * Why this component is separated:
 * - Keeps Navbar.jsx focused on the overall navbar layout.
 * - Keeps category navigation independent and reusable.
 * - Makes the category structure easy to expand later.
 *
 * FUTURE:
 * The category data can be moved from this local array to
 * the backend/database when the admin category management
 * feature is implemented.
 */

import { Link } from "react-router-dom";


/*
 * Category groups
 * -------------------------------------------------------
 * Each group represents a major medical equipment category.
 *
 * The "items" array contains sub-categories that can later
 * be replaced by categories returned from the backend.
 */
const categoryGroups = [
  {
    id: "critical-care",
    title: "ICU & Critical Care",
    description: "Equipment for intensive and critical care environments.",
    items: [
      {
        label: "Ventilators",
        slug: "ventilators",
      },
      {
        label: "ICU Systems",
        slug: "icu-systems",
      },
      {
        label: "Critical Care Equipment",
        slug: "critical-care-equipment",
      },
    ],
  },

  {
    id: "patient-monitoring",
    title: "Patient Monitoring",
    description: "Solutions for monitoring patient health and vital signs.",
    items: [
      {
        label: "Patient Monitors",
        slug: "patient-monitors",
      },
      {
        label: "ECG & Vital Signs",
        slug: "ecg-vital-signs",
      },
      {
        label: "Monitoring Accessories",
        slug: "monitoring-accessories",
      },
    ],
  },

  {
    id: "diagnostic",
    title: "Diagnostic Equipment",
    description: "Equipment used for clinical diagnosis and examination.",
    items: [
      {
        label: "Diagnostic Systems",
        slug: "diagnostic-systems",
      },
      {
        label: "Cardiology Equipment",
        slug: "cardiology-equipment",
      },
      {
        label: "Imaging Equipment",
        slug: "imaging-equipment",
      },
    ],
  },

  {
    id: "laboratory",
    title: "Laboratory Equipment",
    description: "Instruments for laboratory testing and medical research.",
    items: [
      {
        label: "Laboratory Instruments",
        slug: "laboratory-instruments",
      },
      {
        label: "Testing Equipment",
        slug: "testing-equipment",
      },
      {
        label: "Research Equipment",
        slug: "research-equipment",
      },
    ],
  },
];


function CategoryMenu() {
  return (
    /*
     * The menu uses a wide layout so users can quickly scan
     * multiple medical equipment categories without opening
     * several nested dropdowns.
     */
    <div
      className="
        w-[760px]
        overflow-hidden
        border
        border-[var(--color-border)]
        bg-[var(--color-white)]
        shadow-[0_18px_50px_rgba(15,35,60,0.12)]
      "
    >

      {/* =================================================
          MENU HEADER
          ================================================= */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          px-7
          pb-5
          pt-6
        "
      >

        <p
          className="
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-[var(--color-blue)]
          "
        >
          Medical Equipment
        </p>

        <h3
          className="
            mt-1.5
            text-xl
            font-bold
            tracking-[-0.02em]
            text-[var(--color-navy)]
          "
        >
          Browse by category
        </h3>

        <p
          className="
            mt-1.5
            max-w-[600px]
            text-sm
            leading-5
            text-[var(--color-text-muted)]
          "
        >
          Explore healthcare equipment across critical care,
          diagnostics, monitoring and laboratory solutions.
        </p>

      </div>


      {/* =================================================
          CATEGORY GRID
          =================================================
          
          A two-column structure keeps the menu compact while
          still providing enough room for future sub-category
          expansion.
      ================================================= */}

      <div className="grid grid-cols-2">

        {categoryGroups.map((category, index) => (

          <section
            key={category.id}
            className={`
              px-7
              py-6
              transition-colors
              duration-200
              hover:bg-[var(--color-background)]

              ${
                index < 2
                  ? "border-b border-[var(--color-border)]"
                  : ""
              }

              ${
                index % 2 === 0
                  ? "border-r border-[var(--color-border)]"
                  : ""
              }
            `}
          >

            {/* Category heading */}

            <Link
              to={`/products?category=${category.id}`}
              className="
                group
                inline-flex
                items-center
                text-[15px]
                font-bold
                text-[var(--color-navy)]
              "
            >

              <span>
                {category.title}
              </span>

              <span
                className="
                  ml-2
                  text-sm
                  text-[var(--color-blue)]
                  opacity-0
                  transition-all
                  duration-200
                  group-hover:translate-x-1
                  group-hover:opacity-100
                "
              >
                →
              </span>

            </Link>


            {/* Category description */}

            <p
              className="
                mt-1.5
                max-w-[300px]
                text-xs
                leading-5
                text-[var(--color-text-muted)]
              "
            >
              {category.description}
            </p>


            {/* Sub-category links */}

            <div className="mt-4 space-y-1">

              {category.items.map((item) => (

                <Link
                  key={item.slug}
                  to={`/products?category=${item.slug}`}
                  className="
                    group
                    flex
                    w-fit
                    items-center
                    gap-2
                    rounded-md
                    py-1
                    text-sm
                    text-[var(--color-text-muted)]
                    transition-all
                    duration-200
                    hover:text-[var(--color-blue)]
                  "
                >

                  {/* Small navigation indicator */}

                  <span
                    className="
                      h-1
                      w-1
                      rounded-full
                      bg-[var(--color-border)]
                      transition-colors
                      duration-200
                      group-hover:bg-[var(--color-blue)]
                    "
                  />

                  <span>
                    {item.label}
                  </span>

                </Link>

              ))}

            </div>

          </section>

        ))}

      </div>


      {/* =================================================
          VIEW ALL CATEGORIES
          ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-[var(--color-border)]
          px-7
          py-4
        "
      >

        <div>

          <p
            className="
              text-sm
              font-semibold
              text-[var(--color-navy)]
            "
          >
            Looking for something specific?
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            Explore the complete medical equipment catalogue.
          </p>

        </div>


        <Link
          to="/products"
          className="
            group
            inline-flex
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-sm
            font-semibold
            text-[var(--color-blue)]
            transition-colors
            duration-200
            hover:bg-[var(--color-blue-light)]
          "
        >

          <span>
            View all categories
          </span>

          <span
            className="
              transition-transform
              duration-200
              group-hover:translate-x-1
            "
          >
            →
          </span>

        </Link>

      </div>

    </div>
  );
}


export default CategoryMenu;