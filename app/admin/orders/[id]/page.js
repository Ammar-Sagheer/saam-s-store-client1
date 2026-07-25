import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getOrderById } from "@/app/_lib/data-service";
import { formatPrice } from "@/app/_lib/helpers";
import OrderStatusUpdater from "@/app/_components/admin/OrderStatusUpdater";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-heading">Order #{order.id}</h1>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-4">
            <h2 className="font-bold text-heading">Order Items</h2>
            <div className="flex flex-col gap-4">
              {order.order_items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 pb-4 border-b border-gray-medium last:border-0 last:pb-0"
                >
                  <div className="relative w-16 h-16 bg-gray-light shrink-0 rounded overflow-hidden">
                    {item.images?.[0] && (
                      <Image
                        src={item.images[0]}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-text font-medium text-sm">{item.name}</p>
                    <p className="text-text-light text-xs">
                      {formatPrice(item.sale_price || item.price)} ×{" "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="text-heading font-bold text-sm">
                    {formatPrice(
                      (item.sale_price || item.price) * item.quantity,
                    )}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-gray-medium">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-light">Subtotal</span>
                <span className="text-text">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-light">Shipping</span>
                <span className="text-text">
                  {order.total > order.subtotal
                    ? formatPrice(order.total - order.subtotal)
                    : "Free"}
                </span>
              </div>
              <div className="flex items-center justify-between font-bold pt-2 border-t border-gray-medium">
                <span className="text-heading">Total</span>
                <span className="text-heading">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-lg p-6">
            <OrderStatusUpdater
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-3">
            <h2 className="font-bold text-heading">Customer</h2>
            <div className="flex flex-col gap-2 text-sm">
              <div>
                <p className="text-text-light text-xs">Name</p>
                <p className="text-text font-medium">
                  {order.first_name} {order.last_name}
                </p>
              </div>
              <div>
                <p className="text-text-light text-xs">Email</p>
                <p className="text-text font-medium">{order.email}</p>
              </div>
              <div>
                <p className="text-text-light text-xs">Phone</p>
                <p className="text-text font-medium">{order.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-3">
            <h2 className="font-bold text-heading">Shipping Address</h2>
            <div className="text-sm text-text">
              <p>{order.address}</p>
              <p>
                {order.city}, {order.state} {order.postal_code}
              </p>
              <p>{order.country}</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-lg p-6 flex flex-col gap-3">
            <h2 className="font-bold text-heading">Payment Method</h2>
            <p className="text-sm text-text capitalize">
              {order.payment_method === "bank_transfer"
                ? "Direct Bank Transfer"
                : "Cash on Delivery"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
