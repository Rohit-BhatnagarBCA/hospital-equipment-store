
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "./admin.css";

// Wraps every admin page in a shared sidebar and header.
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-shell">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

        <main className="admin-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          HealthEquip · Medical Sales Intelligence
        </footer>
      </div>
    </div>
  );
}