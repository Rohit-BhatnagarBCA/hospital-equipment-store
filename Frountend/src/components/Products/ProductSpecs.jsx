/*
 * ProductSpecs
 * -------------------------------------------------------
 * Displays the technical specifications of a medical product.
 *
 * Responsibilities:
 * - Display important product specifications
 * - Keep technical information structured and readable
 * - Support different specifications for different products
 *
 * Why this is a separate component:
 * Product specifications can become large and complex.
 * Keeping them separate prevents ProductDetails.jsx from
 * becoming difficult to maintain.
 *
 * Future use:
 * The specification data will eventually come from the
 * backend/database instead of being hardcoded.
 */

import {
  FileText,
  Settings2,
  ShieldCheck,
} from "lucide-react";


function ProductSpecs({
  specifications = [],
  technicalDetails = [],
}) {
  return (
    <section
      className="
        border-t
        border-slate-100
        bg-white
        px-4
        py-12
        sm:px-6
        lg:px-8
      "
    >

      <div className="mx-auto max-w-[1440px]">

        {/* =================================================
            SECTION HEADER
            ================================================= */}

        <div className="mb-8">

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

            Product Information
          </div>


          <h2
            className="
              text-2xl
              font-bold
              tracking-tight
              text-[#102a4c]
              sm:text-3xl
            "
          >
            Specifications & technical details
          </h2>


          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-slate-500
            "
          >
            Review the key technical information and product
            specifications before requesting a quotation.
          </p>

        </div>


        {/* =================================================
            MAIN SPECIFICATION GRID
            ================================================= */}

        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
          "
        >

          {/* =================================================
              KEY SPECIFICATIONS
              ================================================= */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
            "
          >

            {/* Card header */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-slate-100
                bg-[#f7faff]
                px-5
                py-4
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                  text-[#1769d1]
                "
              >
                <Settings2 size={18} />
              </div>


              <div>

                <h3
                  className="
                    text-sm
                    font-bold
                    text-[#102a4c]
                  "
                >
                  Key Specifications
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400
                  "
                >
                  Product specifications
                </p>

              </div>

            </div>


            {/* Specification rows */}

            <div className="divide-y divide-slate-100">

              {specifications.length > 0 ? (

                specifications.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="
                      grid
                      grid-cols-2
                      gap-4
                      px-5
                      py-4
                    "
                  >

                    <span
                      className="
                        text-sm
                        font-medium
                        text-slate-500
                      "
                    >
                      {item.label}
                    </span>


                    <span
                      className="
                        text-right
                        text-sm
                        font-semibold
                        text-[#102a4c]
                      "
                    >
                      {item.value}
                    </span>

                  </div>
                ))

              ) : (

                <div
                  className="
                    px-5
                    py-8
                    text-center
                    text-sm
                    text-slate-400
                  "
                >
                  Specifications will be available soon.
                </div>

              )}

            </div>

          </div>


          {/* =================================================
              TECHNICAL DETAILS
              ================================================= */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
            "
          >

            {/* Card header */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-slate-100
                bg-[#f7faff]
                px-5
                py-4
              "
            >

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                  text-[#1769d1]
                "
              >
                <FileText size={18} />
              </div>


              <div>

                <h3
                  className="
                    text-sm
                    font-bold
                    text-[#102a4c]
                  "
                >
                  Technical Details
                </h3>

                <p
                  className="
                    mt-0.5
                    text-xs
                    text-slate-400
                  "
                >
                  Additional product information
                </p>

              </div>

            </div>


            {/* Technical detail rows */}

            <div className="divide-y divide-slate-100">

              {technicalDetails.length > 0 ? (

                technicalDetails.map((item, index) => (
                  <div
                    key={`${item.label}-${index}`}
                    className="
                      grid
                      grid-cols-2
                      gap-4
                      px-5
                      py-4
                    "
                  >

                    <span
                      className="
                        text-sm
                        font-medium
                        text-slate-500
                      "
                    >
                      {item.label}
                    </span>


                    <span
                      className="
                        text-right
                        text-sm
                        font-semibold
                        text-[#102a4c]
                      "
                    >
                      {item.value}
                    </span>

                  </div>
                ))

              ) : (

                <div
                  className="
                    px-5
                    py-8
                    text-center
                    text-sm
                    text-slate-400
                  "
                >
                  Technical details will be available soon.
                </div>

              )}

            </div>

          </div>

        </div>


        {/* =================================================
            TRUST INFORMATION
            =================================================
            
            This small area communicates that the product
            information is intended for business buyers.
        ================================================= */}

        <div
          className="
            mt-6
            flex
            flex-col
            gap-3
            rounded-xl
            border
            border-blue-100
            bg-blue-50/50
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <ShieldCheck
              size={20}
              className="shrink-0 text-[#1769d1]"
            />

            <p
              className="
                text-sm
                font-medium
                text-slate-600
              "
            >
              Need detailed specifications or documentation?
            </p>

          </div>


          <button
            type="button"
            className="
              shrink-0
              text-left
              text-sm
              font-bold
              text-[#1769d1]
              hover:underline
              sm:text-right
            "
          >
            Request product documentation →
          </button>

        </div>

      </div>

    </section>
  );
}

export default ProductSpecs;