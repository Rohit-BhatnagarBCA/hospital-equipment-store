/*
 * OfferCarousel
 * -------------------------------------------------------
 * Displays promotional offers in an auto-playing carousel.
 *
 * Multiple offer images can be added to the offers array.
 * The carousel automatically moves to the next offer and
 * loops back to the first offer when it reaches the end.
 *
 * Keeping the offer data inside this component makes the
 * UI independent from the actual image assets.
 */

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

import offer01 from "../../images/offers/offer-01.webp";
import offer02 from "../../images/offers/offer-02.webp";
import offer03 from "../../images/offers/offer-03.webp";
import offer04 from "../../images/offers/offer-04.webp";

/*
 * Offer configuration.
 *
 * Later, this static data can be replaced with API data
 * coming from the backend/admin panel.
 */
const offers = [
  {
    id: 1,
    image: offer01,
    eyebrow: "LIMITED TIME OFFER",
    title: "Upgrade Your Medical Equipment",
    description:
      "Explore selected healthcare equipment with exclusive offers.",
    buttonText: "Explore Offers",
  },
  {
    id: 2,
    image: offer02,
    eyebrow: "SMART HEALTHCARE",
    title: "Technology That Works For You",
    description:
      "Discover modern medical equipment built for better care.",
    buttonText: "Shop Equipment",
  },
  {
    id: 3,
    image: offer03,
    eyebrow: "SPECIAL DEALS",
    title: "Better Equipment. Better Value.",
    description:
      "Find professional medical equipment at competitive prices.",
    buttonText: "View Deals",
  },
  {
    id: 4,
    image: offer04,
    eyebrow: "MEDICAL ESSENTIALS",
    title: "Everything Your Facility Needs",
    description:
      "Browse equipment across diagnostics, monitoring and care.",
    buttonText: "Browse Collection",
  },
];

function OfferCarousel() {
  /*
   * Stores the index of the currently visible offer.
   */
  const [activeIndex, setActiveIndex] = useState(0);

  /*
   * Automatically moves the carousel every 5 seconds.
   *
   * The interval is cleaned up when the component is
   * removed to prevent unnecessary background timers.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((currentIndex) =>
        currentIndex === offers.length - 1
          ? 0
          : currentIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Move to the previous offer.
   */
  const handlePrevious = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === 0
        ? offers.length - 1
        : currentIndex - 1
    );
  };

  /*
   * Move to the next offer.
   */
  const handleNext = () => {
    setActiveIndex((currentIndex) =>
      currentIndex === offers.length - 1
        ? 0
        : currentIndex + 1
    );
  };

  const activeOffer = offers[activeIndex];

  return (
    <section className="px-4 pb-8 pt-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1440px]">

        {/* =================================================
            MAIN OFFER CONTAINER
            ================================================= */}

        <div
          className="
            group
            relative
            min-h-[340px]
            overflow-hidden
            rounded-3xl
            bg-[var(--color-navy)]
            shadow-[0_18px_50px_rgba(16,42,86,0.12)]
          "
        >

          {/* 
           * Offer image.
           *
           * The image covers the complete banner so the
           * uploaded promotional artwork controls the visual
           * appearance of each slide.
           */}
          <img
           key={activeOffer.id}
           src={activeOffer.image}
           alt={activeOffer.title}
           className="
             absolute
             inset-0
             h-full
             w-full
             object-cover
             animate-[fadeIn_500ms_ease-in-out]
                  "
                          />
          {/* 
           * Overlay improves text readability when the
           * promotional image contains bright areas.
           */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[var(--color-navy)]/90
              via-[var(--color-navy)]/55
              to-transparent
            "
          />

          {/* =================================================
              OFFER CONTENT
              ================================================= */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[340px]
              max-w-xl
              flex-col
              justify-center
              px-7
              py-10
              sm:px-10
              lg:px-14
            "
          >

            {/* Small offer label */}
            <span
              className="
                w-fit
                rounded-full
                border
                border-white/20
                bg-white/10
                px-3
                py-1.5
                text-[10px]
                font-bold
                tracking-[0.16em]
                text-white
                backdrop-blur-sm
              "
            >
              {activeOffer.eyebrow}
            </span>

            {/* Main offer title */}
            <h2
              className="
                mt-5
                max-w-lg
                text-4xl
                font-bold
                leading-[1.05]
                tracking-[-0.04em]
                text-white
                sm:text-5xl
              "
            >
              {activeOffer.title}
            </h2>

            {/* Offer description */}
            <p
              className="
                mt-4
                max-w-md
                text-sm
                leading-6
                text-white/75
                sm:text-base
              "
            >
              {activeOffer.description}
            </p>

            {/* Offer CTA */}
            <button
              type="button"
              className="
                mt-7
                flex
                w-fit
                items-center
                gap-2
                rounded-xl
                bg-white
                px-5
                py-3
                text-sm
                font-bold
                text-[var(--color-navy)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[var(--color-orange)]
              "
            >
              {activeOffer.buttonText}

              <ArrowRight size={17} />
            </button>
          </div>

          {/* =================================================
              CAROUSEL CONTROLS
              ================================================= */}

          <div
            className="
              absolute
              bottom-6
              right-6
              z-20
              flex
              items-center
              gap-2
            "
          >

            {/* Previous slide */}
            <button
              type="button"
              onClick={handlePrevious}
              aria-label="Previous offer"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-black/20
                text-white
                backdrop-blur-md
                transition-all
                hover:bg-white
                hover:text-[var(--color-navy)]
              "
            >
              <ChevronLeft size={19} />
            </button>

            {/* Next slide */}
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next offer"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-white/20
                bg-black/20
                text-white
                backdrop-blur-md
                transition-all
                hover:bg-white
                hover:text-[var(--color-navy)]
              "
            >
              <ChevronRight size={19} />
            </button>

          </div>

          {/* =================================================
              SLIDE INDICATORS
              ================================================= */}

          <div
            className="
              absolute
              bottom-7
              left-7
              z-20
              flex
              items-center
              gap-1.5
              sm:left-10
            "
          >
            {offers.map((offer, index) => (
              <button
                key={offer.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to offer ${index + 1}`}
                className={`
                  h-1.5
                  rounded-full
                  transition-all
                  duration-300
                  ${
                    activeIndex === index
                      ? "w-8 bg-white"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }
                `}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

export default OfferCarousel;