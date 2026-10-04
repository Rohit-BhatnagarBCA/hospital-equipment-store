/*
 * ProductCard
 * -------------------------------------------------------
 * Reusable card used to display a medical product.
 *
 * This component is responsible for:
 * - Displaying product information
 * - Showing product pricing and availability
 * - Providing navigation to the product details page
 *
 * IMPORTANT:
 * The product ID is used to create a dynamic URL.
 *
 * Example:
 * /products/patient-monitor-pro
 *
 * This allows every product to use the same
 * ProductDetails.jsx page.
 */

import { Link } from "react-router-dom";

function ProductCard({
  id,
  image,
  category,
  name,
  description,
  rating,
  reviews,
  price,
  originalPrice,
  discount,
  stock,
  badge,
}) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-100
        hover:shadow-lg
      "
    >

      {/* =================================================
          PRODUCT IMAGE
          ================================================= */}

      <div
        className="
          relative
          h-60
          overflow-hidden
          bg-[#f7faff]
        "
      >

        {/* Optional product badge */}

        {badge && (
          <span
            className="
              absolute
              left-3
              top-3
              z-10
              rounded-md
              bg-[#1769d1]
              px-2.5
              py-1
              text-xs
              font-bold
              text-white
            "
          >
            {badge}
          </span>
        )}


        <img
          src={image}
          alt={name}
          loading="lazy"
          className="
            h-full
            w-full
            object-contain
            p-5
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

      </div>


      {/* =================================================
          PRODUCT INFORMATION
          ================================================= */}

      <div className="p-5">

        {/* Product category */}

        <p
          className="
            text-xs
            font-bold
            uppercase
            tracking-[0.12em]
            text-[#1769d1]
          "
        >
          {category}
        </p>


        {/* Product name */}

        <h3
          className="
            mt-2
            line-clamp-2
            min-h-[48px]
            text-lg
            font-bold
            leading-6
            text-[#102a4c]
          "
        >
          {name}
        </h3>


        {/* Short description */}

        <p
          className="
            mt-2
            line-clamp-2
            text-sm
            leading-5
            text-slate-500
          "
        >
          {description}
        </p>


        {/* =================================================
            RATING
            ================================================= */}

        <div
          className="
            mt-4
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              rounded-md
              bg-[#fff7e8]
              px-2
              py-1
              text-xs
              font-bold
              text-[#8a5a12]
            "
          >
            ★ {rating}
          </span>

          <span
            className="
              text-xs
              text-slate-400
            "
          >
            ({reviews})
          </span>

        </div>


        {/* =================================================
            PRICE
            ================================================= */}

        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            gap-2
          "
        >

          <span
            className="
              text-xl
              font-bold
              text-[#102a4c]
            "
          >
            ₹{price.toLocaleString("en-IN")}
          </span>


          {originalPrice && (
            <span
              className="
                text-sm
                text-slate-400
                line-through
              "
            >
              ₹{originalPrice.toLocaleString("en-IN")}
            </span>
          )}


          {discount && (
            <span
              className="
                rounded-md
                bg-green-50
                px-2
                py-1
                text-xs
                font-bold
                text-green-700
              "
            >
              {discount}% OFF
            </span>
          )}

        </div>


        {/* =================================================
            STOCK
            ================================================= */}

        <div
          className="
            mt-3
            flex
            items-center
            gap-2
          "
        >

          <span
            className="
              h-2
              w-2
              rounded-full
              bg-green-500
            "
          />

          <span
            className="
              text-xs
              font-semibold
              text-green-600
            "
          >
            {stock}
          </span>

        </div>


        {/* =================================================
            PRODUCT DETAILS LINK
            =================================================
            
            Link performs client-side navigation without
            refreshing the entire application.
            
            The product ID creates a unique dynamic URL.
        ================================================= */}

        <Link
          to={`/products/${id}`}
          className="
            mt-5
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-[#1769d1]
            px-4
            py-3
            text-sm
            font-bold
            text-white
            transition-all
            duration-200
            hover:bg-[#0d4fa8]
            active:scale-[0.99]
          "
        >
          View Product
        </Link>

      </div>

    </article>
  );
}

export default ProductCard;