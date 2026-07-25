import ProductCard from "@/app/_components/ui/ProductCard";
import { getFeaturedProducts } from "@/app/_lib/data-service";
import Link from "next/link";

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl font-bold text-dark-light">
            Featured Products
          </h2>
          <Link
            href="/shop"
            className="text-sm text-primary hover:text-primary-hover font-medium hover:underline transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
