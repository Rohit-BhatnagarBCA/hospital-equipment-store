/*
 * ProductDetails Page
 * -------------------------------------------------------
 * Displays the complete information of a single medical
 * product.
 *
 * Responsibilities:
 * - Read the product ID from the URL.
 * - Find the correct product from the central catalogue.
 * - Display the product gallery.
 * - Display product information.
 * - Display specifications and technical details.
 * - Display related products.
 *
 * IMPORTANT:
 * This page does NOT maintain its own product data.
 *
 * All product information comes from:
 *
 * src/data/products.js
 *
 * This creates a single source of truth.
 *
 * Future:
 * The same structure can later be connected to a backend
 * API without changing the ProductDetails UI architecture.
 */

import { Link, useParams } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";

import ProductGallery from "../components/Products/ProductGallery";
import ProductInfo from "../components/Products/ProductInfo";
import ProductSpecs from "../components/Products/ProductSpecs";
import RelatedProducts from "../components/Products/RelatedProducts";

import {
  getProductById,
  products,
} from "../data/products";


function ProductDetails() {

  /*
   * =======================================================
   * READ PRODUCT ID FROM URL
   * =======================================================
   *
   * Our route is:
   *
   * /products/:productId
   *
   * Example:
   *
   * /products/patient-monitor-pro
   *
   * useParams() reads "patient-monitor-pro" from the URL.
   *
   * This allows every product to use the same
   * ProductDetails.jsx page.
   */

  const { productId } = useParams();


  /*
   * =======================================================
   * FIND CURRENT PRODUCT
   * =======================================================
   *
   * Instead of keeping another hardcoded product object
   * inside this page, we search the central product catalogue.
   *
   * This is important because:
   *
   * ProductCard
   *      ↓
   * product.id
   *      ↓
   * /products/:productId
   *      ↓
   * getProductById()
   *      ↓
   * Correct product
   *
   * This prevents different product data from becoming
   * duplicated across the application.
   */

  const product = getProductById(productId);


  /*
   * =======================================================
   * PRODUCT NOT FOUND
   * =======================================================
   *
   * If somebody opens an invalid URL such as:
   *
   * /products/abc-xyz
   *
   * getProductById() returns undefined.
   *
   * Instead of crashing the page, we show a friendly
   * "Product Not Found" screen.
   */

  if (!product) {
    return (
      <div className="min-h-screen bg-white">

        {/* Global navigation */}
        <Navbar />

        <main
          className="
            flex
            min-h-[60vh]
            items-center
            justify-center
            px-4
            py-20
          "
        >

          <div className="max-w-lg text-center">

            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#1769d1]
              "
            >
              Product not found
            </p>

            <h1
              className="
                mt-3
                text-3xl
                font-bold
                tracking-tight
                text-[#102a4c]
              "
            >
              We couldn't find this product
            </h1>

            <p
              className="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              The product may have been removed or the URL
              may be incorrect.
            </p>

            <Link
              to="/"
              className="
                mt-7
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-[#1769d1]
                px-5
                py-3
                text-sm
                font-bold
                text-white
                transition-colors
                duration-200
                hover:bg-[#0d4fa8]
              "
            >
              Back to Home
            </Link>

          </div>

        </main>

        <Footer />

      </div>
    );
  }


  /*
   * =======================================================
   * RELATED PRODUCTS
   * =======================================================
   *
   * We first try to find products from the same category.
   *
   * If there are not enough products in that category,
   * other products are used as fallback recommendations.
   *
   * The current product is always excluded.
   *
   * This is temporary frontend recommendation logic.
   *
   * Later this can be replaced with:
   *
   * - Backend recommendations
   * - Category based filtering
   * - Admin-selected related products
   * - AI recommendations
   */

  const sameCategoryProducts = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category
  );


  const otherProducts = products.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category
  );


  const relatedProducts = [
    ...sameCategoryProducts,
    ...otherProducts,
  ].slice(0, 4);


  return (
    <div className="min-h-screen bg-white">

      {/* =================================================
          GLOBAL NAVIGATION
          ================================================= */}

      <Navbar />


      <main>

        {/* =================================================
            BREADCRUMB
            =================================================
            
            Shows the customer's current position inside
            the product catalogue.
        ================================================= */}

        <div
          className="
            border-b
            border-slate-100
            bg-white
            px-4
            py-4
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              mx-auto
              flex
              max-w-[1440px]
              flex-wrap
              items-center
              gap-2
              text-sm
            "
          >

            <Link
              to="/"
              className="
                text-slate-400
                transition-colors
                hover:text-[#1769d1]
              "
            >
              Home
            </Link>


            <span className="text-slate-300">
              /
            </span>


            <span className="text-slate-400">
              Products
            </span>


            <span className="text-slate-300">
              /
            </span>


            <span
              className="
                max-w-[280px]
                truncate
                font-medium
                text-[#102a4c]
              "
            >
              {product.name}
            </span>

          </div>

        </div>


        {/* =================================================
            MAIN PRODUCT AREA
            =================================================
            
            Product gallery appears on the left.
            Product information appears on the right.
            
            On smaller screens the layout automatically
            becomes a single column.
        ================================================= */}

        <section
          className="
            px-4
            py-8
            sm:px-6
            sm:py-10
            lg:px-8
            lg:py-12
          "
        >

          <div
            className="
              mx-auto
              grid
              max-w-[1440px]
              gap-10
              lg:grid-cols-[1.05fr_0.95fr]
              lg:items-start
              lg:gap-14
            "
          >

            {/* =================================================
                PRODUCT GALLERY
                =================================================
                
                The images come directly from:
                
                product.images
                
                These images are imported by products.js,
                so Vite handles their final URLs correctly.
            ================================================= */}

            <ProductGallery
              images={product.images}
              productName={product.name}
            />


            {/* =================================================
                PRODUCT INFORMATION
                ================================================= */}

            <ProductInfo
              category={product.category}
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              stock={product.stock}
              configurations={product.configurations}
            />

          </div>

        </section>


        {/* =================================================
            PRODUCT OVERVIEW
            ================================================= */}

        <section
          className="
            border-t
            border-slate-100
            px-4
            py-12
            sm:px-6
            lg:px-8
          "
        >

          <div
            className="
              mx-auto
              max-w-[1440px]
            "
          >

            <div className="max-w-4xl">

              <p
                className="
                  mb-3
                  text-xs
                  font-bold
                  uppercase
                  tracking-[0.15em]
                  text-[#1769d1]
                "
              >
                Product Overview
              </p>


              <h2
                className="
                  text-2xl
                  font-bold
                  tracking-tight
                  text-[#102a4c]
                  sm:text-3xl
                "
              >
                About this product
              </h2>


              <p
                className="
                  mt-4
                  text-sm
                  leading-7
                  text-slate-600
                  sm:text-base
                "
              >
                {product.description}
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            PRODUCT SPECIFICATIONS
            =================================================
            
            Specifications and technical details are kept
            inside a reusable component so this page only
            composes the product sections.
        ================================================= */}

        <ProductSpecs
          specifications={product.specifications}
          technicalDetails={product.technicalDetails}
        />


        {/* =================================================
            RELATED PRODUCTS
            =================================================
            
            The same central product catalogue is used here.
            This prevents duplicate product data.
        ================================================= */}

        <RelatedProducts
          products={relatedProducts}
        />

      </main>


      {/* Floating AI Agent */}
      <AiAgent />


      {/* Global footer */}
      <Footer />

    </div>
  );
}


export default ProductDetails;