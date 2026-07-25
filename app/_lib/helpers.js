// helpers.js
import { siteConfig } from "@/app/_lib/siteConfig";

export const FREE_SHIPPING_THRESHOLD = siteConfig.freeShippingThreshold;

export function getDiscountPercentage(price, salePrice) {
  // ✅ Return null if either value is missing or invalid
  if (!price || price <= 0) return null;
  if (!salePrice || salePrice <= 0) return null;

  // ✅ Return null if sale price is NOT actually a discount
  if (salePrice >= price) return null;

  const discount = ((price - salePrice) / price) * 100;
  const rounded = Math.round(discount);

  // ✅ Only return if discount is actually a discount (greater than 0)
  return rounded > 0 ? rounded : null;
}

export function formatPrice(price) {
  return new Intl.NumberFormat(siteConfig.locale, {
    style: "currency",
    currency: siteConfig.currency,
  }).format(price);
}

export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];
  const items = localStorage.getItem("recentlyViewed");
  return items ? JSON.parse(items) : [];
}

export function addToRecentlyViewed(product) {
  if (typeof window === "undefined") return;
  const items = getRecentlyViewed();
  const filtered = items.filter((p) => p.id !== product.id);
  const updated = [product, ...filtered].slice(0, 6);
  localStorage.setItem("recentlyViewed", JSON.stringify(updated));
}

export function shapeProductImages(product) {
  return {
    ...product,
    images:
      product.product_images
        ?.sort((a, b) => a.display_order - b.display_order)
        .map((img) => img.image_url) || [],
  };
}
