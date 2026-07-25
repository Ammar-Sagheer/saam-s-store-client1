"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/app/_components/cart/CartContext";
import { formatPrice, FREE_SHIPPING_THRESHOLD } from "@/app/_lib/helpers";
import { useState, useEffect } from "react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice, clearCart } =
    useCart();
  const [mounted, setMounted] = useState(false);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-text-light text-sm">
          Loading cart...
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-text-light text-lg">Your cart is empty.</p>
        <Link
          href="/shop"
          className="bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 px-6 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Cart</h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              SAAMJ
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">Cart</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Table */}
          <div className="flex-1">
            <p className="text-text-light text-sm mb-4">
              {totalItems} {totalItems === 1 ? "item" : "items"} in your cart
            </p>
            {/* Table Header — desktop only */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-medium text-sm font-semibold text-text uppercase">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Subtotal</div>
            </div>

            {/* Cart Items */}
            <div className="flex flex-col divide-y divide-gray-medium">
              {cartItems.map((item) => (
                <div key={item.id}>
                  {/* Desktop row */}
                  <div className="hidden md:grid grid-cols-12 gap-4 py-6 items-center">
                    <div className="col-span-6 flex items-center gap-4">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="cursor-pointer text-text-light hover:text-sale hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <div className="relative w-16 aspect-square bg-gray-light shrink-0">
                        {item.images?.[0] && (
                          <Image
                            src={item.images[0]}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        )}
                      </div>
                      <p className="text-text text-sm font-medium line-clamp-2">
                        {item.name}
                      </p>
                    </div>

                    <div className="col-span-2 text-center text-sm text-text">
                      {formatPrice(item.sale_price || item.price)}
                    </div>

                    <div className="col-span-2 flex items-center justify-center">
                      <div className="flex items-center border border-gray-medium">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="cursor-pointer w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm border-x border-gray-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="cursor-pointer w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2 text-center text-sm font-bold text-primary">
                      {formatPrice(
                        (item.sale_price || item.price) * item.quantity,
                      )}
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden flex gap-3 py-5">
                    <div className="relative w-20 aspect-square bg-gray-light shrink-0">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0]}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-2 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-text text-sm font-medium line-clamp-2">
                            {item.name}
                          </p>
                          <p className="text-text-light text-xs mt-0.5">
                            {formatPrice(item.sale_price || item.price)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="cursor-pointer text-text-light hover:text-sale hover:bg-red-50 p-2 rounded-lg transition-colors shrink-0"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center border border-gray-medium">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors"
                          >
                            -
                          </button>
                          <span className="w-8 h-8 flex items-center justify-center text-sm border-x border-gray-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="cursor-pointer w-8 h-8 flex items-center justify-center text-text hover:text-primary transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(
                            (item.sale_price || item.price) * item.quantity,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Actions */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-medium">
              <Link
                href="/shop"
                className="flex items-center gap-2 text-sm font-medium text-text hover:text-primary transition-colors group"
              >
                <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                Continue Shopping
              </Link>
              <button
                onClick={clearCart}
                className="cursor-pointer flex items-center gap-2 text-sm font-medium text-text-light hover:text-sale border border-gray-medium hover:border-sale px-4 py-2 rounded-lg transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
                Clear Cart
              </button>
            </div>
          </div>

          {/* Cart Totals */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="border border-gray-medium p-6 flex flex-col gap-4">
              <h2 className="text-lg font-bold text-dark">Cart Totals</h2>

              <div className="flex items-center justify-between py-3 border-b border-gray-medium">
                <span className="text-sm text-text">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              {totalPrice < FREE_SHIPPING_THRESHOLD && (
                <div className="flex flex-col gap-2 py-3 border-b border-gray-medium">
                  <p className="text-xs text-text-light">
                    Add
                    <span className="font-semibold text-primary">
                      {formatPrice(FREE_SHIPPING_THRESHOLD - totalPrice)}
                    </span>
                    more for free shipping!
                  </p>
                  <div className="w-full h-1.5 bg-gray-light rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{
                        width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between py-3 border-b border-gray-medium">
                <span className="text-sm text-text">Shipping</span>
                <span className="text-sm text-text-light">
                  {totalPrice >= FREE_SHIPPING_THRESHOLD
                    ? "Free"
                    : "Calculated at checkout"}
                </span>
              </div>

              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-bold text-dark">Total</span>
                <span className="text-lg font-bold text-dark">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full text-center bg-primary hover:bg-primary-hover text-white font-medium py-3 transition-colors uppercase tracking-wide"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
