import ProductCard from "@/app/_components/ui/ProductCard";
import SortSelect from "@/app/_components/shop/SortSelect";
import { getProducts } from "@/app/_lib/data-service";

export const metadata = {
  title: "Shop | Saamj Store",
  description: "Browse all products at Saamj Store",
};

export default async function ShopPage({ searchParams }) {
  const resolvedParams = await searchParams;

  const search = resolvedParams?.search || "";
  const category = resolvedParams?.category || "";
  const minPrice = resolvedParams?.minPrice || "";
  const maxPrice = resolvedParams?.maxPrice || "";
  const sort = resolvedParams?.sort || "default";

  const products = await getProducts({
    search,
    category,
    minPrice,
    maxPrice,
    sort,
  });

  return (
    <div>
      {/* Sorting Bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-text-light text-sm">
          Showing {products.length} products
        </p>
        <SortSelect currentSort={sort} />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            priority={index < 4}
          />
        ))}
      </div>

      {/* No products found */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-light text-lg">No products found.</p>
        </div>
      )}
    </div>
  );
}
