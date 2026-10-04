/*
 * CategorySection
 * -------------------------------------------------------
 * Displays the major healthcare product categories available
 * on the Medical Sales Intelligence marketplace.
 *
 * Current version:
 * - Uses four broad medical categories.
 * - Category content is stored as structured data.
 * - Each category is rendered through the reusable
 *   CategoryCard component.
 *
 * Future version:
 * - Category data can come from an API.
 * - Admin can create, edit, reorder or remove categories.
 * - Product counts can also come dynamically from the backend.
 *
 * This separation keeps the UI independent from the data source.
 */

import CategoryCard from "./CategoryCard";

/*
 * Category images
 * -------------------------------------------------------
 * Images are kept inside src/images/categories so the project
 * remains organized and category assets are easy to locate.
 */

import diagnosticEquipment from "../../images/categories/diagnostic-equipment.webp";
import patientMonitoring from "../../images/categories/patient-monitoring.webp";
import cardiology from "../../images/categories/cardiology.webp";
import laboratoryEquipment from "../../images/categories/laboratory-equipment.webp";

/*
 * Healthcare category configuration
 * -------------------------------------------------------
 * Keeping category information inside an array allows us to
 * render the complete section using one reusable component.
 *
 * Later this array can be replaced with API data without
 * changing the CategoryCard UI.
 */

const categories = [
  {
    id: "diagnostic-equipment",

    title: "Diagnostic Equipment",

    description:
      "Reliable diagnostic systems and equipment designed to support accurate clinical testing and patient assessment.",

    productCount: 96,

    image: diagnosticEquipment,
  },

  {
    id: "patient-monitoring",

    title: "Patient Monitoring",

    description:
      "Patient monitors and vital-sign equipment for continuous observation across hospitals and clinical environments.",

    productCount: 128,

    image: patientMonitoring,
  },

  {
    id: "cardiology",

    title: "Cardiology & ECG",

    description:
      "ECG machines and cardiovascular equipment built for modern diagnostic and cardiac care requirements.",

    productCount: 74,

    image: cardiology,
  },

  {
    id: "laboratory-equipment",

    title: "Laboratory Equipment",

    description:
      "Laboratory instruments and systems supporting medical testing, analysis and healthcare research.",

    productCount: 87,

    image: laboratoryEquipment,
  },
];

function CategorySection() {
  return (
    <section
      className="
        bg-[#F8FBFF]
        px-4
        py-14
        sm:px-6
        lg:px-8
        lg:py-16
      "
    >
      <div className="mx-auto max-w-[1440px]">

        {/* 
         * Section header
         * -------------------------------------------------
         * Gives the marketplace section a clear hierarchy
         * before users start browsing categories.
         */}
        <div
          className="
            mb-8
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >

          <div>

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
                text-[#1769D1]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#1769D1]
                "
              />

              Healthcare Marketplace
            </div>

            {/* Main section heading */}
            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-[#102A4C]
                sm:text-3xl
              "
            >
              Shop medical equipment by category
            </h2>

            {/* Supporting text */}
            <p
              className="
                mt-2
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Explore essential healthcare equipment across
              major clinical and laboratory categories.
            </p>

          </div>

          {/* 
           * View-all action
           * ------------------------------------------------
           * This will later navigate to the complete category
           * marketplace page.
           */}
          <button
            type="button"
            className="
              hidden
              shrink-0
              items-center
              gap-2
              rounded-lg
              border
              border-blue-100
              bg-white
              px-4
              py-2.5
              text-sm
              font-semibold
              text-[#1769D1]
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-200
              hover:bg-blue-50
              sm:inline-flex
            "
          >
            View all categories

            <span aria-hidden="true">
              →
            </span>
          </button>

        </div>

        {/* 
         * Category grid
         * -------------------------------------------------
         * Responsive layout:
         *
         * Mobile  -> 1 card
         * Tablet  -> 2 cards
         * Desktop -> 4 cards
         *
         * Four cards are intentionally used for the first
         * version. More categories can be added later by
         * adding objects to the categories array.
         */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            xl:grid-cols-4
          "
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              image={category.image}
              title={category.title}
              description={category.description}
              productCount={category.productCount}
            />
          ))}
        </div>

        {/* 
         * Mobile view-all action
         * -------------------------------------------------
         * The desktop button is hidden on smaller screens,
         * therefore we provide a mobile-friendly action here.
         */}
        <div className="mt-7 flex justify-center sm:hidden">

          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-blue-100
              bg-white
              px-5
              py-2.5
              text-sm
              font-semibold
              text-[#1769D1]
              shadow-sm
            "
          >
            View all categories

            <span aria-hidden="true">
              →
            </span>
          </button>

        </div>

      </div>
    </section>
  );
}

export default CategorySection;