/*
 * ProductDetails Page
 * -------------------------------------------------------
 * Displays the complete information of a single medical
 * product.
 *
 * Responsibilities:
 * - Read the product ID from the URL.
 * - Display product gallery and product information.
 * - Display product specifications.
 * - Display related products.
 *
 * IMPORTANT:
 * Product data is still temporary frontend data.
 * Later, productId will be used to fetch the actual product
 * from the backend/database.
 */

import { Link, useParams } from "react-router-dom";

import ProductGallery from "../components/Products/ProductGallery";
import ProductInfo from "../components/Products/ProductInfo";
import ProductSpecs from "../components/Products/ProductSpecs";
import RelatedProducts from "../components/Products/RelatedProducts";


/*
 * =========================================================
 * PRODUCT DATA
 * =========================================================
 *
 * Temporary frontend product data.
 *
 * Later this object will be replaced with data coming from:
 *
 * URL productId
 *      ↓
 * Backend API
 *      ↓
 * Database
 *      ↓
 * ProductDetails
 *
 * Keeping the structure similar to the future API response
 * makes that transition easier.
 */

const product = {
  id: "patient-monitor-pro",

  category: "Patient Monitoring",

  name: "Advanced Multi-Parameter Patient Monitor",

  description:
    "A professional multi-parameter patient monitoring system designed for hospitals, ICUs, emergency departments and clinical environments. The system provides continuous monitoring of essential patient vital signs through a clear and easy-to-read display.",

  rating: 4.8,

  reviews: 126,

  price: 48500,

  originalPrice: 56000,

  discount: 13,

  stock: "In Stock",

  configurations: [
    "Basic",
    "Standard",
    "Advanced",
  ],

  /*
   * Product images.
   *
   * These paths should match the images available inside
   * your public/images or src/images structure.
   *
   * We are using the same image temporarily so the gallery
   * can be tested before adding multiple product images.
   */
  images: [
    "/images/products/patient-monitor.webp",
    "/images/products/patient-monitor.webp",
    "/images/products/patient-monitor.webp",
  ],

  /*
   * Main technical specifications.
   */

  specifications: [
    {
      label: "Display",
      value: '12.1" HD',
    },
    {
      label: "ECG",
      value: "3 / 5 Lead",
    },
    {
      label: "SpO2",
      value: "Yes",
    },
    {
      label: "NIBP",
      value: "Yes",
    },
    {
      label: "Temperature",
      value: "Yes",
    },
    {
      label: "Respiration",
      value: "Yes",
    },
  ],

  /*
   * Additional technical information.
   */

  technicalDetails: [
    {
      label: "Product Type",
      value: "Patient Monitor",
    },
    {
      label: "Application",
      value: "ICU / Hospital",
    },
    {
      label: "Power Supply",
      value: "AC / Battery",
    },
    {
      label: "Battery Backup",
      value: "Up to 4 Hours",
    },
    {
      label: "Warranty",
      value: "2 Years",
    },
    {
      label: "Usage",
      value: "Clinical",
    },
  ],
};


/*
 * =========================================================
 * RELATED PRODUCTS
 * =========================================================
 *
 * Temporary related products.
 *
 * Later these products will be fetched from the backend
 * based on category, tags, product type, or recommendations.
 */

const relatedProducts = [
  {
    id: "digital-ecg-12",

    category: "Cardiology",

    name: "12 Channel Digital ECG Machine",

    description:
      "Professional ECG system with digital waveform display and clinical reporting.",

    rating: 4.7,

    reviews: 94,

    price: 32500,

    originalPrice: 38000,

    discount: 14,

    stock: "In Stock",

    badge: "Featured",

    image: "/images/products/ecg-machine.webp",
  },

  {
    id: "smart-infusion-pump",

    category: "Infusion & IV",

    name: "Smart Volumetric Infusion Pump",

    description:
      "Precision infusion system designed for controlled medication delivery.",

    rating: 4.6,

    reviews: 71,

    price: 27500,

    originalPrice: 32000,

    discount: 14,

    stock: "In Stock",

    badge: "Popular",

    image: "/images/products/infusion-pump.webp",
  },

  {
    id: "icu-ventilator",

    category: "Critical Care",

    name: "Advanced ICU Ventilator System",

    description:
      "Modern respiratory support system designed for intensive care environments.",

    rating: 4.8,

    reviews: 43,

    price: 185000,

    originalPrice: 215000,

    discount: 14,

    stock: "In Stock",

    badge: "Professional",

    image: "/images/products/ventilator.webp",
  },

  {
    id: "portable-ultrasound",

    category: "Diagnostic Equipment",

    name: "Portable Diagnostic Ultrasound System",

    description:
      "Compact ultrasound solution with high-resolution imaging for clinical diagnostics.",

    rating: 4.7,

    reviews: 82,

    price: 165000,

    originalPrice: 190000,

    discount: 13,

    stock: "In Stock",

    badge: "New",

    image: "/images/products/ultrasound-machine.webp",
  },
];


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
   * useParams() gives us:
   *
   * productId = "patient-monitor-pro"
   *
   * Later we will send this ID to the backend API.
   */

  const { productId } = useParams();


  /*
   * Temporary console check.
   *
   * This helps us verify that React Router is correctly
   * reading the dynamic product ID.
   *
   * We can remove this later.
   */

  console.log("Current Product ID:", productId);


  return (
    <main className="min-h-screen bg-white">


      {/* =================================================
          BREADCRUMB
          =================================================
          
          Helps users understand their current location
          inside the product catalogue.
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


          <span
            className="
              text-slate-400
            "
          >
            Products
          </span>


          <span className="text-slate-300">
            /
          </span>


          <span
            className="
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
          
          Gallery appears on the left and product information
          appears on the right on larger screens.
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

          {/* Product image gallery */}

          <ProductGallery
            images={product.images}
            productName={product.name}
          />


          {/* Product information and purchase controls */}

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
          ================================================= */}

      <ProductSpecs
        specifications={product.specifications}
        technicalDetails={product.technicalDetails}
      />


      {/* =================================================
          RELATED PRODUCTS
          ================================================= */}

      <RelatedProducts
        products={relatedProducts}
      />

    </main>
  );
}


export default ProductDetails;