
/**
 * Admin API Service
 *
 * Handles admin catalogue requests and dashboard product statistics.
 * Admin mutations use JWT authentication and multipart form data.
 */

import { API_BASE_URL } from "../config/api";

const ADMIN_PRODUCTS_URL = `${API_BASE_URL}/admin/products`;
const PUBLIC_PRODUCTS_URL = `${API_BASE_URL}/products`;
const LOW_STOCK_THRESHOLD = 10;
const REQUEST_TIMEOUT_MS = 15000;

function getAuthToken() {
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    ""
  );
}

async function apiRequest(url, options = {}, requiresAuth = false) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const token = requiresAuth ? getAuthToken() : "";
    
    if (requiresAuth && !token) {
      throw new Error(
        "Admin login required. Please log in and save your JWT token as authToken."
      );
    }

    const headers = {
      Accept: "application/json",
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    // Let the browser set Content-Type for FormData, including its boundary.
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Your session has expired. Please log in again.");
      }

      if (response.status === 403) {
        throw new Error("This account does not have admin permission.");
      }

      throw new Error(
        payload?.message ||
        payload?.error ||
        `Request failed with status ${response.status}`
      );
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
    }

    if (error instanceof TypeError) {
      throw new Error("Cannot connect to backend. Check the server.");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extract product records from common API response formats.
 */
function extractProductRecords(payload) {
  const candidates = [
    payload?.data?.items,
    payload?.data?.products,
    payload?.data,
    payload?.items,
    payload?.products,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

/**
 * Load all admin products, including inactive products.
 */
export async function fetchAdminProducts({ search = "", page = 1, limit = 50 } = {}) {
  const query = new URLSearchParams({
    search,
    page: String(page),
    limit: String(limit),
  });

  const payload = await apiRequest(
    `${ADMIN_PRODUCTS_URL}?${query.toString()}`,
    { method: "GET" },
    true
  );

  return {
    products: extractProductRecords(payload),
    pagination: payload?.pagination || {},
  };
}

/**
 * Create a product using multipart form data.
 */
export async function createAdminProduct(formData) {
  return apiRequest(
    ADMIN_PRODUCTS_URL,
    {
      method: "POST",
      body: formData,
    },
    true
  );
}

/**
 * Update an existing product using multipart form data.
 */
export async function updateAdminProduct(productId, formData) {
  return apiRequest(
    `${ADMIN_PRODUCTS_URL}/${encodeURIComponent(productId)}`,
    {
      method: "PUT",
      body: formData,
    },
    true
  );
}

/**
 * Delete a product by its MongoDB ID.
 */
export async function deleteAdminProduct(productId) {
  return apiRequest(
    `${ADMIN_PRODUCTS_URL}/${encodeURIComponent(productId)}`,
    { method: "DELETE" },
    true
  );
}

/**
 * Fetch one public product page for the existing dashboard overview.
 */
async function fetchProductPage(page) {
  const query = new URLSearchParams({
    page: String(page),
    limit: "50",
  });

  const payload = await apiRequest(
    `${PUBLIC_PRODUCTS_URL}?${query.toString()}`
  );

  return {
    items: extractProductRecords(payload),
    pagination:
      payload?.pagination ||
      payload?.data?.pagination ||
      {},
  };
}

/**
 * Preserve the existing dashboard's product overview functionality.
 */
export async function fetchAdminOverview() {
  const firstPage = await fetchProductPage(1);
  const products = [...firstPage.items];

  const totalPages = Number(
    firstPage.pagination.totalPages ||
    firstPage.pagination.pages ||
    1
  );

  for (let page = 2; page <= Math.min(totalPages, 20); page += 1) {
    const result = await fetchProductPage(page);
    products.push(...result.items);
  }

  const inventoryStats = calculateInventoryStats(products);

  return {
    totalProducts: Number(firstPage.pagination.total) || products.length,
    ...inventoryStats,
    products,
    source: "public-catalogue",
  };
}

/**
 * Calculate inventory metrics from product records.
 */
export function calculateInventoryStats(products = []) {
  let inventoryUnits = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const product of products) {
    const quantity = Math.max(
      0,
      Number(product.stockQuantity ?? product.stock ?? 0) || 0
    );

    inventoryUnits += quantity;

    if (quantity === 0) {
      outOfStockCount += 1;
    } else if (quantity <= LOW_STOCK_THRESHOLD) {
      lowStockCount += 1;
    }
  }

  const categories = new Set(
    products
      .map((product) =>
        typeof product.category === "string"
          ? product.category.trim()
          : product.category?.name || ""
      )
      .filter(Boolean)
  );

  return {
    inventoryUnits,
    lowStockCount,
    outOfStockCount,
    categoryCount: categories.size,
    lowStockThreshold: LOW_STOCK_THRESHOLD,
  };
}