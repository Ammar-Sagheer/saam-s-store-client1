"use client";

import { useEffect, useState } from "react";
import RecentlyViewed from "./RecentlyViewed";
import { getRecentlyViewed, addToRecentlyViewed } from "@/app/_lib/helpers";

export default function TrackRecentlyViewed({ product }) {
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    addToRecentlyViewed(product);
    const items = getRecentlyViewed();
    setRecentProducts(items);
  }, [product.id]);

  return (
    <RecentlyViewed currentProductId={product.id} products={recentProducts} />
  );
}
