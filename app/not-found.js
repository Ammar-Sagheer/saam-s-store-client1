import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 py-12 bg-white">
      {/* 404 Number - Large and clear */}
      <div className="text-[120px] sm:text-[150px] md:text-[200px] font-bold text-primary/10 select-none leading-none">
        404
      </div>

      {/* Content */}
      <div className="text-center -mt-8 sm:-mt-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-dark mb-3">
          Page Not Found
        </h1>
        <p className="text-text-light text-sm sm:text-base max-w-md mx-auto px-4">
          Oops! It looks like you&apos;ve wandered off the beaten path. The page
          you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mt-8 px-4 w-full sm:w-auto">
        <Link
          href="/"
          className="bg-primary hover:bg-primary-hover text-white font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
        >
          Go Home
        </Link>
        <Link
          href="/shop"
          className="bg-white border border-gray-medium hover:border-primary text-text font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
        >
          Browse Shop
        </Link>
        <Link
          href="/contact"
          className="bg-gray-light hover:bg-gray-medium text-text font-medium px-6 sm:px-8 py-2.5 sm:py-3 rounded transition-colors text-sm sm:text-base w-full sm:w-auto text-center"
        >
          Contact Us
        </Link>
      </div>

      {/* Quick Links */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-text-light">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/shop" className="hover:text-primary transition-colors">
          Shop
        </Link>
        <Link href="/about" className="hover:text-primary transition-colors">
          About
        </Link>
        <Link href="/contact" className="hover:text-primary transition-colors">
          Contact
        </Link>
      </div>
    </div>
  );
}
