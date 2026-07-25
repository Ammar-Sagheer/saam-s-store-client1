"use client";

import { useState } from "react";

export default function ProductTabs({ description }) {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="mt-16 border-t border-gray-medium">
      {/* Tab Headers */}
      <div className="flex gap-8 border-b border-gray-medium">
        <button
          onClick={() => setActiveTab("description")}
          className={`cursor-pointer py-4 text-sm font-semibold transition-colors ${
            activeTab === "description"
              ? "text-primary border-b-2 border-primary"
              : "text-text-light hover:text-primary"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`cursor-pointer py-4 text-sm font-semibold transition-colors ${
            activeTab === "reviews"
              ? "text-primary border-b-2 border-primary"
              : "text-text-light hover:text-primary"
          }`}
        >
          Reviews (0)
        </button>
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === "description" && (
          <p className="text-text-light text-sm leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
        {activeTab === "reviews" && (
          <p className="text-text-light text-sm">
            No reviews yet. Be the first to review this product.
          </p>
        )}
      </div>
    </div>
  );
}
