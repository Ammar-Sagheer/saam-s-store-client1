"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  ShoppingBagIcon,
  TagIcon,
  ClipboardDocumentListIcon,
  EnvelopeIcon,
  PhotoIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { siteConfig } from "@/app/_lib/siteConfig";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: <HomeIcon className="w-5 h-5" /> },
  {
    name: "Products",
    href: "/admin/products",
    icon: <ShoppingBagIcon className="w-5 h-5" />,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: <TagIcon className="w-5 h-5" />,
  },
  {
    name: "Hero Banner",
    href: "/admin/hero",
    icon: <PhotoIcon className="w-5 h-5" />,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: <ClipboardDocumentListIcon className="w-5 h-5" />,
  },
  {
    name: "Messages",
    href: "/admin/messages",
    icon: <EnvelopeIcon className="w-5 h-5" />,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-dark text-white p-2 rounded-lg"
      >
        <Bars3Icon className="w-5 h-5" />
      </button>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar — intentionally stays dark permanently, does not invert */}
      <aside
        className={`
        bg-dark min-h-screen w-64 shrink-0 flex flex-col z-50
        fixed md:sticky md:top-0 top-0 left-0 h-screen
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Close button - mobile */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden absolute top-4 right-4 text-white"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        <div className="px-6 py-5 border-b border-dark-light">
          <h1 className="text-white font-bold text-xl">
            {siteConfig.name} Admin
          </h1>
          <p className="text-gray-300 text-xs mt-1">Store Management</p>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
          {sidebarLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-dark-light hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-dark-light">
          <p className="text-gray-300 text-xs">
            {siteConfig.name} LLC © {new Date().getFullYear()}
          </p>
        </div>
      </aside>
    </>
  );
}
