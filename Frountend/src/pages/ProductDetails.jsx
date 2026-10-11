
/*
 * Product Details Page
 * -------------------------------------------------------
 * Purpose:
 * - Fetch one product using its URL slug.
 * - Display product images and product information.
 * - Display specifications and technical details.
 * - Recommend related products.
 * - Handle loading, API errors and invalid product URLs.
 *
 * API requests are kept inside productApi.js to make the
 * page easier to maintain if the backend changes later.
 */

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/shared/Navbar";
import AiAgent from "../components/shared/AiAgent";
import Footer from "../components/shared/Footer";

import ProductGallery from "../components/Products/ProductGallery";
import ProductInfo from "../components/Products/ProductInfo";
import ProductSpecs from "../components/Products/ProductSpecs";
import RelatedProducts from "../components/Products/RelatedProducts";

import {
  fetchProductBySlug,
  fetchProducts,
} from "../services/productApi";

function ProductDetails() {
  // Read the product slug from a route such as /products/patient-monitor-pro.
  const { productId } = useParams();

  // Keep product data and request status in separate state variables.
  const [product, setProduct] = useState(null);
  const [relatedCatalogue, setRelatedCatalogue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  /*
   * Fetch the selected product and catalogue for recommendations.
   *
   * The cleanup flag prevents outdated requests from changing
   * state after the component unmounts or the slug changes.
   */
  useEffect(() => {
    let isCurrent = true;

    async function loadProduct() {
      setIsLoading(true);
      setApiError("");
      setProduct(null);

      try {
        const [productRecord, catalogue] = await Promise.all([
          fetchProductBySlug(productId),
          fetchProducts({ page: 1, limit: 50 }),
        ]);

        if (!isCurrent) return;

        setProduct(productRecord);
        setRelatedCatalogue(catalogue);
      } catch (error) {
        if (isCurrent) {
          setApiError(
            error.message || "Unable to load product details."
          );
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isCurrent = false;
    };
  }, [productId]);

  /*
   * Retry the product request if the first request fails.
   * Keeping this action separate makes the retry button simple.
   */
  const handleRetry = async () => {
    setIsLoading(true);
    setApiError("");

    try {
      const [productRecord, catalogue] = await Promise.all([
        fetchProductBySlug(productId),
        fetchProducts({ page: 1, limit: 50 }),
      ]);

      setProduct(productRecord);
      setRelatedCatalogue(catalogue);
    } catch (error) {
      setApiError(
        error.message || "Unable to load product details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * Show a loading state while the API request is in progress.
   * This avoids incorrectly showing "Product not found" too early.
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main
          className="flex min-h-[60vh] items-center justify-center px-4 py-20"
          role="status"
        >
          <p className="text-sm font-medium text-slate-500">
            Loading product details...
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  // Display a recoverable error when the API request fails.
  if (apiError) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#102a4c]">
            Unable to load product
          </h1>

          <p
            role="alert"
            className="mt-3 max-w-lg text-sm leading-6 text-slate-500"
          >
            {apiError}
          </p>

          <button
            type="button"
            onClick={handleRetry}
            className="mt-6 rounded-xl bg-[#1769d1] px-5 py-3 text-sm font-bold text-white hover:bg-[#0d4fa8]"
          >
            Try again
          </button>
        </main>

        <Footer />
      </div>
    );
  }

  // A successful request with no matching record means the product does not exist.
  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />

        <main className="flex min-h-[60vh] items-center justify-center px-4 py-20">
          <div className="max-w-lg text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#1769d1]">
              Product not found
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#102a4c]">
              We couldn't find this product
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              The product may have been removed or the URL
              may be incorrect.
            </p>

            <Link
              to="/products"
              className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#1769d1] px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-[#0d4fa8]"
            >
              Back to Products
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  /*
   * Related-product strategy:
   * 1. Prefer products in the same category.
   * 2. Use other products if there are not enough matches.
   * 3. Exclude the product currently being viewed.
   *
   * This is a simple frontend strategy that can later be replaced
   * by a dedicated backend recommendation endpoint.
   */
  const sameCategoryProducts = relatedCatalogue.filter(
    (item) =>
      item.id !== product.id &&
      item.category === product.category
  );

  const otherProducts = relatedCatalogue.filter(
    (item) =>
      item.id !== product.id &&
      item.category !== product.category
  );

  const relatedProducts = [
    ...sameCategoryProducts,
    ...otherProducts,
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Shared site navigation */}
      <Navbar />

      <main>
        {/* Breadcrumb helps users navigate back through the catalogue. */}
        <div className="border-b border-slate-100 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-2 text-sm">
            <Link
              to="/"
              className="text-slate-400 transition-colors hover:text-[#1769d1]"
            >
              Home
            </Link>

            <span className="text-slate-300">/</span>

            <Link
              to="/products"
              className="text-slate-400 transition-colors hover:text-[#1769d1]"
            >
              Products
            </Link>

            <span className="text-slate-300">/</span>

            <span className="max-w-[280px] truncate font-medium text-[#102a4c]">
              {product.name}
            </span>
          </div>
        </div>

        {/* Main product area: gallery and information side by side on large screens. */}
        <section className="px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-14">
            <ProductGallery
              images={product.images}
              productName={product.name}
            />

            <ProductInfo
              category={product.category}
              name={product.name}
              rating={product.rating}
              reviews={product.reviews}
              description={product.description}
              price={product.price}
              originalPrice={product.originalPrice}
              discount={product.discount}
              stock={product.stock}
              configurations={product.configurations}
            />
          </div>
        </section>

        {/* Product description */}
        <section className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <div className="max-w-4xl">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-[#1769d1]">
                Product Overview
              </p>

              <h2 className="text-2xl font-bold tracking-tight text-[#102a4c] sm:text-3xl">
                About this product
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
                {product.description || "Product description is not available yet."}
              </p>
            </div>
          </div>
        </section>

        {/* Reusable component for specifications and technical details. */}
        <ProductSpecs
          specifications={product.specifications}
          technicalDetails={product.technicalDetails}
        />

        {/* Related items are sourced from the same backend catalogue. */}
        <RelatedProducts products={relatedProducts} />
      </main>

      {/* Shared floating AI assistant */}
      <AiAgent />

      {/* Shared site footer */}
      <Footer />
    </div>
  );
}

export default ProductDetails;
