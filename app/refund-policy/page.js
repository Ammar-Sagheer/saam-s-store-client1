import Link from "next/link";

export const metadata = { title: "Refund & Returns Policy | Oman and Alam" };

export default function RefundPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">
            Refund & Returns Policy
          </h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">Refund Policy</span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Returns</h2>
          <p className="text-text-light text-sm leading-relaxed">
            We accept returns within 30 days of purchase. Items must be unused,
            in their original packaging, and in the same condition that you
            received them.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Refunds</h2>
          <p className="text-text-light text-sm leading-relaxed">
            Once we receive your returned item, we will inspect it and notify
            you of the approval or rejection of your refund. If approved, your
            refund will be processed within 5-7 business days.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Non-Returnable Items</h2>
          <p className="text-text-light text-sm leading-relaxed">
            Certain items cannot be returned including perishable goods, opened
            personal care products, and items marked as final sale.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Contact Us</h2>
          <p className="text-text-light text-sm leading-relaxed">
            If you have any questions about our refund policy, please contact us
            at contact@omanandalam.example.com.
          </p>
        </div>
      </div>
    </div>
  );
}
