/**
 * API configuration
 * -------------------------------------------------------
 * Single place that decides which backend the frontend talks to.
 *
 * Why this exists:
 * The backend address is different on your laptop and on a real server.
 * Hardcoding "http://localhost:5000" inside service files would force a code
 * change for every deployment. With Vite, any variable that starts with
 * VITE_ can be set in a ".env" file and is read here.
 *
 * How it works:
 *  - If VITE_API_BASE_URL is set (see .env.example) it is used.
 *  - Otherwise it falls back to the local development backend, so the app
 *    keeps working exactly as before without any setup.
 *  - A trailing slash is removed so "/products" is never joined as "//products".
 */

const configuredUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (
  configuredUrl || "http://localhost:5000/api/v1"
).replace(/\/+$/, "");