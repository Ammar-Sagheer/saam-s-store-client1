"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ClipboardDocumentCheckIcon,
  ShoppingCartIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "@/app/_components/cart/CartContext";
import { siteConfig } from "@/app/_lib/siteConfig";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Categories",
    href: "/shop",
    dropdown: [
      { name: "Baby Care", href: "/shop?category=baby-care" },
      {
        name: "Beauty & Personal Care",
        href: "/shop?category=beauty-personal-care",
      },
      { name: "Grocery & Gourmet", href: "/shop?category=grocery-gourmet" },
      { name: "Hardware & Tools", href: "/shop?category=hardware-tools" },
      { name: "Health & Household", href: "/shop?category=health-household" },
      { name: "Home & Kitchen", href: "/shop?category=home-kitchen" },
      { name: "Office & Stationary", href: "/shop?category=office-stationary" },
      { name: "Pet Care", href: "/shop?category=pet-care" },
      { name: "Toys & Games", href: "/shop?category=toys-games" },
    ],
  },
  { name: "Shop", href: "/shop" },
  { name: "Track Order", href: "/track-order" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const hasCategory = searchParams.has("category");
  const router = useRouter();
  const { totalItems, setIsOpen } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else if (!searchOpen) {
      document.body.style.overflow = "";
    }
  }, [menuOpen, searchOpen]);

  useEffect(() => {
    if (pathname === "/shop" && hasCategory) {
      setMobileCategoriesOpen(true);
    }
  }, [pathname, hasCategory]);

  function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/shop?search=${searchQuery}`);
    setSearchQuery("");
    setSearchOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
    setMobileCategoriesOpen(false);
  }

  return (
    <>
      {/* Search Overlay */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 animate-fadeIn"
            onClick={() => setSearchOpen(false)}
          />
          <div
            className="fixed top-15 z-60 animate-slideDown w-[90%] md:w-150"
            style={{ left: "50%", transform: "translateX(-50%)" }}
          >
            <div className="bg-white shadow-xl px-6 py-4 flex items-center gap-4">
              <MagnifyingGlassIcon className="w-6 h-6 text-text-light shrink-0" />
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full text-lg outline-none text-text placeholder:text-text-light"
                />
              </form>
              <button
                onClick={() => setSearchOpen(false)}
                className="cursor-pointer text-text-light hover:text-dark transition-colors shrink-0"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-45"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Slide-in Menu Panel */}
      <div
        className={`
          mobile-nav-panel
          md:hidden fixed top-0 left-0 h-screen w-72 bg-white z-55
          flex flex-col shadow-xl
          transition-transform duration-300 ease-in-out will-change-transform
          ${menuOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-medium">
          <Image
            src={siteConfig.logo}
            alt={siteConfig.fullName}
            width={100}
            height={40}
            style={{ width: "auto" }}
            priority
          />
          <button
            onClick={closeMenu}
            className="cursor-pointer text-text hover:text-primary"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 px-4 py-6 flex flex-col gap-1 overflow-y-auto">
          {navLinks.map((link) =>
            link.dropdown ? (
              <div key={link.name}>
                <button
                  onClick={() => setMobileCategoriesOpen((prev) => !prev)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors cursor-pointer ${
                    pathname === "/shop" && hasCategory
                      ? "bg-primary text-white"
                      : "text-text hover:bg-gray-light hover:text-primary"
                  }`}
                >
                  {link.name}
                  <ChevronRightIcon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      mobileCategoriesOpen ? "rotate-90" : ""
                    }`}
                  />
                </button>
                <div
                  className={`flex flex-col gap-1 pl-4 overflow-hidden transition-all duration-300 ${
                    mobileCategoriesOpen ? "max-h-96 mt-1 mb-2" : "max-h-0"
                  }`}
                >
                  {link.dropdown.map((item) => {
                    const itemCategory = item.href.split("category=")[1];
                    const isActiveItem =
                      searchParams.get("category") === itemCategory;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                          isActiveItem
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-text-light hover:bg-gray-light hover:text-primary"
                        }`}
                        onClick={closeMenu}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  pathname === link.href &&
                  (link.href !== "/shop" || !hasCategory)
                    ? "bg-primary text-white"
                    : "text-text hover:bg-gray-light hover:text-primary"
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ),
          )}
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 relative flex items-center h-16">
          <button
            className="md:hidden absolute left-4 text-text hover:text-primary cursor-pointer"
            onClick={() => setMenuOpen(true)}
          >
            <Bars3Icon className="w-6 h-6" />
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 md:static md:left-auto md:translate-x-0"
          >
            <Image
              src={siteConfig.logo}
              alt={siteConfig.fullName}
              width={120}
              height={50}
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <div className="hidden md:flex items-center gap-8 mx-auto">
            {navLinks.map((link) =>
              link.dropdown ? (
                <div key={link.name} className="relative group">
                  <button
                    className={`flex items-center gap-1 font-medium transition-colors ${
                      pathname === "/shop" && hasCategory
                        ? "text-primary"
                        : "text-text hover:text-primary"
                    }`}
                  >
                    {link.name}
                    <ChevronDownIcon className="w-4 h-4" />
                  </button>
                  <div className="absolute top-full left-0 pt-6 w-52 hidden group-hover:block z-50">
                    <div className="bg-white shadow-lg rounded-md overflow-hidden">
                      {link.dropdown.map((item) => {
                        const itemCategory = item.href.split("category=")[1];
                        const isActiveItem =
                          searchParams.get("category") === itemCategory;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm transition-colors ${
                              isActiveItem
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-text hover:bg-gray-light hover:text-primary"
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    pathname === link.href &&
                    (link.href !== "/shop" || !hasCategory)
                      ? "text-primary"
                      : "text-text hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>

          <div className="flex items-center gap-4 absolute right-4 md:static md:right-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="cursor-pointer text-text hover:text-primary"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            <Link
              href="/track-order"
              className="text-text hover:text-primary shrink-0"
              aria-label="Track Order"
            >
              <ClipboardDocumentCheckIcon className="w-6 h-6" />
            </Link>

            <button
              onClick={() => setIsOpen(true)}
              className="text-text hover:text-primary relative cursor-pointer"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
