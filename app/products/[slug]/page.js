import AddToCartButton from "@/app/_components/ui/AddToCartButton";
import ImageGallery from "@/app/_components/ui/ImageGallery";
import ProductCard from "@/app/_components/ui/ProductCard";
import ProductTabs from "@/app/_components/ui/ProductTabs";
import TrackRecentlyViewed from "@/app/_components/ui/TrackRecentlyViewed";
import { getProductBySlug, getRelatedProducts } from "@/app/_lib/data-service";
import { formatPrice, getDiscountPercentage } from "@/app/_lib/helpers";
import Link from "next/link";

export const revalidate = 3600;

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const relatedProducts = await getRelatedProducts(
    product.category_id,
    product.id,
  );
  const discount = getDiscountPercentage(product.price, product.sale_price);

  // ✅ Check if product is out of stock
  const isOutOfStock = product.stock === 0 || product.stock === undefined;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8">
          <Link href="/" className="text-primary hover:underline">
            Home
          </Link>
          <span className="text-text-light">/</span>
          <Link
            href={`/shop?category=${product.categories?.slug}`}
            className="text-primary hover:underline"
          >
            {product.categories?.name}
          </Link>
          <span className="text-text-light">/</span>
          <span className="text-text-light line-clamp-1">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left - Image Gallery */}
          <ImageGallery images={product.images} productName={product.name} />

          {/* Right - Product Info */}
          <div className="flex flex-col gap-6">
            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-dark">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.sale_price &&
              product.sale_price > 0 &&
              product.sale_price < product.price ? (
                <>
                  <span className="text-lg text-text-light line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-2xl font-bold text-dark">
                    {formatPrice(product.sale_price)}
                  </span>
                  {discount && discount > 0 && (
                    <span className="bg-sale text-white text-xs font-bold px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  )}
                </>
              ) : (
                <span className="text-2xl font-bold text-dark">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="text-sale font-bold text-sm bg-red-50 px-3 py-1 rounded">
                  Out of Stock
                </span>
              ) : product.stock <= 5 ? (
                <span className="text-yellow-600 font-bold text-sm bg-yellow-50 px-3 py-1 rounded">
                  Only {product.stock} left in stock!
                </span>
              ) : (
                <span className="text-green-600 font-bold text-sm bg-green-50 px-3 py-1 rounded">
                  In Stock
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-text-light text-sm leading-relaxed">
              {product.description}
            </p>

            {/* ✅ Add to Cart - Disabled when out of stock */}
            <AddToCartButton product={product} disabled={isOutOfStock} />

            {/* Category */}
            <p className="text-sm text-text">
              Category:{" "}
              <Link
                href={`/shop?category=${product.categories?.slug}`}
                className="text-primary font-medium hover:underline"
              >
                {product.categories?.name}
              </Link>
            </p>

            {/* Safe Checkout */}
            <div className="border border-gray-medium rounded-sm p-4 text-center">
              <p className="text-primary text-sm font-semibold mb-3">
                Guaranteed Safe Checkout
              </p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <span className="font-bold text-blue-600 text-sm">PayPal</span>
                <span className="font-bold text-blue-800 text-lg tracking-tight">
                  VISA
                </span>
                <span className="font-bold text-red-500 text-sm">
                  Mastercard
                </span>
                <span className="font-bold text-orange-500 text-xs tracking-tight">
                  DISCOVER
                </span>
                <span className="font-bold text-blue-900 text-xs tracking-tight">
                  AMERICAN EXPRESS
                </span>
                <span className="font-bold text-red-700 text-xs tracking-tight">
                  McAfee SECURE
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <ProductTabs description={product.description} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t border-gray-medium pt-12">
            <h2 className="text-xl font-bold text-dark mb-8 text-center">
              Related Products
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}

        {/* Track this product as viewed */}
        <TrackRecentlyViewed product={product} />
      </div>
    </div>
  );
}
