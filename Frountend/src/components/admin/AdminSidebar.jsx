
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  ShieldCheck,
  X,
} from "lucide-react";

// Navigation links for the medical equipment administration panel.
const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Products", path: "/admin/products", icon: Package },
  { label: "Categories", path: "/admin/categories", icon: Tags },
  { label: "Inventory", path: "/admin/inventory", icon: Boxes },
  { label: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Customers", path: "/admin/customers", icon: Users },
  { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ open = false, onClose = () => {} }) {
  return (
    <>
      {/* Overlay closes the mobile sidebar when the user taps outside it. */}
      {open && (
        <button
          type="button"
          className="admin-sidebar-overlay"
          aria-label="Close navigation menu"
          onClick={onClose}
        />
      )}

      <aside className={`admin-sidebar ${open ? "is-open" : ""}`}>
        <div className="admin-brand">
          <span className="admin-brand-icon">
            <ShieldCheck size={25} />
          </span>

          <div className="admin-brand-text">
            <strong>HealthEquip</strong>
            <small>Medical Equipment</small>
          </div>

          <button
            type="button"
            className="admin-mobile-close"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <p className="admin-menu-label">WORKSPACE</p>

        <nav className="admin-navigation" aria-label="Admin navigation">
          {menuItems.map(({ label, path, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `admin-nav-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-help">
          <ShieldCheck size={22} />
          <div>
            <strong>Medical Catalogue</strong>
            <small>Manage healthcare products and stock.</small>
          </div>
        </div>
      </aside>
    </>
  );
}