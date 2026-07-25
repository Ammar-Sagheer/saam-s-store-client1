"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";

// TODO: once real banner photos are available, upload them to this
// tenant's storage folder and swap this gradient block back for an
// <Image> per slide (see git history for the original image-based version).
const slides = [
  {
    id: 1,
    title: "Oman and Alam",
    subtitle: "Quality Products, Trusted Service.",
    description:
      "Where smart choices, quality products, and everyday value come together.",
    cta: "SHOP NOW",
    link: "/shop",
  },
  {
    id: 2,
    title: "New Arrivals",
    subtitle: "Fresh Products Just Landed",
    description: "Discover our latest collection of quality essentials.",
    cta: "EXPLORE",
    link: "/shop",
  },
  {
    id: 3,
    title: "Best Sellers",
    subtitle: "Customer Favorites",
    description: "Shop the products everyone is loving right now.",
    cta: "VIEW ALL",
    link: "/shop",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ✅ Auto-play slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  function goToNextSlide() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  function goToPrevSlide() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentSlide) return;
    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  const current = slides[currentSlide];

  return (
    <section className="relative w-full h-125 md:h-150 overflow-hidden">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative w-full h-full shrink-0 bg-gradient-to-br from-dark to-dark-light"
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}
      </div>

      {/* Text Content - Overlays on top of slides */}
      <div className="absolute inset-0 z-10 flex flex-col items-center  justify-center text-center px-8 md:items-start md:text-left md:px-40 gap-6 text-white">
        <p className="text-lg animate-fade-in">{current.subtitle}</p>
        <h1 className="text-5xl md:text-7xl font-bold animate-fade-in-delay">
          {current.title}
        </h1>
        <p className="text-lg max-w-md animate-fade-in-delay-2">
          {current.description}
        </p>
        <Link
          href={current.link}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-medium py-3 px-6 w-fit animate-fade-in-delay-2"
        >
          <ShoppingCartIcon className="w-5 h-5" />
          {current.cta}
        </Link>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
              index === currentSlide
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Prev/Next Buttons (optional - can remove if you prefer auto-play only) */}
      <button
        onClick={goToPrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full cursor-pointer transition-colors hidden md:block"
        aria-label="Previous slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={goToNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full cursor-pointer transition-colors hidden md:block"
        aria-label="Next slide"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </section>
  );
}
