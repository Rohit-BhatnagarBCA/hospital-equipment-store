/*
 * Reports Page
 * -------------------------------------------------------
 * Dedicated page for the Admin Panel.
 * This file will hold the UI and functionality for Reports management.
 */


import { BarChart3 } from "lucide-react";
import AdminSectionPage from "../../components/admin/AdminSectionPage";

export default function AdminReports() {
  return (
    <AdminSectionPage
      title="Reports & Analytics"
      description="Review sales performance, order trends and medical equipment business reports."
      icon={BarChart3}
    />
  );
}
