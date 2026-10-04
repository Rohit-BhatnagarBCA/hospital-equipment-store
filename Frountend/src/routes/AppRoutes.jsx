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
 * /                       -> Home page
 * /products               -> Product catalogue
 * /products/:productId    -> Dynamic product details page
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

          The actual product will be identified using
          the productId parameter.

          IMPORTANT:
          We do NOT create a separate JSX page for every
          individual product.
      ================================================= */}

      <Route
        path="/products/:productId"
        element={<ProductDetails />}
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
          /account
      ================================================= */}


      {/* =================================================
          FUTURE PROTECTED ROUTES
          =================================================

          Admin/customer-sensitive routes will eventually
          be protected using authentication and authorization.

          Example:

          /admin
          /admin/products
          /admin/categories
          /admin/orders

          IMPORTANT:
          We will NOT rely only on React Router for security.

          The backend will verify:
          - Authentication
          - User identity
          - User role
          - Authorization

          This prevents a user from bypassing frontend
          restrictions by directly calling an API.
      ================================================= */}


    </Routes>

  );
}


export default AppRoutes;