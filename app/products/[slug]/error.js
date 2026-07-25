"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function ProductError({ error, reset }) {
  useEffect(() => {
    console.error("Product detail error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-yellow-50 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-dark mb-2 text-center">
        Product Not Loading
      </h2>
      <p className="text-text-light text-center text-sm sm:text-base max-w-xs sm:max-w-sm px-4 mb-6">
        We couldn't load this product. Please try again.
      </p>

      <div className="flex flex-wrap gap-3 justify-center px-4 w-full sm:w-auto">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-4 sm:px-5 py-2 rounded transition-colors cursor-pointer text-sm w-full sm:w-auto"
        >
          Try Again
        </button>
        <Link
          href="/shop"
          className="bg-white border border-gray-medium hover:border-primary text-text font-medium px-4 sm:px-5 py-2 rounded transition-colors text-sm w-full sm:w-auto text-center"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  );
}
