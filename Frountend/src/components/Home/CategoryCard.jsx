/*
 * CategoryCard
 * -------------------------------------------------------
 * Reusable card used to display a single medical equipment
 * category on the home page.
 *
 * Why this component exists:
 * - Keeps category UI separate from category data.
 * - Allows the same card design to be reused anywhere.
 * - Makes future API/Admin driven categories easier to support.
 *
 * Future improvement:
 * The category data can later come from the backend instead
 * of being hardcoded inside CategorySection.
 */

import { ArrowUpRight } from "lucide-react";

function CategoryCard({
  image,
  title,
  description,
  productCount,
}) {
  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-blue-200
        hover:shadow-xl
      "
    >
      {/* 
       * Category image
       * ---------------------------------------------------
       * The image provides the main visual identity of the
       * category and makes the section feel like a real
       * healthcare marketplace instead of a simple dashboard.
       */}
      <div className="relative h-52 overflow-hidden bg-slate-50">
        <img
          src={image}
          alt={title}
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            ease-out
            group-hover:scale-105
          "
        />

        {/* 
         * Soft image overlay
         * -------------------------------------------------
         * Improves readability if additional content is
         * placed over the image in the future.
         */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/20
            via-transparent
            to-transparent
          "
        />

        {/* 
         * Product count badge
         * -------------------------------------------------
         * Gives users a quick idea about how many products
         * are available in this category.
         */}
        <div
          className="
            absolute
            right-3
            top-3
            rounded-full
            bg-white/95
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#12345B]
            shadow-sm
            backdrop-blur
          "
        >
          {productCount}+ Products
        </div>
      </div>

      {/* Category information */}
      <div className="p-5">

        {/* Category title */}
        <h3
          className="
            text-lg
            font-bold
            tracking-tight
            text-[#102A4C]
          "
        >
          {title}
        </h3>

        {/* Category description */}
        <p
          className="
            mt-2
            min-h-[48px]
            text-sm
            leading-6
            text-slate-500
          "
        >
          {description}
        </p>

        {/* Explore category action */}
        <button
          type="button"
          className="
            mt-5
            inline-flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#1769D1]
            transition-colors
            duration-200
            hover:text-[#0D4FA8]
          "
        >
          Explore products

          <ArrowUpRight
            size={16}
            className="
              transition-transform
              duration-200
              group-hover:-translate-y-0.5
              group-hover:translate-x-0.5
            "
          />
        </button>

      </div>
    </article>
  );
}

export default CategoryCard;