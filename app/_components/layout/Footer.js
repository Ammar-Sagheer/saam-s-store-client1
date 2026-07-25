import Link from "next/link";
import { siteConfig } from "@/app/_lib/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-footer text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Column 1 - Brand */}
        <div className="flex flex-col gap-4">
          <span className="text-2xl font-bold text-primary-light">
            {siteConfig.fullName}
          </span>
          <p className="text-gray-medium text-sm">{siteConfig.tagline}</p>
          <div className="text-sm text-gray-medium flex flex-col gap-1">
            <p>{siteConfig.addressLine1}</p>
            <p>{siteConfig.addressLine2}</p>
            <p>Email: {siteConfig.contactEmail}</p>
          </div>
        </div>

        {/* Column 2 - Shop */}
        <div className="flex flex-col gap-4">
          <h3 className="text-primary-light font-semibold text-lg">Shop</h3>
          <div className="flex flex-col gap-2">
            <Link
              href="/account"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              My Account
            </Link>
            <Link
              href="/shop"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Shop
            </Link>
            <Link
              href="/cart"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Cart
            </Link>
            <Link
              href="/checkout"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/track-order"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Track Order
            </Link>
          </div>
        </div>

        {/* Column 3 - Support */}
        <div className="flex flex-col gap-4">
          <h3 className="text-primary-light font-semibold text-lg">Support</h3>
          <div className="flex flex-col gap-2">
            <Link
              href="/terms"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Terms & Condition
            </Link>
            <Link
              href="/refund-policy"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Refund and Returns Policy
            </Link>
            <Link
              href="/privacy-policy"
              className="text-gray-medium text-sm hover:text-primary-light transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        {/* Column 4 - Newsletter */}
        <div className="flex flex-col gap-4">
          <h3 className="text-primary-light font-semibold text-lg">
            Newsletter
          </h3>
          <p className="text-gray-medium text-sm">
            Subscribe to get the latest deals and offers.
          </p>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-2 text-sm text-text bg-white rounded-sm outline-none"
            />
            <button className="bg-primary hover:bg-primary-hover text-white text-sm font-medium py-2 px-4 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4 text-center text-gray-medium text-sm">
        <p>
          © {new Date().getFullYear()} {siteConfig.fullName}. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
