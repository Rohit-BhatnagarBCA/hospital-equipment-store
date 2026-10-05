/*
 * CategoryMenu
 * -------------------------------------------------------
 * Main medical equipment mega-menu.
 *
 * IMPORTANT:
 * Category values are aligned with the actual product
 * catalogue so navigation and product filtering use the
 * same source terminology.
 */

import { Link } from "react-router-dom";


/*
 * Category configuration
 * -------------------------------------------------------
 * These values must match product.category exactly.
 *
 * This keeps the navigation layer compatible with the
 * existing local product catalogue and future API data.
 */
const categoryGroups = [
  {
    id: "Critical Care",
    title: "Critical Care",
    description: "Equipment designed for intensive and emergency care.",
    items: [
      "Ventilators",
      "ICU Equipment",
      "Critical Care Systems",
    ],
  },

  {
    id: "Patient Monitoring",
    title: "Patient Monitoring",
    description: "Systems for continuous monitoring of patient vitals.",
    items: [
      "Patient Monitors",
      "Vital Signs Monitoring",
      "Monitoring Accessories",
    ],
  },

  {
    id: "Cardiology",
    title: "Cardiology",
    description: "Equipment for cardiac monitoring and diagnosis.",
    items: [
      "ECG Machines",
      "Cardiac Monitoring",
      "ECG Accessories",
    ],
  },

  {
    id: "Diagnostic Equipment",
    title: "Diagnostic Equipment",
    description: "Equipment for clinical diagnosis and imaging.",
    items: [
      "Ultrasound Systems",
      "Diagnostic Systems",
      "Imaging Equipment",
    ],
  },

  {
    id: "Infusion & IV",
    title: "Infusion & IV",
    description: "Precision equipment for fluid and medication delivery.",
    items: [
      "Infusion Pumps",
      "IV Equipment",
      "Infusion Accessories",
    ],
  },
];


function CategoryMenu() {
  return (
    <div
      className="
        w-[780px]
        overflow-hidden
        border
        border-[var(--color-border)]
        bg-[var(--color-white)]
        shadow-[0_20px_55px_rgba(15,35,60,0.13)]
      "
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <div
        className="
          border-b
          border-[var(--color-border)]
          px-7
          py-5
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
            tracking-tight
            text-[var(--color-navy)]
          "
        >
          Browse medical equipment
        </h3>

        <p
          className="
            mt-1
            text-sm
            text-[var(--color-text-muted)]
          "
        >
          Find equipment by clinical category.
        </p>

      </div>


      {/* =================================================
          CATEGORY GRID
          ================================================= */}

      <div className="grid grid-cols-3">

        {categoryGroups.map((category) => (

          <div
            key={category.id}
            className="
              border-b
              border-r
              border-[var(--color-border)]
              px-6
              py-5
              transition-colors
              duration-200
              hover:bg-[var(--color-background)]
            "
          >

            {/* Main category */}

            <Link
              to={`/products?category=${encodeURIComponent(category.id)}`}
              className="
                group
                flex
                items-center
                justify-between
                text-sm
                font-bold
                text-[var(--color-navy)]
              "
            >

              <span>
                {category.title}
              </span>

              <span
                className="
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


            {/* Description */}

            <p
              className="
                mt-1.5
                text-xs
                leading-5
                text-[var(--color-text-muted)]
              "
            >
              {category.description}
            </p>


            {/* Sub-category presentation */}

            <div className="mt-3 space-y-1">

              {category.items.map((item) => (

                <p
                  key={item}
                  className="
                    text-xs
                    text-[var(--color-text-muted)]
                  "
                >
                  {item}
                </p>

              ))}

            </div>

          </div>

        ))}

      </div>


      {/* =================================================
          FOOTER
          ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
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
            Explore the complete catalogue
          </p>

          <p
            className="
              mt-0.5
              text-xs
              text-[var(--color-text-muted)]
            "
          >
            Browse all available medical equipment.
          </p>

        </div>


        <Link
          to="/products"
          className="
            group
            flex
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

          View all products

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