/*
 * Products Page
 * -------------------------------------------------------
 * Main catalogue page for browsing all medical equipment.
 *
 * Responsibilities:
 * - Display all available products
 * - Provide product search
 * - Filter products by category
 * - Sort products
 * - Reuse ProductCard for consistent product UI
 *
 * IMPORTANT:
 * Product data is currently imported from the local catalogue.
 * Later, this same page can receive product data from the backend
 * API without changing the overall page structure.
 */

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";
import ProductCard from "../components/Products/ProductCard";

import { products } from "../data/products";


function Products() {

  /*
   * Search state
   * -------------------------------------------------------
   * Stores the text entered by the user.
   *
   * Why:
   * We need this value to compare against product names,
   * categories and descriptions.
   */
  const [searchQuery, setSearchQuery] = useState("");


  /*
   * Category filter state
   * -------------------------------------------------------
   * "all" means no category filter is currently applied.
   */
  const [selectedCategory, setSelectedCategory] = useState("all");


  /*
   * Sorting state
   * -------------------------------------------------------
   * Controls how products are ordered inside the catalogue.
   */
  const [sortOption, setSortOption] = useState("featured");


  /*
   * Create category list dynamically
   * -------------------------------------------------------
   * Categories are extracted from the product data instead
   * of being manually written.
   *
   * Why:
   * When products are added later from the backend,
   * the category filter can be generated from the data.
   */
  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return uniqueCategories;

  }, []);


  /*
   * Filter and sort products
   * -------------------------------------------------------
   * useMemo prevents unnecessary recalculation when unrelated
   * component state changes.
   *
   * The same logic can later be moved to the backend when
   * the product catalogue becomes large.
   */
  const filteredProducts = useMemo(() => {

    let result = [...products];


    /*
     * Search products
     *
     * Search checks:
     * - Product name
     * - Category
     * - Description
     */
    if (searchQuery.trim()) {

      const query = searchQuery.toLowerCase().trim();

      result = result.filter((product) => {

        return (
          product.name?.toLowerCase().includes(query) ||
          product.category?.toLowerCase().includes(query) ||
          product.description?.toLowerCase().includes(query)
        );

      });

    }


    /*
     * Category filtering
     */
    if (selectedCategory !== "all") {

      result = result.filter(
        (product) =>
          product.category === selectedCategory
      );

    }


    /*
     * Product sorting
     */
    if (sortOption === "price-low") {

      result.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );

    }

    if (sortOption === "price-high") {

      result.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );

    }

    if (sortOption === "rating") {

      result.sort(
        (a, b) => Number(b.rating) - Number(a.rating)
      );

    }


    return result;

  }, [
    searchQuery,
    selectedCategory,
    sortOption,
  ]);


  return (

    <div className="min-h-screen bg-white">

      {/* Global navigation shared across the application */}
      <Navbar />


      <main>

        {/* =================================================
            PAGE HEADER
            ================================================= */}

        <section className="bg-[#f8fbff] px-4 py-12 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-[1440px]">

            {/* Small page label */}

            <div
              className="
                mb-3
                flex
                items-center
                gap-2
                text-xs
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#1769d1]
              "
            >

              <span className="h-1.5 w-1.5 rounded-full bg-[#1769d1]" />

              Medical Equipment Catalogue

            </div>


            {/* Main heading */}

            <h1
              className="
                text-3xl
                font-bold
                tracking-tight
                text-[#102a4c]
                sm:text-4xl
              "
            >
              Explore Medical Equipment
            </h1>


            {/* Supporting description */}

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-6
                text-slate-500
                sm:text-base
              "
            >
              Browse medical equipment across major healthcare
              categories and find products suited for hospitals,
              clinics and healthcare professionals.
            </p>

          </div>

        </section>


        {/* =================================================
            PRODUCT CATALOGUE
            ================================================= */}

        <section className="px-4 py-10 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-[1440px]">


            {/* =================================================
                SEARCH + FILTER BAR
                ================================================= */}

            <div
              className="
                mb-8
                flex
                flex-col
                gap-4
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                lg:flex-row
                lg:items-center
              "
            >


              {/* Search */}

              <div className="relative flex-1">

                <Search
                  size={19}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search medical equipment..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-11
                    pr-4
                    text-sm
                    text-slate-700
                    outline-none
                    transition
                    focus:border-blue-300
                    focus:bg-white
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />

              </div>


              {/* Category filter */}

              <div className="relative min-w-[220px]">

                <SlidersHorizontal
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

                <select
                  value={selectedCategory}
                  onChange={(event) =>
                    setSelectedCategory(event.target.value)
                  }
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    py-3
                    pl-11
                    pr-10
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    focus:border-blue-300
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >

                  <option value="all">
                    All Categories
                  </option>

                  {categories.map((category) => (

                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>

                  ))}

                </select>


                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

              </div>


              {/* Sort */}

              <div className="relative min-w-[200px]">

                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value)
                  }
                  className="
                    w-full
                    appearance-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    pr-10
                    text-sm
                    font-medium
                    text-slate-700
                    outline-none
                    focus:border-blue-300
                    focus:ring-2
                    focus:ring-blue-100
                  "
                >

                  <option value="featured">
                    Featured
                  </option>

                  <option value="price-low">
                    Price: Low to High
                  </option>

                  <option value="price-high">
                    Price: High to Low
                  </option>

                  <option value="rating">
                    Highest Rated
                  </option>

                </select>


                <ChevronDown
                  size={17}
                  className="
                    pointer-events-none
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-slate-400
                  "
                />

              </div>

            </div>


            {/* =================================================
                RESULT SUMMARY
                ================================================= */}

            <div
              className="
                mb-6
                flex
                flex-col
                gap-2
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <h2
                  className="
                    text-lg
                    font-bold
                    text-[#102a4c]
                  "
                >
                  Medical Equipment
                </h2>

                <p className="mt-1 text-sm text-slate-500">

                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {filteredProducts.length}
                  </span>{" "}
                  products

                </p>

              </div>

            </div>


            {/* =================================================
                PRODUCT GRID
                ================================================= */}

            {filteredProducts.length > 0 ? (

              <div
                className="
                  grid
                  grid-cols-1
                  gap-5
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4
                "
              >

                {filteredProducts.map((product) => (

                  <ProductCard
                    key={product.id}

                    /*
                     * ProductCard receives the complete product
                     * information so the same reusable component
                     * can be used throughout the application.
                     */

                    id={product.id}
                    image={product.images?.[0]}
                    category={product.category}
                    name={product.name}
                    description={product.description}
                    rating={product.rating}
                    reviews={product.reviews}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    discount={product.discount}
                    stock={product.stock}
                    badge={product.badge}
                  />

                ))}

              </div>

            ) : (

              /*
               * Empty state shown when search/filter produces
               * no matching products.
               *
               * Why:
               * A clear empty state gives the user feedback
               * instead of showing a completely blank page.
               */

              <div
                className="
                  flex
                  min-h-[300px]
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-slate-300
                  bg-slate-50
                  px-6
                  text-center
                "
              >

                <div
                  className="
                    mb-4
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-white
                    text-slate-400
                    shadow-sm
                  "
                >

                  <Search size={24} />

                </div>


                <h3
                  className="
                    text-lg
                    font-bold
                    text-[#102a4c]
                  "
                >
                  No products found
                </h3>


                <p
                  className="
                    mt-2
                    max-w-md
                    text-sm
                    leading-6
                    text-slate-500
                  "
                >
                  Try changing your search term or selecting
                  another medical equipment category.
                </p>

              </div>

            )}

          </div>

        </section>

      </main>


      {/* Floating AI assistant shared across the website */}
      <AiAgent />


      {/* Global website footer */}
      <Footer />

    </div>

  );
}

export default Products;