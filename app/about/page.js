import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheckIcon,
  TruckIcon,
  HeartIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { getCategoriesWithCount, getHeroSlides } from "@/app/_lib/data-service";

export const metadata = {
  title: "About | Oman and Alam",
  description: "Learn more about Oman and Alam",
};

const values = [
  {
    id: 1,
    icon: <ShieldCheckIcon className="w-8 h-8 text-primary" />,
    title: "Quality Products",
    description:
      "We carefully select every product to ensure the highest quality for our customers.",
  },
  {
    id: 2,
    icon: <TruckIcon className="w-8 h-8 text-primary" />,
    title: "Fast Delivery",
    description:
      "We ship quickly and reliably so you get your orders as fast as possible.",
  },
  {
    id: 3,
    icon: <HeartIcon className="w-8 h-8 text-primary" />,
    title: "Customer First",
    description:
      "Our customers are at the heart of everything we do. Your satisfaction is our priority.",
  },
  {
    id: 4,
    icon: <StarIcon className="w-8 h-8 text-primary" />,
    title: "Everyday Value",
    description:
      "We believe quality products should be affordable for everyone, every day.",
  },
];

export default async function AboutPage() {
  const [categories, heroSlides] = await Promise.all([
    getCategoriesWithCount(),
    getHeroSlides(),
  ]);

  const totalProducts = categories.reduce(
    (sum, cat) => sum + (cat.products[0]?.count || 0),
    0,
  );
  const aboutImage = heroSlides.find((s) => s.image_url)?.image_url;

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white">About Us</h1>
          <div className="flex items-center gap-2 text-sm mt-1">
            <Link href="/" className="text-primary hover:underline">
              Home
            </Link>
            <span className="text-gray-medium">/</span>
            <span className="text-gray-medium">About</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gray-light py-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-dark leading-tight">
              Quality Products,{" "}
              <span className="text-primary">Trusted Service.</span>
            </h2>
            <p className="text-text-light text-sm leading-relaxed">
              Oman and Alam is dedicated to bringing you high-quality
              everyday products at prices that make sense. We believe that
              smart shopping should not be complicated — just great
              products, great prices, and great service.
            </p>
            <p className="text-text-light text-sm leading-relaxed">
              Our carefully curated selection ensures that every product
              meets our high standards of quality and value.
            </p>
            <Link
              href="/shop"
              className="bg-primary hover:bg-primary-hover text-white font-medium py-3 px-8 w-fit transition-colors uppercase tracking-wide"
            >
              Shop Now
            </Link>
          </div>

          <div className="relative w-full h-80 lg:h-96 rounded-lg overflow-hidden bg-gradient-to-br from-dark to-dark-light">
            {aboutImage && (
              <Image
                src={aboutImage}
                alt="Our store"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-dark text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.id}
                className="flex flex-col items-center text-center gap-4 p-6 border border-gray-medium hover:border-primary transition-colors"
              >
                <div className="bg-gray-light p-4 rounded-full">
                  {value.icon}
                </div>
                <h3 className="text-dark font-bold text-lg">{value.title}</h3>
                <p className="text-text-light text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-dark-light py-20">
        <div className="max-w-7xl mx-auto px-4 text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-white">About Oman and Alam</h2>
          <p className="text-gray-medium text-sm leading-relaxed max-w-2xl">
            Oman and Alam was founded with a simple mission — to make
            quality everyday products accessible to everyone. We are
            committed to providing an exceptional shopping experience from
            browsing to delivery.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-8 w-full max-w-2xl">
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-bold text-primary">
                {categories.length}+
              </span>
              <span className="text-gray-medium text-sm">Categories</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-bold text-primary">
                {totalProducts}+
              </span>
              <span className="text-gray-medium text-sm">Products</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-4xl font-bold text-primary">24/7</span>
              <span className="text-gray-medium text-sm">Support</span>
            </div>
          </div>
          <Link
            href="/contact"
            className="mt-4 border border-white text-white text-sm font-medium py-3 px-8 hover:bg-white hover:text-dark transition-colors uppercase tracking-wide"
          >
            Get In Touch
          </Link>
        </div>
      </div>
    </div>
  );
}
