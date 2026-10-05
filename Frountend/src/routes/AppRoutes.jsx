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

// Product catalogue page.
import Products from "../pages/Products";

// Dynamic product details page.
import ProductDetails from "../pages/ProductDetails";

// Customer profile dashboard.
import Profile from "../pages/Profile";


// =========================================================
// PROFILE / ORDERS COMPONENTS
// =========================================================

// Customer orders page.
//
// IMPORTANT:
// ProfileOrders is NOT inside pages/.
// It is inside:
// components/Profile/Orders/ProfileOrders.jsx
import ProfileOrders from "../components/Profile/Orders/ProfileOrders";

// Individual order details page.
import ProfileOrderDetails from "../components/Profile/Orders/ProfileOrderDetails";


function AppRoutes() {

  return (

    <Routes>


      {/* =================================================
          HOME
          ================================================= */}

      <Route
        path="/"
        element={<Home />}
      />


      {/* =================================================
          PRODUCTS
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
          
          URL:
          
          /profile
      ================================================= */}

      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* =================================================
          CUSTOMER ORDERS
          =================================================
          
          Displays the customer's complete order history.
          
          IMPORTANT:
          
          ProfileOrders is currently a component, not a
          page inside src/pages/.
          
          Actual file:
          
          src/components/Profile/Orders/ProfileOrders.jsx
          
          URL:
          
          /profile/orders
      ================================================= */}

      <Route
        path="/profile/orders"
        element={<ProfileOrders />}
      />


      {/* =================================================
          ORDER DETAILS
          =================================================
          
          Dynamic order route.
          
          Examples:
          
          /profile/orders/ORD-1001
          /profile/orders/ORD-1002
          
          Actual component:
          
          src/components/Profile/Orders/ProfileOrderDetails.jsx
      ================================================= */}

      <Route
        path="/profile/orders/:orderId"
        element={<ProfileOrderDetails />}
      />


      {/* =================================================
          FUTURE CUSTOMER ROUTES
          =================================================
          
          Add these only when their components/pages exist.
          
          /profile/saved
          /profile/security
          /profile/settings
          /profile/addresses
      ================================================= */}


      {/* =================================================
          FUTURE PUBLIC ROUTES
          =================================================
          
          /categories/:categoryId
          /login
          /register
          /cart
          /checkout
      ================================================= */}


      {/* =================================================
          FUTURE ADMIN ROUTES
          =================================================
          
          /admin
          /admin/products
          /admin/categories
          /admin/orders
          /admin/users
          
          Backend authorization will be required.
      ================================================= */}


    </Routes>

  );
}


export default AppRoutes;