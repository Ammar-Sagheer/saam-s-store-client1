"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center mb-4">
        <svg
          className="w-7 h-7 sm:w-8 sm:h-8 text-sale"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      <h2 className="text-lg sm:text-xl font-bold text-heading mb-2 text-center">
        Admin Error
      </h2>
      <p className="text-text-light text-center text-sm sm:text-base max-w-xs sm:max-w-sm px-4 mb-6">
        Something went wrong in the admin panel. Please try again.
      </p>

      <div className="flex flex-wrap gap-3 justify-center px-4 w-full sm:w-auto">
        <button
          onClick={reset}
          className="bg-primary hover:bg-primary-hover text-white font-medium px-4 sm:px-5 py-2 rounded transition-colors cursor-pointer text-sm w-full sm:w-auto"
        >
          Try Again
        </button>
        <Link
          href="/admin"
          className="bg-surface border border-gray-medium hover:border-primary text-text font-medium px-4 sm:px-5 py-2 rounded transition-colors text-sm w-full sm:w-auto text-center"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
