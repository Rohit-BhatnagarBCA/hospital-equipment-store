
/**
 * Admin API Service
 *
 * Purpose:
 * - Fetch products from the existing backend catalogue.
 * - Support common paginated and non-paginated response formats.
 * - Calculate inventory statistics from real product quantities.
 *
 * Note:
 * - This service reads the public catalogue.
 * - Protected admin APIs will be needed for stock updates and mutations.
 */

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

const PAGE_SIZE = 50;
const LOW_STOCK_THRESHOLD = 10;
const REQUEST_TIMEOUT_MS = 10000;

/**
 * Extract product records from supported backend response formats.
 */
function extractProductRecords(payload) {
  const candidates = [
    payload?.data?.items,
    payload?.data?.products,
    payload?.data?.results,
    payload?.data?.docs,
    payload?.data,
    payload?.items,
    payload?.products,
    payload?.results,
    payload?.docs,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
  }

  // Some APIs return a single product object rather than a list.
  if (
    payload?.data &&
    typeof payload.data === "object" &&
    (payload.data._id || payload.data.id || payload.data.slug)
  ) {
    return [payload.data];
  }

  return null;
}

/**
 * Read pagination metadata when available.
 */
function extractPagination(payload) {
  return (
    payload?.data?.pagination ||
    payload?.pagination ||
    payload?.meta?.pagination ||
    payload?.meta ||
    {}
  );
}

/**
 * Fetch one page from the existing product API.
 */
async function fetchProductPage(page) {
  const controller = new AbortController();

  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const query = new URLSearchParams({
      page: String(page),
      limit: String(PAGE_SIZE),
    });

    const response = await fetch(
      `${API_BASE_URL}/products?${query.toString()}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      }
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        payload?.message ||
          payload?.error ||
          `Unable to fetch products (${response.status}).`
      );
    }

    const items = extractProductRecords(payload);

    if (!items) {
      throw new Error(
        "Unrecognized products API response. Please inspect the Network response."
      );
    }

    return {
      items,
      pagination: extractPagination(payload),
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The products request timed out. Please retry.");
    }

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to the backend. Check whether the server is running."
      );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Safely read a numeric pagination field.
 */
function getPositiveInteger(value) {
  const number = Number(value);

  return Number.isInteger(number) && number > 0 ? number : null;
}

/**
 * Fetch the public catalogue and follow pagination when provided.
 */
export async function fetchAdminProducts() {
  const firstPage = await fetchProductPage(1);
  const products = [...firstPage.items];
  const pagination = firstPage.pagination;

  const totalProducts =
    getPositiveInteger(pagination.total) ??
    getPositiveInteger(pagination.totalItems) ??
    getPositiveInteger(pagination.totalDocs) ??
    getPositiveInteger(pagination.count);

  let totalPages =
    getPositiveInteger(pagination.totalPages) ??
    getPositiveInteger(pagination.pages);

  if (!totalPages && totalProducts != null) {
    totalPages = Math.max(1, Math.ceil(totalProducts / PAGE_SIZE));
  }

  // If the API doesn't expose pagination metadata, avoid guessing
  // how many pages exist. Use the records returned by the first page.
  if (totalPages && totalPages > 1) {
    for (let start = 2; start <= totalPages; start += 3) {
      const end = Math.min(start + 2, totalPages);
      const requests = [];

      for (let page = start; page <= end; page += 1) {
        requests.push(fetchProductPage(page));
      }

      const results = await Promise.all(requests);

      for (const result of results) {
        products.push(...result.items);
      }
    }
  }

  return {
    products,
    totalProducts: totalProducts ?? products.length,
  };
}

/**
 * Calculate inventory metrics from the returned product records.
 */
export function calculateInventoryStats(products = []) {
  const safeProducts = Array.isArray(products) ? products : [];

  let inventoryUnits = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const product of safeProducts) {
    const rawQuantity = Number(
      product.stockQuantity ?? product.stock ?? 0
    );

    const quantity =
      Number.isFinite(rawQuantity) && rawQuantity > 0
        ? rawQuantity
        : 0;

    inventoryUnits += quantity;

    if (quantity === 0) {
      outOfStockCount += 1;
    } else if (quantity <= LOW_STOCK_THRESHOLD) {
      lowStockCount += 1;
    }
  }

  const categories = new Set(
    safeProducts
      .map((product) => {
        if (typeof product.category === "string") {
          return product.category.trim();
        }

        return product.category?.name || product.category?.slug || "";
      })
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

/**
 * Load the dashboard product and inventory overview.
 */
export async function fetchAdminOverview() {
  const { products, totalProducts } = await fetchAdminProducts();
  const stats = calculateInventoryStats(products);

  return {
    totalProducts,
    ...stats,
    products,
    source: "public-catalogue",
  };
}
