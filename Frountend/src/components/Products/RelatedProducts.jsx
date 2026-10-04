/*
 * RelatedProducts
 * -------------------------------------------------------
 * Displays products that are related to the product currently
 * being viewed.
 *
 * Responsibilities:
 * - Display a related-products section
 * - Render reusable ProductCard components
 * - Keep recommendation logic separate from the product page
 *
 * Why this is a separate component:
 * The ProductDetails page should mainly compose sections.
 * Recommendation logic can become more advanced later,
 * so keeping it isolated makes the page easier to maintain.
 *
 * Future functionality:
 * Related products can eventually come from the backend
 * based on category, product type, tags, or AI recommendations.
 */

import ProductCard from "./ProductCard";


function RelatedProducts({
  products = [],
}) {
  /*
   * If there are no related products, the section should not
   * occupy unnecessary space on the product details page.
   *
   * This also makes the component safe to use while API data
   * is still loading or when a product has no recommendations.
   */
  if (!products.length) {
    return null;
  }


  return (
    <section
      className="
        border-t
        border-slate-100
        bg-[#f8fbff]
        px-4
        py-14
        sm:px-6
        lg:px-8
        lg:py-16
      "
    >

      <div className="mx-auto max-w-[1440px]">

        {/* =================================================
            SECTION HEADER
            ================================================= */}

        <div
          className="
            mb-8
            flex
            flex-col
            gap-4
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
                tracking-[0.15em]
                text-[#1769d1]
              "
            >
              <span
                className="
                  h-1.5
                  w-1.5
                  rounded-full
                  bg-[#1769d1]
                "
              />

              You may also need
            </div>


            {/* Main heading */}

            <h2
              className="
                text-2xl
                font-bold
                tracking-tight
                text-[#102a4c]
                sm:text-3xl
              "
            >
              Related medical equipment
            </h2>


            {/* Supporting description */}

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
              Explore similar equipment and products commonly
              considered together.
            </p>

          </div>


          {/* View all products action */}

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
              text-[#1769d1]
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-200
              hover:bg-blue-50
              sm:inline-flex
            "
          >
            View all products

            <span aria-hidden="true">
              →
            </span>
          </button>

        </div>


        {/* =================================================
            RELATED PRODUCTS GRID
            =================================================
            
            ProductCard already handles:
            - Image
            - Name
            - Rating
            - Price
            - Discount
            - Stock
            - Product actions
            
            This component only controls the section and
            decides which products should be displayed.
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          "
        >

          {products.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image}
              category={product.category}
              name={product.name}
              description={product.description}
              rating={product.rating}
              reviews={product.reviews}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              stock={product.stock}
              badge={product.badge}
            />
          ))}

        </div>


        {/* =================================================
            MOBILE VIEW-ALL ACTION
            ================================================= */}

        <div className="mt-8 flex justify-center sm:hidden">

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
              text-[#1769d1]
              shadow-sm
            "
          >
            View all products

            <span aria-hidden="true">
              →
            </span>

          </button>

        </div>

      </div>

    </section>
  );
}

export default RelatedProducts;