"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function ShopSidebar({ categories, priceRange }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [panelOpen, setPanelOpen] = useState(false);

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString());
    if (search) params.set("search", search);
    else params.delete("search");
    router.push(`/shop?${params.toString()}`);
    setPanelOpen(false);
  }

  function handlePriceFilter() {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");
    router.push(`/shop?${params.toString()}`);
    setPanelOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  const filterContent = (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="bg-gray-light rounded-lg p-4 shadow-sm">
        <h3 className="text-dark font-semibold mb-3">Search Products</h3>
        <div className="flex items-center border border-gray-medium rounded-sm overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-3 py-2 text-sm outline-none text-text"
          />
          <button
            onClick={handleSearch}
            className="bg-primary px-3 py-2 text-white hover:bg-primary-hover transition-colors"
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-gray-light rounded-lg p-4 shadow-sm">
        <h3 className="text-dark font-semibold mb-3">Categories</h3>
        <div className="flex flex-col gap-2">
          <Link
            href="/shop"
            onClick={() => setPanelOpen(false)}
            className={`flex items-center justify-between text-sm transition-colors ${
              !searchParams.get("category")
                ? "text-primary font-semibold"
                : "text-text hover:text-primary"
            }`}
          >
            <span>All Products</span>
            <span className="text-text-light text-xs">
              {categories.reduce(
                (acc, cat) => acc + (cat.products[0]?.count || 0),
                0,
              )}
            </span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              onClick={() => setPanelOpen(false)}
              className={`flex items-center justify-between text-sm transition-colors ${
                searchParams.get("category") === category.slug
                  ? "text-primary font-semibold"
                  : "text-text hover:text-primary"
              }`}
            >
              <span>{category.name}</span>
              <span className="text-text-light text-xs">
                ({category.products[0]?.count || 0})
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="bg-gray-light rounded-lg p-4 shadow-sm">
        <h3 className="text-dark font-semibold mb-3">Price Range</h3>
        <p className="text-text-light text-xs mb-3">
          Range: ${priceRange.min} — ${priceRange.max}
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder={`Min $${priceRange.min}`}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-medium rounded-sm outline-none text-text"
          />
          <span className="text-text-light">-</span>
          <input
            type="number"
            placeholder={`Max $${priceRange.max}`}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-medium rounded-sm outline-none text-text"
          />
        </div>
        <button
          onClick={handlePriceFilter}
          className="mt-3 w-full bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 rounded-sm transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <div className="hidden md:block">{filterContent}</div>

      {/* Mobile: trigger button in place of the sidebar */}
      <button
        onClick={() => setPanelOpen(true)}
        className="md:hidden cursor-pointer w-full flex items-center justify-center gap-2 bg-gray-light border border-gray-medium text-text font-medium py-3 rounded-lg"
      >
        <AdjustmentsHorizontalIcon className="w-5 h-5" />
        Filters & Search
      </button>

      {/* Mobile: overlay */}
      {panelOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-45"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Mobile: slide-in panel */}
      <div
        className={`
          mobile-nav-panel
          md:hidden fixed top-0 left-0 h-screen w-80 max-w-[85%] bg-white z-55
          flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out will-change-transform
          ${panelOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-medium shrink-0">
          <h2 className="font-bold text-dark text-lg">Filters</h2>
          <button
            onClick={() => setPanelOpen(false)}
            className="cursor-pointer text-text hover:text-primary"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">{filterContent}</div>
      </div>
    </>
  );
}
