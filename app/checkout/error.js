"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function CheckoutError({ error, reset }) {
  useEffect(() => {
    console.error("Checkout error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <svg
          className="w-8 h-8 text-sale"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
          />
        </svg>
      </div>

      <h2 className="text-xl font-bold text-dark mb-2">Checkout Issue</h2>
      <p className="text-text-light text-center max-w-sm mb-6">
        There was a problem with your checkout. Please try again.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-5 py-2 rounded transition-colors cursor-pointer text-sm"
        >
          Try Again
        </button>
        <Link
          href="/cart"
          className="bg-white border border-gray-medium hover:border-primary text-text font-medium px-5 py-2 rounded transition-colors text-sm"
        >
          Return to Cart
        </Link>
      </div>
    </div>
  );
}
