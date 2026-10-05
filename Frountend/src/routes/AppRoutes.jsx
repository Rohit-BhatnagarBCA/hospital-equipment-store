/*
 * AppRoutes
 * -------------------------------------------------------
 * Centralized route configuration for the application.
 *
 * Current routes:
 *
 * /
 * /products
 * /products/:productId
 *
 * /profile
 * /profile/orders
 * /profile/orders/:orderId
 *
 * IMPORTANT:
 * React Router only controls frontend navigation.
 * Authentication and authorization must be handled
 * by the backend.
 */

import { Routes, Route } from "react-router-dom";


// =========================================================
// PAGE IMPORTS
// =========================================================

// Main landing page.
import Home from "../pages/Home";

// Product catalogue.
import Products from "../pages/Products";

// Dynamic product details.
import ProductDetails from "../pages/ProductDetails";

// Customer profile dashboard.
import Profile from "../pages/Profile";

// Customer orders page.
import ProfileOrders from "../pages/ProfileOrders";

// Individual order details.
import ProfileOrderDetails from "../components/Profile/Orders/ProfileOrderDetails";


function AppRoutes() {

  return (

    <Routes>

      {/* =================================================
          HOME
          =================================================
          
          URL:
          /
      ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =================================================
          PRODUCTS
          =================================================
          
          Displays:
          - Product catalogue
          - Search
          - Category filtering
          - Sorting
      ================================================= */}

      <Route
        path="/products"
        element={<Products />}
      />


      {/* =================================================
          PRODUCT DETAILS
          =================================================
          
          Dynamic product route.
          
          Examples:
          
          /products/patient-monitor-pro
          /products/icu-ventilator
          /products/digital-ecg
      ================================================= */}

      <Route
        path="/products/:productId"
        element={<ProductDetails />}
      />


      {/* =================================================
          PROFILE DASHBOARD
          =================================================
          
          Main customer account page.
          
          Contains:
          - Profile information
          - Account summary
          - Order summary
          - Recent orders
          - Profile navigation
          
          URL:
          /profile
      ================================================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* =================================================
          PROFILE ORDERS
          =================================================
          
          Displays the complete order history of the
          currently authenticated customer.
          
          URL:
          /profile/orders
          
          Future backend:
          
          GET /api/orders
      ================================================= */}

      <Route
        path="/profile/orders"
        element={<ProfileOrders />}
      />


      {/* =================================================
          ORDER DETAILS
          =================================================
          
          Displays details of one specific order.
          
          Dynamic parameter:
          :orderId
          
          Example:
          
          /profile/orders/ORD-1001
          /profile/orders/ORD-1002
          
          The same page handles every order.
      ================================================= */}

      <Route
        path="/profile/orders/:orderId"
        element={<ProfileOrderDetails />}
      />


      {/* =================================================
          FUTURE PUBLIC ROUTES
          =================================================
          
          These can be added when their pages are ready:
          
          /categories/:categoryId
          /login
          /register
          /cart
          /checkout
      ================================================= */}



      {/* =================================================
          FUTURE CUSTOMER ROUTES
          =================================================
          
          Possible future account pages:
          
          /profile/settings
          /profile/security
          /profile/saved-products
          /profile/addresses
      ================================================= */}



      {/* =================================================
          FUTURE ADMIN ROUTES
          =================================================
          
          Possible routes:
          
          /admin
          /admin/products
          /admin/categories
          /admin/orders
          /admin/users
          
          IMPORTANT:
          
          Admin authorization must NOT depend only on
          React Router.
          
          Backend must verify:
          
          - Authentication
          - User identity
          - User role
          - Authorization
      ================================================= */}

    </Routes>

  );
}


export default AppRoutes;