/*
 * OfferBanner
 * -------------------------------------------------------
 * Main promotional banner displayed near the top of the
 * marketplace homepage.
 *
 * The section is designed to immediately communicate
 * current medical equipment offers and encourage users
 * to explore products.
 */

import { ArrowRight, BadgePercent } from "lucide-react";
import HomeButton from "./HomeButton";

function OfferBanner() {
  return (
    <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-10">

      <div className="mx-auto max-w-[1440px]">

        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            border border-[var(--color-border)]
            bg-[var(--color-blue-light)]
          "
        >

          {/* Decorative background element.
              This stays subtle so the banner still feels like
              a professional healthcare marketplace. */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-64
              w-64
              rounded-full
              bg-[var(--color-blue)]/10
              blur-3xl
            "
          />

          <div
            className="
              relative
              grid
              min-h-[360px]
              items-center
              gap-8
              px-7
              py-10
              md:px-12
              lg:grid-cols-2
              lg:px-16
            "
          >

            {/* =================================================
                LEFT CONTENT
                ================================================= */}

            <div className="max-w-xl">

              {/* Offer label */}
              <div
                className="
                  mb-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  bg-white
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  text-[var(--color-blue)]
                  shadow-sm
                "
              >
                <BadgePercent size={15} />

                Limited Medical Equipment Offers
              </div>

              <h2
                className="
                  max-w-lg
                  text-4xl
                  font-bold
                  leading-[1.05]
                  tracking-[-0.04em]
                  text-[var(--color-navy)]
                  sm:text-5xl
                "
              >
                Upgrade your medical equipment.
              </h2>

              <p
                className="
                  mt-5
                  max-w-lg
                  text-base
                  leading-7
                  text-[var(--color-text-muted)]
                "
              >
                Explore selected medical equipment with
                real-time pricing, availability, sales
                performance and business insights.
              </p>

              {/* Banner actions */}
              <div className="mt-7 flex flex-wrap items-center gap-3">

                <HomeButton variant="primary">
                  Explore Offers
                  <ArrowRight size={17} className="ml-2" />
                </HomeButton>

                <HomeButton variant="secondary">
                  View All Products
                </HomeButton>

              </div>
            </div>

            {/* =================================================
                FEATURED PRODUCT VISUAL
                ================================================= */}

            <div className="relative flex min-h-[250px] items-center justify-center">

              {/* Product image placeholder.
                  Replace this source with the final medical
                  equipment product image later. */}
              <div
                className="
                  relative
                  flex
                  h-[250px]
                  w-full
                  max-w-[440px]
                  items-center
                  justify-center
                  rounded-3xl
                  bg-white
                  shadow-[0_20px_60px_rgba(16,42,86,0.12)]
                "
              >

                <span
                  className="
                    text-center
                    text-sm
                    font-medium
                    text-[var(--color-text-muted)]
                  "
                >
                  Featured Medical Equipment
                </span>

                {/* Floating offer badge */}
                <div
                  className="
                    absolute
                    right-4
                    top-4
                    rounded-xl
                    bg-[var(--color-orange)]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[var(--color-navy)]
                    shadow-lg
                  "
                >
                  Up to 25% OFF
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default OfferBanner;