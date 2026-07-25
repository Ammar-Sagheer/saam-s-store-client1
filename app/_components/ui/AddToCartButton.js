"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/app/_components/cart/CartContext";

export default function AddToCartButton({ product, disabled = false }) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    if (disabled) return;
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      sale_price: product.sale_price,
      images: product.images,
    });
  }

  // ✅ If disabled, show "Out of Stock"
  if (disabled) {
    return (
      <button
        disabled
        className="cursor-not-allowed flex items-center justify-center gap-2 bg-gray-300 text-gray-500 font-medium py-3 px-8 w-full md:w-fit transition-colors"
      >
        <ShoppingCartIcon className="w-5 h-5" />
        OUT OF STOCK
      </button>
    );
  }

  return (
    <button
      onClick={handleAddToCart}
      className="cursor-pointer flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 w-full md:w-fit transition-colors"
    >
      <ShoppingCartIcon className="w-5 h-5" />
      ADD TO CART
    </button>
  );
}
