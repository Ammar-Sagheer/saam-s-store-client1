import { getCategoriesWithCount, getPriceRange } from "@/app/_lib/data-service";
import ShopSidebar from "@/app/_components/shop/ShopSidebar";
import ShopBreadcrumbs from "@/app/_components/shop/ShopBreadcrumbs";
import { Suspense } from "react";
import ShopHeading from "@/app/_components/shop/ShopHeading";

export default async function ShopLayout({ children }) {
  const [categories, priceRange] = await Promise.all([
    getCategoriesWithCount(),
    getPriceRange(),
  ]);

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <Suspense
            fallback={<h1 className="text-3xl font-bold text-white">Shop</h1>}
          >
            <ShopHeading categories={categories} />
          </Suspense>
          <Suspense fallback={<div className="h-5 mt-1" />}>
            <ShopBreadcrumbs categories={categories} />
          </Suspense>
        </div>
      </div>

      {/* Shop Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <Suspense fallback={<div>Loading filters...</div>}>
              <ShopSidebar categories={categories} priceRange={priceRange} />
            </Suspense>
          </aside>

          {/* Main Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
