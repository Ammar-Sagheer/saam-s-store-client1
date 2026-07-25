"use client";

import ProductCard from "./ProductCard";

export default function RecentlyViewed({ currentProductId, products }) {
  const filtered = products.filter((p) => p.id !== currentProductId);

  if (filtered.length === 0) return null;

  return (
    <div className="mt-16 border-t border-gray-medium pt-12">
      <h2 className="text-xl font-bold text-dark mb-8 text-center">
        Recently Viewed Products
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
