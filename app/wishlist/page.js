import Link from "next/link";
import { createSupabaseServer } from "@/app/_lib/supabase-server";
import AccountLoginPrompt from "@/app/_components/account/AccountLoginPrompt";
import ProductCard from "@/app/_components/ui/ProductCard";
import { ArrowLeftIcon, HeartIcon } from "@heroicons/react/24/outline";

export default async function WishlistPage() {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <AccountLoginPrompt />;
  }

  const { data: wishlistItems } = await supabase
    .from("wishlist_items")
    .select(
      "product_id, products(*, categories(name, slug), product_images(image_url, display_order))",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const products = (wishlistItems || [])
    .filter((item) => item.products)
    .map((item) => ({
      ...item.products,
      images:
        item.products.product_images
          ?.sort((a, b) => a.display_order - b.display_order)
          .map((img) => img.image_url) || [],
    }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/account"
          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-dark">My Wishlist</h1>
      </div>

      {products.length === 0 ? (
        <div className="bg-gray-light rounded-lg p-12 text-center flex flex-col items-center gap-3">
          <HeartIcon className="w-10 h-10 text-text-light" />
          <p className="text-text-light text-sm">
            You haven&apos;t saved any products yet.
          </p>
          <Link href="/shop" className="text-primary text-sm hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
