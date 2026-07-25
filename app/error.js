"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      {/* Error Icon */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mb-4 sm:mb-6">
        <svg
          className="w-8 h-8 sm:w-10 sm:h-10 text-sale"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-dark text-center mb-2 sm:mb-3">
        Something Went Wrong
      </h1>
      <p className="text-text-light text-center text-sm sm:text-base max-w-xs sm:max-w-md px-4 mb-2">
        We apologize for the inconvenience. Our team has been notified.
      </p>
      {error.message && (
        <p className="text-xs sm:text-sm text-text-light bg-gray-light px-3 sm:px-4 py-2 rounded max-w-xs sm:max-w-md text-center mb-4 sm:mb-6 break-words">
          Error: {error.message}
        </p>
      )}

      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center px-4 w-full sm:w-auto">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded transition-colors cursor-pointer text-sm sm:text-base w-full sm:w-auto"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="bg-white border border-gray-medium hover:border-primary text-text font-medium px-4 sm:px-6 py-2.5 sm:py-3 rounded transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
