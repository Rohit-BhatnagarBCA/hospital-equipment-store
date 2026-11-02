
import { ShoppingCart } from "lucide-react";
import AdminSectionPage from "../../components/admin/AdminSectionPage";

export default function AdminOrders() {
  return (
    <AdminSectionPage
      title="Orders Management"
      description="Review customer orders, track order progress and manage order statuses."
      icon={ShoppingCart}
    />
  );
}
