"use client";

import { useState, useEffect } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    role: "Verified Buyer",
    rating: 5,
    quote:
      "Absolutely love shopping here! The quality is outstanding and shipping was faster than expected. Will definitely be a repeat customer.",
  },
  {
    id: 2,
    name: "James Carter",
    role: "Verified Buyer",
    rating: 5,
    quote:
      "Great selection of products at fair prices. Customer support was quick to respond when I had a question about my order.",
  },
  {
    id: 3,
    name: "Amina Yusuf",
    role: "Verified Buyer",
    rating: 4,
    quote:
      "Really happy with my purchase. Packaging was secure and everything arrived in perfect condition. Highly recommend this store.",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [current]);

  function goToNext() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  function goToPrev() {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setTimeout(() => setIsTransitioning(false), 500);
  }

  function goToSlide(index) {
    if (isTransitioning || index === current) return;
    setIsTransitioning(true);
    setCurrent(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-dark text-center mb-2">
          What Our Customers Say
        </h2>
        <p className="text-text-light text-center mb-10">
          Real feedback from real shoppers
        </p>

        <div className="relative ">
          <div className="mx-8 sm:mx-12 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${current * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full shrink-0 px-2">
                  <div className="bg-gray-light border border-gray-medium rounded-xl p-8 sm:p-10 flex flex-col items-center text-center gap-4 shadow-sm">
                    {/* Stars */}
                    <div className="flex gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-5 h-5 ${
                            i < t.rating ? "text-primary" : "text-gray-medium"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-text text-base sm:text-lg leading-relaxed max-w-xl italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Avatar initial */}
                    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl mt-2 shadow-sm">
                      {t.name.charAt(0)}
                    </div>

                    {/* Name + Role */}
                    <div>
                      <p className="font-semibold text-dark text-sm">
                        {t.name}
                      </p>
                      <p className="text-text-light text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prev/Next Buttons */}
          <button
            onClick={goToPrev}
            className="cursor-pointer absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-medium shadow-md text-text hover:text-primary hover:border-primary p-2.5 rounded-full transition-colors hidden sm:block z-10"
            aria-label="Previous testimonial"
          >
            <svg
              className="w-5 h-5"
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
            onClick={goToNext}
            className="cursor-pointer absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-medium shadow-md text-text hover:text-primary hover:border-primary p-2.5 rounded-full transition-colors hidden sm:block z-10"
            aria-label="Next testimonial"
          >
            <svg
              className="w-5 h-5"
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
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition-all cursor-pointer ${
                index === current
                  ? "bg-primary w-6"
                  : "bg-gray-medium w-2 hover:bg-gray-medium/70"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
