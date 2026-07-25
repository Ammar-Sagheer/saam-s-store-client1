import Link from "next/link";
import Image from "next/image";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { getOrderByIdAndEmail } from "@/app/_lib/data-service";
import { formatPrice } from "@/app/_lib/helpers";
import ClearCart from "@/app/_components/cart/ClearCart";
import OrderEmailPrompt from "@/app/_components/cart/OrderEmailPrompt";
import { siteConfig } from "@/app/_lib/siteConfig";

export default async function OrderConfirmationPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const orderId = resolvedParams?.orderId;
  const email = resolvedParams?.email;

  if (!orderId) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <p className="text-text-light text-sm">No order specified.</p>
      </div>
    );
  }

  if (!email) {
    return <OrderEmailPrompt orderId={orderId} />;
  }

  const order = await getOrderByIdAndEmail(Number(orderId), email);

  if (!order) {
    return <OrderEmailPrompt orderId={orderId} notFound={true} />;
  }

  return (
    <div className="bg-white min-h-screen py-12">
      {/* Clear cart on mount */}
      <ClearCart />

      <div className="max-w-2xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center flex flex-col items-center gap-4 mb-10">
          <CheckCircleIcon className="w-20 h-20 text-success" />
          <h1 className="text-3xl font-bold text-dark">Order Placed!</h1>
          <p className="text-text-light text-sm leading-relaxed">
            Thank you for your order. We have received it and will process it
            shortly.
          </p>
        </div>

        {/* Order Info */}
        <div className="border border-gray-medium p-6 flex flex-col gap-6 mb-8">
          <h2 className="text-lg font-bold text-dark text-center">
            Order Summary
          </h2>

          {/* Order Meta */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-medium">
              <span className="text-sm text-text-light">Order ID</span>
              <span className="text-sm font-bold text-dark">#{order.id}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-medium">
              <span className="text-sm text-text-light">Name</span>
              <span className="text-sm font-medium text-dark">
                {order.first_name} {order.last_name}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-medium">
              <span className="text-sm text-text-light">Email</span>
              <span className="text-sm font-medium text-dark">
                {order.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-medium">
              <span className="text-sm text-text-light">Payment Method</span>
              <span className="text-sm font-medium text-dark capitalize">
                {order.payment_method === "bank_transfer"
                  ? "Direct Bank Transfer"
                  : "Cash on Delivery"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-medium">
              <span className="text-sm text-text-light">Status</span>
              <span className="text-xs font-bold text-white bg-primary px-2 py-1 rounded-full">
                Pending
              </span>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-dark">Items Ordered</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative w-14 h-14 bg-gray-light shrink-0">
                  {item.images?.[0] && (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-contain"
                      sizes="56px"
                    />
                  )}
                  <span className="absolute -top-0.3 -right-2 bg-dark text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-text text-xs font-medium line-clamp-2">
                    {item.name}
                  </p>
                </div>
                <p className="text-sm font-bold text-dark shrink-0">
                  {formatPrice((item.sale_price || item.price) * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="flex flex-col gap-3 border-t border-gray-medium pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Subtotal</span>
              <span className="text-sm font-bold text-primary">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-text">Shipping</span>
              <span className="text-sm text-text-light">
                {order.total > order.subtotal
                  ? formatPrice(order.total - order.subtotal)
                  : "Free"}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-gray-medium pt-3">
              <span className="text-base font-bold text-dark">Total</span>
              <span className="text-lg font-bold text-dark">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Bank Transfer Instructions */}
          {order.payment_method === "bank_transfer" && (
            <div className="bg-gray-light p-4 text-xs text-text-light flex flex-col gap-1">
              <p className="font-medium text-text">Payment Instructions:</p>
              <p>
                Please use{" "}
                <span className="font-bold text-dark">#{order.id}</span> as your
                payment reference.
              </p>
              <p className="mt-1 font-medium text-text">
                Account Name: {siteConfig.bankTransfer.accountName}
              </p>
              <p className="font-medium text-text">
                Account Details: {siteConfig.bankTransfer.accountNumber}
              </p>
              <p className="font-medium text-text">
                Routing Number: {siteConfig.bankTransfer.routingNumber}
              </p>
              <p className="font-medium text-text">
                Bank Name: {siteConfig.bankTransfer.bankName}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/shop"
            className="bg-primary hover:bg-primary-hover text-white text-sm font-medium py-3 px-6 transition-colors"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="border border-dark text-dark text-sm font-medium py-3 px-6 hover:bg-dark hover:text-white transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
