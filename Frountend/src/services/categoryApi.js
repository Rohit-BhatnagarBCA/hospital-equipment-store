
import { API_BASE_URL } from "../config/api";

const CATEGORY_ENDPOINT = `${API_BASE_URL}/admin/categories`;
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Read the admin JWT from common authentication storage keys.
 * The backend still validates the token and admin role.
 */
function getAuthToken() {
  const possibleKeys = ["token", "accessToken", "authToken"];

  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);

    if (value) {
      return value;
    }
  }

  return null;
}

/**
 * Make category API requests with consistent error handling.
 */
async function categoryRequest(path = "", options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    REQUEST_TIMEOUT_MS
  );

  try {
    const token = getAuthToken();

    const headers = {
      Accept: "application/json",
      ...options.headers,
    };

    // Do not set Content-Type for FormData.
    // The browser adds the multipart boundary automatically.
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${CATEGORY_ENDPOINT}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error(
          "Admin authentication failed. Please login with an admin account."
        );
      }

      throw new Error(
        payload?.message ||
        payload?.error ||
        `Category request failed (${response.status}).`
      );
    }

    return payload;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out. Please try again.");
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
 * Extract category records from common API response formats.
 */
function extractCategories(payload) {
  const candidates = [
    payload?.data?.categories,
    payload?.data?.items,
    payload?.data,
    payload?.categories,
    payload?.items,
  ];

  return candidates.find(Array.isArray) || [];
}

/**
 * Fetch all categories.
 */
export async function fetchCategories() {
  const payload = await categoryRequest();

  return extractCategories(payload);
}

/**
 * Create a category with an optional image.
 */
export async function createCategory(categoryData) {
  const formData = new FormData();

  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description);
  formData.append("status", categoryData.status);

  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  return categoryRequest("", {
    method: "POST",
    body: formData,
  });
}

/**
 * Update an existing category.
 */
export async function updateCategory(id, categoryData) {
  const formData = new FormData();

  formData.append("name", categoryData.name);
  formData.append("description", categoryData.description);
  formData.append("status", categoryData.status);

  if (categoryData.image) {
    formData.append("image", categoryData.image);
  }

  return categoryRequest(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: formData,
  });
}

/**
 * Delete a category by its MongoDB ID.
 */
export async function deleteCategory(id) {
  return categoryRequest(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
