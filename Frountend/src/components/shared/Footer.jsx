/*
 * Footer
 * -------------------------------------------------------
 * Global website footer for the Medical Sales Intelligence
 * application.
 *
 * The footer is divided into independent information groups
 * so links can be connected to real pages later.
 */

import {
  ArrowUp,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

function Footer() {

  /*
   * Smoothly scroll the user back to the top of the page.
   * This keeps the interaction simple and avoids page reloads.
   */
  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="mt-16">

      {/* =================================================
          BACK TO TOP
          ================================================= */}

      <button
        type="button"
        onClick={handleBackToTop}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          bg-[#eef5ff]
          py-4
          text-sm
          font-semibold
          text-[#123b78]
          transition-colors
          hover:bg-[#e3efff]
        "
      >
        <ArrowUp size={16} />

        Back to top
      </button>


      {/* =================================================
          MAIN FOOTER
          ================================================= */}

      <div className="border-t border-blue-100 bg-[#0d2342] text-white">

        <div
          className="
            mx-auto
            grid
            max-w-[1440px]
            grid-cols-1
            gap-10
            px-6
            py-14
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >

          {/* ---------------------------------------------
              COMPANY
              --------------------------------------------- */}

          <div>
            <h3 className="text-sm font-bold">
              Medical Sales Intelligence
            </h3>

            <p className="mt-4 max-w-xs text-sm leading-6 text-blue-100/70">
              Intelligent healthcare sales insights,
              medical products and AI-powered assistance
              for modern healthcare businesses.
            </p>
          </div>


          {/* ---------------------------------------------
              EXPLORE
              --------------------------------------------- */}

          <div>
            <h3 className="text-sm font-bold">
              Explore
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-blue-100/70">

              <li>
                <a href="#" className="transition hover:text-white">
                  Medical Products
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Categories
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Sales Analytics
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Reports
                </a>
              </li>

            </ul>
          </div>


          {/* ---------------------------------------------
              PLATFORM
              --------------------------------------------- */}

          <div>
            <h3 className="text-sm font-bold">
              Platform
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-blue-100/70">

              <li>
                <a href="#" className="transition hover:text-white">
                  AI Assistant
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Documentation
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  API Access
                </a>
              </li>

              <li>
                <a href="#" className="transition hover:text-white">
                  Support
                </a>
              </li>

            </ul>
          </div>


          {/* ---------------------------------------------
              CONTACT
              --------------------------------------------- */}

          <div>
            <h3 className="text-sm font-bold">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-blue-100/70">

              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-0.5 shrink-0" />

                <span>
                  support@medicalintelligence.com
                </span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={17} className="mt-0.5 shrink-0" />

                <span>
                  +91 00000 00000
                </span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-0.5 shrink-0" />

                <span>
                  India
                </span>
              </div>

            </div>
          </div>

        </div>


        {/* =================================================
            FOOTER BOTTOM BAR
            ================================================= */}

        <div className="border-t border-white/10">

          <div
            className="
              mx-auto
              flex
              max-w-[1440px]
              flex-col
              items-center
              justify-between
              gap-4
              px-6
              py-6
              text-xs
              text-blue-100/50
              sm:flex-row
            "
          >

            <p>
              © 2026 Medical Sales Intelligence. All rights reserved.
            </p>

            <div className="flex gap-5">
              <a href="#" className="hover:text-white">
                Privacy
              </a>

              <a href="#" className="hover:text-white">
                Terms
              </a>

              <a href="#" className="hover:text-white">
                Security
              </a>
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;