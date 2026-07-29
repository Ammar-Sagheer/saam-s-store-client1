"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { XMarkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useCart } from "./CartContext";
import { formatPrice } from "@/app/_lib/helpers";

export default function CartDrawer() {
  const {
    cartItems,
    isOpen,
    setIsOpen,
    removeFromCart,
    updateQuantity,
    totalPrice,
  } = useCart();
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
      setTimeout(() => setVisible(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!visible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${
          animate ? "opacity-100" : "opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[65%] sm:w-96 bg-white z-60 flex flex-col shadow-xl transition-transform duration-300 ${
          animate ? "translate-x-0" : "translate-x-full"
        } cart-drawer`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-medium">
          <h2 className="font-bold text-dark text-lg uppercase tracking-wide">
            Shopping Cart
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="cursor-pointer text-text-light hover:text-dark transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-6">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <p className="text-text-light text-sm md:text-lg">
                Your cart is empty.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-primary text-sm md:text-xl hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex gap-4">
                {/* Image */}
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

                {/* Info */}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="text-text text-sm font-medium line-clamp-2">
                    {item.name}
                  </p>
                  <p className="text-dark font-bold text-sm">
                    {formatPrice(item.sale_price || item.price)}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="cursor-pointer w-6 h-6 border border-gray-medium flex items-center justify-center text-text hover:border-primary hover:text-primary transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm text-text w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="cursor-pointer w-6 h-6 border border-gray-medium flex items-center justify-center text-text hover:border-primary hover:text-primary transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="cursor-pointer text-text-light hover:text-sale hover:bg-red-50 p-1.5 rounded-lg transition-colors -mr-1.5 -mt-1.5"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                  <p className="text-sm font-bold text-dark">
                    {formatPrice(
                      (item.sale_price || item.price) * item.quantity,
                    )}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-medium flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-text font-semibold">Subtotal:</span>
              <span className="text-dark font-bold text-lg">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={() => setIsOpen(false)}
              className="w-full text-center border border-dark text-dark text-sm font-medium py-2 hover:bg-dark hover:text-white transition-colors"
            >
              VIEW CART
            </Link>
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full text-center bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 transition-colors"
            >
              CHECKOUT
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
