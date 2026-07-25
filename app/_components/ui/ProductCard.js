"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { getDiscountPercentage, formatPrice } from "@/app/_lib/helpers";
import { useCart } from "@/app/_components/cart/CartContext";

export default function ProductCard({ product, priority = false }) {
  const { addToCart } = useCart();

  // ✅ Check if sale_price is valid AND actually a discount
  const isSaleValid =
    product.sale_price &&
    product.sale_price > 0 &&
    product.sale_price < product.price;

  // ✅ Only calculate discount if sale is valid
  const discount = isSaleValid
    ? getDiscountPercentage(product.price, product.sale_price)
    : null;

  const mainImage = product.images?.[0];
  const hoverImage = product.images?.[1];
  const hasMultipleImages = product.images?.length > 1;

  function handleAddToCart(e) {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      images: product.images,
    });
  }

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      {/* Image Container */}
      <div className="relative w-full aspect-square  overflow-hidden bg-white">
        {/* ✅ Discount Badge - Only show if discount exists AND > 0 */}
        {discount && discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-sale text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </div>
        )}

        {/* Stock Badge */}
        {product.stock !== undefined &&
          product.stock > 0 &&
          product.stock <= 5 && (
            <div className="absolute top-10 right-2 z-10 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              Only {product.stock} left!
            </div>
          )}

        {/* Out of Stock Badge */}
        {product.stock !== undefined && product.stock === 0 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50">
            <span className="bg-white text-dark font-bold px-4 py-2 rounded">
              Out of Stock
            </span>
          </div>
        )}

        {/* Main Image */}
        {mainImage ? (
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className={`object-cover animate-image-zoom transition-opacity duration-300 ${
              hasMultipleImages ? "group-hover:opacity-0" : ""
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-light">
            <span className="text-text-light text-sm">No Image</span>
          </div>
        )}

        {/* Hover Image */}
        {hasMultipleImages && hoverImage && (
          <Image
            src={hoverImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-image-zoom"
          />
        )}

        {/* Add to Cart Button - Desktop */}
        {product.stock !== 0 && (
          <div className="absolute inset-0 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
            <button
              onClick={handleAddToCart}
              className="cursor-pointer flex items-center gap-2 bg-dark text-white text-sm font-medium px-4 py-2 hover:bg-primary transition-colors"
            >
              <ShoppingCartIcon className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        )}

        {/* Add to Cart Button - Mobile */}
        {product.stock !== 0 && (
          <button
            onClick={handleAddToCart}
            className="cursor-pointer md:hidden absolute bottom-3 right-3 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white shadow-lg transition-transform active:scale-90"
          >
            <ShoppingCartIcon className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-3 flex flex-col gap-1">
        <p className="text-text text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </p>

        {/* ✅ Price - Only show sale if it's actually a discount */}
        {isSaleValid ? (
          <div className="flex items-center gap-2">
            <span className="text-sale font-bold text-sm">
              {formatPrice(product.sale_price)}
            </span>
            <span className="text-text-light text-xs line-through">
              {formatPrice(product.price)}
            </span>
          </div>
        ) : (
          <span className="text-dark font-bold text-sm">
            {formatPrice(product.price)}
          </span>
        )}
      </div>
    </Link>
  );
}
