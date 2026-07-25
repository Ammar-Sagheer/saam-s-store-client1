import Link from "next/link";

export const metadata = { title: "Privacy Policy | Oman and Alam" };

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">Privacy Policy</span>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-16 flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">
            Information We Collect
          </h2>
          <p className="text-text-light text-sm leading-relaxed">
            We collect information you provide directly to us such as your name,
            email address, shipping address, and phone number when you place an
            order or contact us.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">
            How We Use Your Information
          </h2>
          <p className="text-text-light text-sm leading-relaxed">
            We use the information we collect to process your orders, send you
            order confirmations, respond to your comments and questions, and
            send you marketing communications if you have opted in.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Information Sharing</h2>
          <p className="text-text-light text-sm leading-relaxed">
            We do not sell, trade, or otherwise transfer your personal
            information to outside parties. This does not include trusted third
            parties who assist us in operating our website and servicing you.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Cookies</h2>
          <p className="text-text-light text-sm leading-relaxed">
            We use cookies to enhance your experience on our website. You can
            choose to disable cookies through your browser settings but this may
            affect your ability to use certain features of our website.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-bold text-dark">Contact Us</h2>
          <p className="text-text-light text-sm leading-relaxed">
            If you have any questions about this privacy policy please contact
            us at EMAIL_TODO.
          </p>
        </div>
      </div>
    </div>
  );
}
