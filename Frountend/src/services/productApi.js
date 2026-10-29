
/**
 * Product API Service
 *
 * Purpose:
 * - Centralize all public product API requests.
 * - Read the API URL from the frontend environment.
 * - Handle HTTP errors and request timeouts consistently.
 * - Normalize backend product data for existing React components.
 *
 * Security:
 * - Never store JWT secrets or database credentials in frontend code.
 * - Encode dynamic URL parameters before making requests.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const REQUEST_TIMEOUT_MS = 10000;

/**
 * Send an HTTP request with a timeout and consistent error handling.
 */
async function apiRequest(path, options = {}) {
  const controller = new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });

    // Parse the server response safely.
    let result;

    try {
      result = await response.json();
    } catch {
      throw new Error("The server returned an invalid response.");
    }

    if (!response.ok) {
      if (response.status >= 500) {
        throw new Error(
          "The server is temporarily unavailable. Please try again."
        );
      }

      // Preserve specific 404 information for product lookups.
      if (response.status === 404) {
        throw new Error(result.message || "Product not found");
      }

      throw new Error(
        result.message ||
          result.error ||
          "The request could not be completed."
      );
    }

    return result;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The request timed out. Please check your connection and retry."
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Unable to connect to the server. Check whether the backend is running."
      );
    }

    throw error;
  } finally {
    // Clear the timer whether the request succeeds or fails.
    clearTimeout(timeoutId);
  }
}

/**
 * Normalize product fields while preserving backend data.
 * Supports MongoDB IDs, URL slugs, and optional product fields.
 */
function normalizeProduct(product) {
  if (!product || typeof product !== "object" || Array.isArray(product)) {
    throw new Error("The server returned invalid product data.");
  }

  const productId = product.id || product._id || product.slug;

  return {
    ...product,

    // Preserve the backend slug and provide a stable frontend ID.
    id: productId,
    slug: product.slug || String(productId || ""),

    images: Array.isArray(product.images) ? product.images : [],

    configurations: Array.isArray(product.configurations)
      ? product.configurations
      : [],

    specifications:
      product.specifications &&
      typeof product.specifications === "object" &&
      !Array.isArray(product.specifications)
        ? product.specifications
        : {},

    technicalDetails:
      product.technicalDetails &&
      typeof product.technicalDetails === "object" &&
      !Array.isArray(product.technicalDetails)
        ? product.technicalDetails
        : {},

    // Support both stock field names used by the backend/frontend.
    stock: Number(product.stock ?? product.stockQuantity ?? 0),

    price: Number(product.price ?? 0),
  };
}

/**
 * Extract product arrays from supported API response formats.
 */
function extractProducts(payload) {
  const data = payload?.data;

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  return [];
}

/**
 * Fetch a page of products from the backend catalogue.
 */
export async function fetchProducts({
  search = "",
  page = 1,
  limit = 50,
} = {}) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(
    Math.max(Number(limit) || 12, 1),
    50
  );

  const query = new URLSearchParams({
    page: String(safePage),
    limit: String(safeLimit),
  });

  if (typeof search === "string" && search.trim()) {
    query.set("search", search.trim());
  }

  // Use the existing apiRequest helper consistently.
  const payload = await apiRequest(
    `/products?${query.toString()}`
  );

  const records = extractProducts(payload);

  return records.map(normalizeProduct);
}

/**
 * Fetch a single product using its URL slug.
 * Returns null when the backend confirms that it does not exist.
 */
export async function fetchProductBySlug(slug) {
  if (
    typeof slug !== "string" ||
    !/^[a-zA-Z0-9_-]{1,160}$/.test(slug)
  ) {
    return null;
  }

  try {
    const result = await apiRequest(
      `/products/${encodeURIComponent(slug)}`
    );

    // Support common single-product response formats.
    const product =
      result?.data?.product ||
      result?.data?.item ||
      result?.data;

    if (!product || typeof product !== "object" || Array.isArray(product)) {
      throw new Error("The server returned invalid product data.");
    }

    return normalizeProduct(product);
  } catch (error) {
    if (error.message === "Product not found") {
      return null;
    }

    throw error;
  }
}
