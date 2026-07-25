import Link from "next/link";
import { formatPrice } from "@/app/_lib/helpers";

export default function AdminRecentOrders({ orders }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-heading font-bold text-lg">Recent Orders</h2>
        <Link
          href="/admin/orders"
          className="text-primary text-sm hover:underline"
        >
          View All
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="text-text-light text-sm">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-medium">
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Total
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                >
                  <td className="py-3 px-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-text">
                    {order.first_name} {order.last_name}
                  </td>
                  <td className="py-3 px-4 text-text font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        order.status === "delivered"
                          ? "bg-success"
                          : order.status === "shipped"
                            ? "bg-blue-500"
                            : order.status === "processing"
                              ? "bg-yellow-500"
                              : "bg-sale"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-light">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
