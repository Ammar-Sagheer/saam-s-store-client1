import Link from "next/link";

export const metadata = { title: "Terms & Conditions | Saamj Store" };

export default function TermsPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">Terms & Conditions</span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">1. Introduction</h2>
          <p className="text-text-light text-sm leading-relaxed">
            Welcome to SAAMJ LLC. By accessing and using our website, you accept
            and agree to be bound by the terms and conditions outlined here.
            Please read these terms carefully before using our services.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">2. Use of Website</h2>
          <p className="text-text-light text-sm leading-relaxed">
            You may use our website for lawful purposes only. You must not use
            our website in any way that causes or may cause damage to the
            website or impairment of the availability or accessibility of the
            website.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">3. Orders & Payments</h2>
          <p className="text-text-light text-sm leading-relaxed">
            All orders are subject to availability and confirmation of the order
            price. We reserve the right to refuse any order. Payment must be
            received prior to the shipment of goods.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">4. Shipping</h2>
          <p className="text-text-light text-sm leading-relaxed">
            We offer free shipping on all orders over $2500. For orders below
            this amount, a flat shipping rate of $15 applies. Delivery times may
            vary depending on your location.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">5. Contact</h2>
          <p className="text-text-light text-sm leading-relaxed">
            If you have any questions about these terms, please contact us at
            sales@saamjllc.com.
          </p>
        </div>
      </div>
    </div>
  );
}
