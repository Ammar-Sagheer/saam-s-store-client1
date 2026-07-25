"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ShopBreadcrumbs({ categories }) {
  const searchParams = useSearchParams();
  const categorySlug = searchParams.get("category");
  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="flex items-center gap-2 text-sm mt-1 flex-wrap">
      <Link href="/" className="text-primary hover:underline">
        Home
      </Link>
      {activeCategory ? (
        <>
          <span className="text-gray-medium">/</span>
          <Link href="/shop" className="text-primary hover:underline">
            Shop
          </Link>
          <span className="text-gray-medium">/</span>
          <span className="text-gray-medium line-clamp-1">
            {activeCategory.name}
          </span>
        </>
      ) : (
        <>
          <span className="text-gray-medium">/</span>
          <span className="text-gray-medium">Shop</span>
        </>
      )}
    </div>
  );
}
