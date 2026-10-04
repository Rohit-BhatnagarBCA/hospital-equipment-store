/*
 * ProductSection
 * -------------------------------------------------------
 * Displays featured medical products on the home page.
 *
 * Responsibilities:
 * - Read product data from the central product catalogue.
 * - Render reusable ProductCard components.
 * - Control the responsive product grid.
 * - Provide a link to browse all products.
 *
 * IMPORTANT:
 * Product information is NOT hardcoded here.
 *
 * The data comes from:
 *
 * src/data/products.js
 *
 * This keeps the homepage UI separate from product data.
 */


import { Link } from "react-router-dom";

import ProductCard from "../Products/ProductCard";

import { products } from "../../data/products";


function ProductSection() {

  /*
   * =======================================================
   * FEATURED PRODUCTS
   * =======================================================
   *
   * For now we display the first 5 products from our local
   * catalogue.
   *
   * Later this can be replaced with:
   *
   * - Featured products from the backend
   * - Admin-selected products
   * - Best-selling products
   * - New arrivals
   *
   * slice() prevents the entire catalogue from appearing
   * on the homepage.
   */

  const featuredProducts = products.slice(0, 5);


  return (
    <section
      className="
        bg-white
        px-4
        py-14
        sm:px-6
        lg:px-8
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

          {/* Heading content */}

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

              Featured Products

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
              Explore medical equipment
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
              Browse selected medical equipment from
              monitoring systems to critical care devices.
            </p>

          </div>


          {/* =================================================
              VIEW ALL PRODUCTS
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
              sm:flex
            "
          >
            View all products

            <span>
              →
            </span>

          </Link>

        </div>


        {/* =================================================
            PRODUCT GRID
            =================================================
            
            Responsive layout:
            
            Mobile   → 1 column
            Small    → 2 columns
            Large    → 3 columns
            XL       → 5 columns
            
            Five cards fit nicely across the large desktop
            layout while keeping enough space for product
            information.
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            gap-5
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-5
          "
        >

          {featuredProducts.map((product) => (

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
            MOBILE VIEW-ALL BUTTON
            ================================================= */}

        <div
          className="
            mt-7
            flex
            justify-center
            sm:hidden
          "
        >

          <Link
            to="/products"
            className="
              flex
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

            <span>
              →
            </span>

          </Link>

        </div>

      </div>

    </section>
  );
}


export default ProductSection;