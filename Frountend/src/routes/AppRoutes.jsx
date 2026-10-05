/*
 * AppRoutes
 * -------------------------------------------------------
 * Centralized route configuration for the application.
 *
 * Why routes are kept in a separate file:
 * - Keeps App.jsx clean.
 * - Keeps all URL/page relationships in one place.
 * - Makes future route expansion easier.
 * - Keeps public and protected routes easy to organize.
 *
 * Current routes:
 * /                           -> Home page
 * /products                   -> Product catalogue
 * /products/:productId        -> Product details
 * /profile                    -> User profile dashboard
 * /profile/orders             -> User orders
 *
 * SECURITY NOTE:
 * Frontend routing only controls what page the user can visit.
 * It is NOT a security boundary.
 *
 * Authentication and authorization for sensitive areas such
 * as Admin Dashboard will later be enforced by the backend.
 */


import { Routes, Route } from "react-router-dom";


// =========================================================
// PAGE IMPORTS
// =========================================================

// Main landing page.
import Home from "../pages/Home";

// Product catalogue page.
import Products from "../pages/Products";

// Dynamic product details page.
import ProductDetails from "../pages/ProductDetails";

// User profile dashboard.
import Profile from "../pages/Profile";

// User orders page.
import ProfileOrders from "../pages/ProfileOrders";


function AppRoutes() {

  return (

    <Routes>


      {/* =================================================
          HOME ROUTE
          =================================================

          Main landing page of the website.

          URL:
          /

          Example:
          http://localhost:5173/
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =================================================
          PRODUCTS CATALOGUE ROUTE
          =================================================

          Displays all available medical equipment.

          This page contains:
          - Product search
          - Category filtering
          - Product sorting
          - Product cards

          URL:
          /products

          Example:
          http://localhost:5173/products
      ================================================= */}

      <Route
        path="/products"
        element={<Products />}
      />


      {/* =================================================
          PRODUCT DETAILS ROUTE
          =================================================

          :productId is a dynamic URL parameter.

          This allows every product to use the same
          ProductDetails.jsx page.

          Examples:

          /products/patient-monitor-pro
          /products/icu-ventilator
          /products/digital-ecg

          IMPORTANT:
          We do NOT create a separate JSX page for every
          individual product.
      ================================================= */}

      <Route
        path="/products/:productId"
        element={<ProductDetails />}
      />


      {/* =================================================
          PROFILE DASHBOARD ROUTE
          =================================================

          Main account/profile dashboard.

          This page contains:
          - Profile information
          - Profile navigation
          - Account sections
          - Orders navigation
          - Saved products
          - Security
          - Account settings

          URL:
          /profile
      ================================================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* =================================================
          PROFILE ORDERS ROUTE
          =================================================

          Displays the user's order history.

          URL:
          /profile/orders

          IMPORTANT:
          The actual order data is currently frontend/demo
          data.

          Later this page will receive real order information
          from the backend API.

          Example future API:

          GET /api/orders

          Authentication will be handled by the backend.
      ================================================= */}

      <Route
        path="/profile/orders"
        element={<ProfileOrders />}
      />


      {/* =================================================
          FUTURE PUBLIC ROUTES
          =================================================

          These routes will be added only when their
          corresponding pages actually exist.

          Possible future routes:

          /categories/:categoryId
          /login
          /register
          /cart
      ================================================= */}


      {/* =================================================
          FUTURE PROTECTED ROUTES
          =================================================

          Customer-sensitive routes will eventually use
          authentication.

          Example:

          /profile
          /profile/orders
          /profile/settings
          /profile/security

          IMPORTANT:

          React Router is NOT a security boundary.

          A user can manually type a URL in the browser,
          so sensitive operations must ALWAYS be checked
          by the backend.

          Backend will verify:

          - Authentication
          - User identity
          - User role
          - Resource ownership
          - Authorization

          Example:

          User A must NOT be able to request:

          GET /api/orders/user-B-order-id

          simply by changing an ID in the frontend.

          The backend will verify that the requested order
          actually belongs to the authenticated user.
      ================================================= */}


      {/* =================================================
          FUTURE ADMIN ROUTES
          =================================================

          Possible future routes:

          /admin
          /admin/products
          /admin/categories
          /admin/orders
          /admin/users

          These will require backend role authorization.

          Example:

          role === "admin"

          But the real authorization check will happen
          on the backend, not only inside React.
      ================================================= */}


    </Routes>

  );
}


export default AppRoutes;