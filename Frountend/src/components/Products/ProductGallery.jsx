/*
 * ProductGallery
 * -------------------------------------------------------
 * Displays the visual gallery for a single medical product.
 *
 * Responsibilities:
 * - Display the currently selected product image.
 * - Display available image thumbnails.
 * - Allow the customer to switch between images.
 *
 * Why this is a separate component:
 * Product image interaction is independent from pricing,
 * specifications, and other product information.
 *
 * Keeping it isolated also makes it easier to add features
 * such as image zoom, fullscreen preview, or video later.
 */

import { useState } from "react";
import { Maximize2 } from "lucide-react";

function ProductGallery({ images = [], productName }) {
  /*
   * The first image is selected when the product page opens.
   *
   * The component receives the images through props so the
   * same gallery can work with any product.
   */
  const [selectedImage, setSelectedImage] = useState(0);

  /*
   * Prevents the component from breaking when a product
   * temporarily has no image available.
   */
  if (!images.length) {
    return (
      <div
        className="
          flex
          aspect-square
          items-center
          justify-center
          rounded-2xl
          bg-slate-100
          text-sm
          text-slate-400
        "
      >
        Product image unavailable
      </div>
    );
  }

  return (
    <div className="flex flex-col-reverse gap-4 sm:flex-row">

      {/* =================================================
          IMAGE THUMBNAILS
          =================================================
          
          Thumbnails let customers quickly switch between
          different product images without leaving the page.
      ================================================= */}

      <div
        className="
          flex
          gap-3
          overflow-x-auto
          sm:w-20
          sm:flex-col
        "
      >
        {images.map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setSelectedImage(index)}
            aria-label={`View ${productName} image ${index + 1}`}
            className={`
              h-16
              w-16
              shrink-0
              overflow-hidden
              rounded-xl
              border
              bg-white
              transition-all
              duration-200
              ${
                selectedImage === index
                  ? "border-[#1769d1] ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-blue-200"
              }
            `}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              loading="lazy"
              className="
                h-full
                w-full
                object-contain
                p-1
              "
            />
          </button>
        ))}
      </div>


      {/* =================================================
          MAIN PRODUCT IMAGE
          =================================================
          
          This is the primary visual area customers focus on.
          object-contain prevents medical equipment from being
          cropped inside the product gallery.
      ================================================= */}

      <div
        className="
          group
          relative
          flex
          min-h-[420px]
          flex-1
          items-center
          justify-center
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-[#f7faff]
        "
      >
        <img
          src={images[selectedImage]}
          alt={productName}
          className="
            h-full
            max-h-[520px]
            w-full
            object-contain
            p-8
            transition-transform
            duration-500
            group-hover:scale-[1.02]
          "
        />

        {/* 
         * Fullscreen button is kept as a visual control for
         * now. Real fullscreen/zoom behavior can be connected
         * later without changing the gallery structure.
         */}
        <button
          type="button"
          aria-label="View product image larger"
          className="
            absolute
            right-4
            top-4
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            bg-white
            text-slate-600
            shadow-sm
            transition-all
            duration-200
            hover:bg-blue-50
            hover:text-[#1769d1]
          "
        >
          <Maximize2 size={17} />
        </button>
      </div>

    </div>
  );
}

export default ProductGallery;