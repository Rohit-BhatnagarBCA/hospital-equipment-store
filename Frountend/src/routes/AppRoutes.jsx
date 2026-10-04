/*
 * AppRoutes
 * -------------------------------------------------------
 * Centralized route configuration for the application.
 *
 * Why routes are kept in a separate file:
 * - Keeps App.jsx clean.
 * - Makes it easier to add new pages later.
 * - Keeps all URL/page relationships in one place.
 *
 * Current routes:
 * /                       -> Home page
 * /products/:productId    -> Dynamic product details page
 *
 * IMPORTANT:
 * The :productId parameter allows every product to use the
 * same ProductDetails page instead of creating a separate
 * JSX page for every product.
 */

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import ProductDetails from "../pages/ProductDetails";


function AppRoutes() {
  return (
    <Routes>

      {/* =================================================
          HOME ROUTE
          =================================================
          
          Main landing page of the website.
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =================================================
          PRODUCT DETAILS ROUTE
          =================================================
          
          :productId is a dynamic URL parameter.
          
          Example:
          /products/patient-monitor-pro
          /products/icu-ventilator
          /products/digital-ecg
          
          All of these URLs can use the same
          ProductDetails.jsx page.
      ================================================= */}

      <Route
        path="/products/:productId"
        element={<ProductDetails />}
      />


      {/* =================================================
          FUTURE ROUTES
          =================================================
          
          We will add routes here only when their pages
          actually exist.
          
          Example:
          
          /products
          /categories/:categoryId
          /login
          /register
          /cart
          /account
          
          This prevents us from creating unnecessary
          placeholder pages at the current stage.
      ================================================= */}

    </Routes>
  );
}

export default AppRoutes;