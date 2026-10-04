import {
  Search,
  ShoppingBag,
  UserRound,
  ChevronDown,
} from "lucide-react";

/*
  =========================================================
  NAVBAR COMPONENT
  ---------------------------------------------------------
  Medical Sales Intelligence
  Product-first marketplace navigation.

  Structure:
  1. Brand / Logo
  2. Navigation Links
  3. Search Bar
  4. User Actions

  NOTE:
  Is component ko intentionally independent rakha gaya hai
  taaki future mein App.jsx ke andar iska code mix na ho.
  =========================================================
*/

const navigationLinks = [
  {
    label: "Products",
    hasDropdown: true,
  },
  {
    label: "Categories",
    hasDropdown: true,
  },
  {
    label: "Sales Analytics",
  },
  {
    label: "AI Assistant",
  },
];

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-white)]/95 backdrop-blur-md">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-8 px-6 lg:px-10">

        {/* =================================================
            BRAND
            ================================================= */}

        <a
          href="/"
          className="group flex shrink-0 items-center gap-3"
          aria-label="Medical Sales Intelligence Home"
        >
          {/* Medical cross / brand mark */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-blue-light)] text-[var(--color-blue)] transition-transform duration-300 group-hover:scale-105">
            <div className="text-2xl font-bold leading-none">
              +
            </div>
          </div>

          {/* Brand name */}
          <div className="hidden sm:block">
            <h1 className="text-[15px] font-bold tracking-[-0.02em] text-[var(--color-navy)]">
              Medical Sales
              <span className="text-[var(--color-blue)]">
                {" "}Intelligence
              </span>
            </h1>

            <p className="mt-0.5 text-[10px] font-medium tracking-wide text-[var(--color-text-muted)]">
              SMARTER HEALTHCARE COMMERCE
            </p>
          </div>
        </a>

        {/* =================================================
            DESKTOP NAVIGATION
            ================================================= */}

        <nav className="hidden items-center gap-1 xl:flex">
          {navigationLinks.map((item) => (
            <a
              key={item.label}
              href="#"
              className="
                group flex items-center gap-1.5
                rounded-lg px-3 py-2
                text-sm font-medium
                text-[var(--color-text-muted)]
                transition-all duration-200
                hover:bg-[var(--color-blue-light)]
                hover:text-[var(--color-navy)]
              "
            >
              {item.label}

              {item.hasDropdown && (
                <ChevronDown
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform duration-200 group-hover:translate-y-0.5"
                />
              )}
            </a>
          ))}
        </nav>

        {/* =================================================
            SEARCH BAR
            -------------------------------------------------
            Main product-search interaction.
            Later isko actual product search API se connect
            karenge.
            ================================================= */}

        <div className="mx-auto hidden w-full max-w-[390px] md:block">
          <label className="relative block">
            <Search
              size={18}
              strokeWidth={1.8}
              className="
                pointer-events-none
                absolute left-4 top-1/2
                -translate-y-1/2
                text-[var(--color-text-muted)]
              "
            />

            <input
              type="search"
              placeholder="Search medical products..."
              className="
                h-11 w-full
                rounded-xl
                border border-[var(--color-border)]
                bg-[var(--color-background)]
                pl-11 pr-4
                text-sm text-[var(--color-text)]
                outline-none
                transition-all duration-200

                placeholder:text-[var(--color-text-muted)]

                focus:border-[var(--color-blue)]
                focus:bg-[var(--color-white)]
                focus:ring-4
                focus:ring-[var(--color-blue)]/10
              "
            />
          </label>
        </div>

        {/* =================================================
            RIGHT SIDE ACTIONS
            ================================================= */}

        <div className="ml-auto flex shrink-0 items-center gap-2">

          {/* Cart / Orders */}
          <button
            type="button"
            aria-label="Shopping bag"
            className="
              relative flex h-10 w-10
              items-center justify-center
              rounded-lg
              text-[var(--color-navy)]
              transition-colors duration-200
              hover:bg-[var(--color-blue-light)]
            "
          >
            <ShoppingBag size={19} strokeWidth={1.8} />

            {/* Small notification indicator */}
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--color-orange)]" />
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-7 w-px bg-[var(--color-border)] sm:block" />

          {/* User */}
          <button
            type="button"
            className="
              flex items-center gap-2
              rounded-xl px-2 py-1.5
              transition-colors duration-200
              hover:bg-[var(--color-background)]
            "
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-navy)] text-xs font-bold text-white">
              RB
            </div>

            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-[var(--color-navy)]">
                Rohit Bhatnagar
              </p>
              <p className="text-[10px] text-[var(--color-text-muted)]">
                Sales Analyst
              </p>
            </div>

            <ChevronDown
              size={14}
              className="hidden text-[var(--color-text-muted)] lg:block"
            />
          </button>

          {/* Mobile menu placeholder — functionality later */}
          <button
            type="button"
            aria-label="Account"
            className="
              flex h-10 w-10
              items-center justify-center
              rounded-lg
              text-[var(--color-navy)]
              hover:bg-[var(--color-blue-light)]
              md:hidden
            "
          >
            <UserRound size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;