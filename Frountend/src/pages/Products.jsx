
/*
 * Products Page
 * -------------------------------------------------------
 * Main catalogue page for browsing medical equipment.
 *
 * Responsibilities:
 * - Load products from the backend API.
 * - Search products by name, category or description.
 * - Filter products by category.
 * - Keep category selection synchronized with the URL.
 * - Sort products by price or rating.
 * - Display loading, error and empty states.
 *
 * API communication is handled by productApi.js so this
 * component can focus on UI and user interactions.
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";
import ProductCard from "../components/Products/ProductCard";

import { fetchProducts } from "../services/productApi";

function Products() {
  /*
   * URL state:
   * A category in the URL allows users to share filtered catalogue links.
   */
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("category");

  // Store the current search input.
  const [searchQuery, setSearchQuery] = useState("");

  // Store product data and request status separately.
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  // Initialize the selected category from the URL, if provided.
  const [selectedCategory, setSelectedCategory] = useState(
    categoryFromUrl || "all"
  );

  // The default option preserves the original featured order.
  const [sortOption, setSortOption] = useState("featured");

  /*
   * Load the catalogue from the backend when the page mounts.
   *
   * The cleanup flag prevents an outdated request from updating
   * state after the component has unmounted.
   */
  useEffect(() => {
    let isCurrent = true;

    async function loadProducts() {
      setIsLoading(true);
      setApiError("");

      try {
        const records = await fetchProducts({
          page: 1,
          limit: 50,
        });

        if (isCurrent) {
          setProducts(records);
        }
      } catch (error) {
        if (isCurrent) {
          setApiError(
            error.message || "Unable to load products."
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isCurrent = false;
    };
  }, []);

  /*
   * Keep the category dropdown synchronized with browser navigation.
   * This also handles users opening a shared category URL directly.
   */
  useEffect(() => {
    setSelectedCategory(categoryFromUrl || "all");
  }, [categoryFromUrl]);

  /*
   * Build the category list from API data.
   * This avoids maintaining a separate hard-coded category list.
   */
  const categories = useMemo(() => {
    return [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];
  }, [products]);

  /*
   * Apply search, category filtering and sorting to the loaded data.
   *
   * This filtering runs in the browser over the records already
   * fetched. For very large catalogues, server-side filtering and
   * pagination can be added without changing ProductCard.
   */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search product name, category and description.
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

    // Filter by the selected category.
    if (selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Sort a copied array so the original state is not mutated.
    if (sortOption === "price-low") {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    }

    if (sortOption === "price-high") {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    }

    if (sortOption === "rating") {
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortOption]);

  /*
   * Update both React state and the URL when the category changes.
   * URLSearchParams handles spaces and other URL characters.
   */
  const handleCategoryChange = (event) => {
    const value = event.target.value;

    setSelectedCategory(value);

    if (value === "all") {
      const nextParams = new URLSearchParams(searchParams);
      nextParams.delete("category");
      setSearchParams(nextParams);
      return;
    }

    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("category", value);
    setSearchParams(nextParams);
  };

  // Allow the user to retry if the backend request fails.
  const handleRetry = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const records = await fetchProducts({
        page: 1,
        limit: 50,
      });

      setProducts(records);
    } catch (error) {
      setApiError(
        error.message || "Unable to load products."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Shared site navigation */}
      <Navbar />

      <main>
        {/* Page heading */}
        <section className="bg-[#f8fbff] px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1769d1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1769d1]" />
              Medical Equipment Catalogue
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#102a4c] sm:text-4xl">
              Explore Medical Equipment
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Browse medical equipment across major healthcare
              categories and find products suited for hospitals,
              clinics and healthcare professionals.
            </p>
          </div>
        </section>

        {/* Catalogue section */}
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            {/* Search, category filter and sort controls */}
            <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
              {/* Product search */}
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search medical equipment..."
                  aria-label="Search medical equipment"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Category dropdown */}
              <div className="relative min-w-[220px]">
                <SlidersHorizontal
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  aria-label="Filter by category"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="all">All Categories</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Sorting dropdown */}
              <div className="relative min-w-[200px]">
                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value)
                  }
                  aria-label="Sort products"
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-slate-700 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">
                    Price: Low to High
                  </option>
                  <option value="price-high">
                    Price: High to Low
                  </option>
                  <option value="rating">Highest Rated</option>
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>
            </div>

            {/* Catalogue result count */}
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#102a4c]">
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

            {/* Loading, error, product grid or empty state */}
            {isLoading ? (
              <div
                role="status"
                className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-6 text-center text-sm text-slate-500"
              >
                Loading medical equipment...
              </div>
            ) : apiError ? (
              <div
                role="alert"
                className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-center"
              >
                <h3 className="text-lg font-bold text-red-800">
                  Unable to load products
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-6 text-red-700">
                  {apiError}
                </p>

                <button
                  type="button"
                  onClick={handleRetry}
                  className="mt-5 rounded-xl bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800"
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
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
              /* Show this state only after loading succeeds with no matches. */
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
                  <Search size={24} />
                </div>

                <h3 className="text-lg font-bold text-[#102a4c]">
                  No products found
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try changing your search term or selecting
                  another medical equipment category.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Shared floating AI assistant */}
      <AiAgent />

      {/* Shared site footer */}
      <Footer />
    </div>
  );
}

export default Products;
