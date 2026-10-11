
/**
 * Product API Service
 *
 * Keeps all product-related HTTP requests in one place.
 * This makes API integration easier to maintain and reuse.
 */

const API_BASE_URL = "http://localhost:5000/api/v1";

/**
 * Fetch products from the backend.
 * Supports search, pagination and category filtering.
 */
export async function fetchProducts({ search = "", page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  const response = await fetch(
    `${API_BASE_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load products. Please try again.");
  }

  const result = await response.json();

  // Convert the backend slug into the ID format used by the frontend.
  return (result.data || []).map((product) => ({
    ...product,
    id: product.slug,
    images: product.images?.length
      ? product.images
      : [],
    configurations: product.configurations || [],
    specifications: product.specifications || {},
    technicalDetails: product.technicalDetails || {},
  }));
}

/**
 * Fetch one product using its URL slug.
 */
export async function fetchProductBySlug(slug) {
  const response = await fetch(
    `${API_BASE_URL}/products/${encodeURIComponent(slug)}`
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Unable to load product details.");
  }

  const result = await response.json();
  const product = result.data;

  return {
    ...product,
    id: product.slug,
    images: product.images?.length ? product.images : [],
    configurations: product.configurations || [],
    specifications: product.specifications || {},
    technicalDetails: product.technicalDetails || {},
  };
}
