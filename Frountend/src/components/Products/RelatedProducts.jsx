/*
 * RelatedProducts
 * -------------------------------------------------------
 * Displays products that are related to the product currently
 * being viewed.
 *
 * Responsibilities:
 * - Display related medical equipment.
 * - Render reusable ProductCard components.
 * - Pass the correct product ID to ProductCard.
 * - Use the same product data structure as the main catalogue.
 *
 * Why this is a separate component:
 * Recommendation logic and recommendation UI should remain
 * independent from the main ProductDetails page.
 *
 * Future:
 * Related products can later come from the backend,
 * category filtering, admin selection, or AI recommendations.
 */

import { Link } from "react-router-dom";

import ProductCard from "./ProductCard";


function RelatedProducts({
  products = [],
}) {

  /*
   * =======================================================
   * EMPTY STATE
   * =======================================================
   *
   * If no related products are available, we don't render
   * an empty section.
   *
   * This keeps the product details page clean.
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


          {/* =================================================
              VIEW ALL PRODUCTS
              =================================================
              
              This link points to the future product catalogue
              page.
          ================================================= */}

          <Link
            to="/products"
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

          </Link>

        </div>


        {/* =================================================
            RELATED PRODUCTS GRID
            =================================================
            
            IMPORTANT:
            ProductCard requires the product ID.
            
            The ID creates the dynamic URL:
            
            /products/patient-monitor-pro
            
            We also use product.images[0] because the central
            catalogue stores images as an array.
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
             id={product.id}
             image={product.images?.[0]}
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

          <Link
            to="/products"
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

          </Link>

        </div>

      </div>

    </section>
  );
}


export default RelatedProducts;