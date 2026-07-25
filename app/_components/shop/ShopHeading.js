"use client";

import { useSearchParams } from "next/navigation";

export default function ShopHeading({ categories }) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <h1 className="text-3xl font-bold text-white">
      {activeCategory ? `Category: ${activeCategory.name}` : "Shop"}
    </h1>
  );
}
