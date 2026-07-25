import { getAdminStats } from "@/app/_lib/data-service";
import AdminStats from "@/app/_components/admin/AdminStats";
import AdminRevenueChart from "@/app/_components/admin/AdminRevenueChart";
import AdminRecentOrders from "@/app/_components/admin/AdminRecentOrders";

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-heading">Dashboard</h1>

      <AdminStats
        totalProducts={stats.totalProducts}
        totalOrders={stats.totalOrders}
        totalRevenue={stats.totalRevenue}
        totalMessages={stats.totalMessages}
      />

      <AdminRevenueChart orders={stats.orders} />

      <AdminRecentOrders orders={stats.orders.slice(0, 3)} />
    </div>
  );
}
