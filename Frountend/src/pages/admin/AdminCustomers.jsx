/*
 * Customers Page
 * -------------------------------------------------------
 * Dedicated page for the Admin Panel.
 * This file will hold the UI and functionality for Customers management.
 */


import { Users } from "lucide-react";
import AdminSectionPage from "../../components/admin/AdminSectionPage";

export default function AdminCustomers() {
  return (
    <AdminSectionPage
      title="Customers Management"
      description="View customer information and understand their order activity."
      icon={Users}
    />
  );
}
