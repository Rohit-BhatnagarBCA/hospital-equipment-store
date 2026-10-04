/*
 * ProductCard
 * -------------------------------------------------------
 * Reusable product card for displaying medical equipment.
 *
 * The component receives product information through props.
 * This allows the same card to be reused for:
 *
 * - Featured products
 * - Today's deals
 * - Best sellers
 * - Search results
 * - Recommendations
 */

import { Heart, Star, ArrowUpRight } from "lucide-react";

function ProductCard({ product }) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-[var(--color-border)]
        bg-white
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_16px_40px_rgba(16,42,86,0.10)]
      "
    >

      {/* =================================================
          PRODUCT IMAGE AREA
          ================================================= */}

      <div
        className="
          relative
          flex
          h-[230px]
          items-center
          justify-center
          bg-[var(--color-background)]
          p-6
        "
      >

        {/* Product image.
            Replace the placeholder source with the real
            product image when assets are available. */}
        <div
          className="
            flex
            h-full
            w-full
            items-center
            justify-center
            rounded-xl
            bg-white
          "
        >
          <span className="text-xs font-medium text-[var(--color-text-muted)]">
            Product Image
          </span>
        </div>

        {/* Discount badge */}
        {product.discount && (
          <span
            className="
              absolute
              left-4
              top-4
              rounded-lg
              bg-[var(--color-orange)]
              px-2.5
              py-1
              text-[11px]
              font-bold
              text-[var(--color-navy)]
            "
          >
            {product.discount}% OFF
          </span>
        )}

        {/* Wishlist button */}
        <button
          type="button"
          aria-label={`Add ${product.name} to wishlist`}
          className="
            absolute
            right-4
            top-4
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-[var(--color-text-muted)]
            shadow-sm
            transition-all
            duration-200
            hover:text-red-500
          "
        >
          <Heart size={17} strokeWidth={1.8} />
        </button>

      </div>

      {/* =================================================
          PRODUCT INFORMATION
          ================================================= */}

      <div className="p-5">

        {/* Manufacturer */}
        <p className="text-xs font-medium text-[var(--color-text-muted)]">
          {product.manufacturer}
        </p>

        {/* Product name */}
        <h3
          className="
            mt-1
            line-clamp-2
            min-h-[44px]
            text-[15px]
            font-bold
            leading-5
            text-[var(--color-navy)]
          "
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-1">

          <div className="flex text-[var(--color-orange)]">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </div>

          <span className="ml-1 text-xs text-[var(--color-text-muted)]">
            {product.rating}
          </span>

        </div>

        {/* Price */}
        <div className="mt-4 flex items-end justify-between">

          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              Starting from
            </p>

            <p className="mt-0.5 text-xl font-bold text-[var(--color-navy)]">
              ₹{product.price}
            </p>
          </div>

          {/* Product action */}
          <button
            type="button"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-[var(--color-blue-light)]
              text-[var(--color-blue)]
              transition-all
              duration-200
              hover:bg-[var(--color-blue)]
              hover:text-white
            "
            aria-label={`View ${product.name}`}
          >
            <ArrowUpRight size={18} />
          </button>

        </div>

        {/* Sales information */}
        <div
          className="
            mt-4
            border-t
            border-[var(--color-border)]
            pt-4
          "
        >
          <div className="flex items-center justify-between">

            <span className="text-xs text-[var(--color-text-muted)]">
              Monthly sales
            </span>

            <span className="text-xs font-semibold text-[var(--color-navy)]">
              {product.sales} units
            </span>

          </div>

          <div className="mt-2 flex items-center justify-between">

            <span className="text-xs text-[var(--color-text-muted)]">
              Growth
            </span>

            <span className="text-xs font-bold text-emerald-600">
              +{product.growth}%
            </span>

          </div>
        </div>

      </div>
    </article>
  );
}

export default ProductCard;