"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseAuth } from "@/app/_lib/supabase-auth";
import { formatPrice } from "@/app/_lib/helpers";
import {
  ArrowRightOnRectangleIcon,
  MapPinIcon,
  Cog6ToothIcon,
  HeartIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";

export default function AccountDashboard({ user, orders }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabaseAuth.auth.signOut();
    window.location.assign("/account");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark">
            Welcome, {user.user_metadata?.full_name || user.email}
          </h1>
          <p className="text-text-light text-sm">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="cursor-pointer flex items-center gap-2 border border-gray-medium hover:border-sale hover:text-sale text-text px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-4 h-4" />
          {loggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Link
          href="/orders"
          className="group bg-white border border-gray-medium rounded-xl p-4 sm:p-6 text-center hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex justify-center mb-1 sm:mb-2">
            <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8 text-text-light group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-text group-hover:text-primary transition-colors">
            My Orders
          </p>
        </Link>
        <Link
          href="/wishlist"
          className="group bg-white border border-gray-medium rounded-xl p-4 sm:p-6 text-center hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex justify-center mb-1 sm:mb-2">
            <HeartIcon className="w-6 h-6 sm:w-8 sm:h-8 text-text-light group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-text group-hover:text-primary transition-colors">
            Wishlist
          </p>
        </Link>
        <Link
          href="/addresses"
          className="group bg-white border border-gray-medium rounded-xl p-4 sm:p-6 text-center hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex justify-center mb-1 sm:mb-2">
            <MapPinIcon className="w-6 h-6 sm:w-8 sm:h-8 text-text-light group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-text group-hover:text-primary transition-colors">
            Addresses
          </p>
        </Link>
        <Link
          href="/settings"
          className="group bg-white border border-gray-medium rounded-xl p-4 sm:p-6 text-center hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex justify-center mb-1 sm:mb-2">
            <Cog6ToothIcon className="w-6 h-6 sm:w-8 sm:h-8 text-text-light group-hover:text-primary transition-colors" />
          </div>
          <p className="text-xs sm:text-sm font-medium text-text group-hover:text-primary transition-colors">
            Settings
          </p>
        </Link>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-dark">Recent Orders</h2>
          {orders.length > 0 && (
            <Link
              href="/orders"
              className="text-primary text-sm hover:underline"
            >
              View All
            </Link>
          )}
        </div>
        {orders.length === 0 ? (
          <div className="bg-gray-light rounded-lg p-8 text-center">
            <p className="text-text-light text-sm mb-3">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/shop" className="text-primary text-sm hover:underline">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-medium rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium text-dark text-sm">
                    Order #{order.id}
                  </p>
                  <p className="text-text-light text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-sm">
                    {formatPrice(order.total)}
                  </p>
                  <span className="text-xs text-text-light capitalize">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
