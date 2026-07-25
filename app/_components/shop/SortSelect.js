"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect({ currentSort }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort(e) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/shop?${params.toString()}`);
  }

  return (
    <select
      value={currentSort}
      onChange={handleSort}
      className="border border-gray-medium text-sm text-text px-3 py-2 outline-none rounded-sm"
    >
      <option value="default">Default Sorting</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="newest">Newest First</option>
    </select>
  );
}
