/*
 * AppRoutes
 * -------------------------------------------------------
 * Centralized application routes.
 */

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Profile from "../pages/Profile";

import ProfileOrders from "../components/Profile/Orders/ProfileOrders";
import ProfileOrderDetails from "../components/Profile/Orders/ProfileOrderDetails";


function AppRoutes() {

  return (
    <Routes>

      {/* Home */}
      <Route
        path="/"
        element={<Home />}
      />


      {/* Product catalogue */}
      <Route
        path="/products"
        element={<Products />}
      />


      {/* Individual product */}
      <Route
        path="/products/:productId"
        element={<ProductDetails />}
      />


      {/* Customer profile */}
      <Route
        path="/profile"
        element={<Profile />}
      />


      {/* All customer orders */}
      <Route
        path="/profile/orders"
        element={<ProfileOrders />}
      />


      {/* Individual order details */}
      <Route
        path="/profile/orders/:orderId"
        element={<ProfileOrderDetails />}
      />

    </Routes>
  );
}


export default AppRoutes;