import Link from "next/link";
import { getAllOrders } from "@/app/_lib/data-service";
import { formatPrice } from "@/app/_lib/helpers";
import { EyeIcon } from "@heroicons/react/24/outline";
import Pagination from "@/app/_components/admin/Pagination";

function StatusBadge({ status }) {
  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
        status === "delivered"
          ? "bg-success"
          : status === "shipped"
            ? "bg-blue-500"
            : status === "processing"
              ? "bg-yellow-500"
              : "bg-sale"
      }`}
    >
      {status}
    </span>
  );
}

export default async function AdminOrdersPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;

  const { orders, totalPages, currentPage, totalCount } =
    await getAllOrders(page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Orders</h1>
        <span className="text-text-light text-sm">
          {totalCount} total orders
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-12 text-center text-text-light">
          No orders yet.
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-medium bg-gray-light">
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
                      Payment
                    </th>
                    <th className="text-left py-3 px-4 text-text-light font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-text-light font-medium">
                      Date
                    </th>
                    <th className="text-left py-3 px-4 text-text-light font-medium">
                      Actions
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
                        <span className="text-primary font-medium">
                          #{order.id}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text font-medium">
                        {order.first_name} {order.last_name}
                      </td>
                      <td className="py-3 px-4 text-text font-medium">
                        {formatPrice(order.total)}
                      </td>
                      <td className="py-3 px-4 text-text-light text-xs">
                        {order.payment_method === "bank_transfer"
                          ? "Bank Transfer"
                          : "COD"}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-3 px-4 text-text-light">
                        {new Date(order.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded transition-colors inline-flex"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-3">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="bg-surface border border-border rounded-lg p-4 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-primary font-bold">#{order.id}</span>
                  <StatusBadge status={order.status} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text font-medium text-sm">
                    {order.first_name} {order.last_name}
                  </span>
                  <span className="text-heading font-bold text-sm">
                    {formatPrice(order.total)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-text-light">
                  <span>
                    {order.payment_method === "bank_transfer"
                      ? "Bank Transfer"
                      : "COD"}
                  </span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/orders"
          />
        </>
      )}
    </div>
  );
}
