/*
 * ProductSection
 * -------------------------------------------------------
 * Product listing section for the homepage.
 *
 * Product data is intentionally kept separate from the
 * ProductCard component. This makes it easy to replace
 * the temporary data with an API response later.
 */

import ProductCard from "./ProductCard";

/*
 * Temporary product data.
 *
 * IMPORTANT:
 * This is mock data for the frontend stage.
 * Later these products will come from the backend/database.
 */
const products = [
  {
    name: "Advanced Patient Monitor X7",
    manufacturer: "MedTech Systems",
    price: "2,48,000",
    rating: "4.9",
    sales: 342,
    growth: 18.6,
    discount: 12,
  },
  {
    name: "ECG Pro 500 Cardiac Monitor",
    manufacturer: "CardioCare",
    price: "1,84,500",
    rating: "4.8",
    sales: 286,
    growth: 14.2,
    discount: 8,
  },
  {
    name: "Smart Infusion Pump IP-40",
    manufacturer: "LifeFlow Medical",
    price: "96,000",
    rating: "4.7",
    sales: 218,
    growth: 11.8,
    discount: 15,
  },
  {
    name: "Ventilator V500 Advanced",
    manufacturer: "Respira Medical",
    price: "4,75,000",
    rating: "4.9",
    sales: 164,
    growth: 21.4,
    discount: 10,
  },
];

function ProductSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-[1440px]">

        {/* Section heading */}
        <div className="mb-6 flex items-end justify-between">

          <div>
            <p className="text-sm font-semibold text-[var(--color-blue)]">
              Featured Equipment
            </p>

            <h2
              className="
                mt-1
                text-2xl
                font-bold
                tracking-[-0.03em]
                text-[var(--color-navy)]
              "
            >
              Popular medical equipment
            </h2>
          </div>

          <button
            type="button"
            className="
              hidden
              text-sm
              font-semibold
              text-[var(--color-blue)]
              hover:text-[var(--color-navy)]
              sm:block
            "
          >
            View all products →
          </button>

        </div>

        {/* Product grid */}
        <div
          className="
            grid
            gap-5
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {products.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProductSection;