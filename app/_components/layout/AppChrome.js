"use client";

import { Suspense } from "react";
import { usePathname } from "next/navigation";
import AnnouncementBar from "@/app/_components/layout/AnnouncementBar";
import Navbar from "@/app/_components/layout/Navbar";
import Footer from "@/app/_components/layout/Footer";
import ScrollToTop from "@/app/_components/ui/ScrollToTop";
import { CartProvider } from "@/app/_components/cart/CartContext";
import CartDrawer from "@/app/_components/cart/CartDrawer";

export default function AppChrome({ children, categories }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <AnnouncementBar />
      <Suspense fallback={<div className="h-16 bg-white shadow-sm" />}>
        <Navbar categories={categories} />
      </Suspense>
      <CartDrawer />
      {children}
      <Footer />
      <ScrollToTop />
    </CartProvider>
  );
}
