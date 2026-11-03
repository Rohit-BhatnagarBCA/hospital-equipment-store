
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

import AdminLayout from "../components/admin/AdminLayout";
import AdminDashboard from "../pages/admin";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminCategories from "../pages/AdminCategories";

function AppRoutes() {
  return (
    <Routes>
      {/* Storefront home page */}
      <Route path="/" element={<Home />} />

      {/* Public product catalogue */}
      <Route path="/products" element={<Products />} />

      {/* Individual product details */}
      <Route path="/products/:productId" element={<ProductDetails />} />

      {/* Customer profile */}
      <Route path="/profile" element={<Profile />} />

      {/* Customer orders */}
      <Route path="/profile/orders" element={<ProfileOrders />} />

      <Route
        path="/profile/orders/:orderId"
        element={<ProfileOrderDetails />}
      />

      {/* Admin workspace */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />

        {/* Admin product management */}
        <Route path="products" element={<AdminProducts />} />

        {/* Admin category management */}
        <Route path="categories" element={<AdminCategories />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
