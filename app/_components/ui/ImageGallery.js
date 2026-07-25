"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageGallery({ images, productName }) {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 md:h-125 bg-gray-light flex items-center justify-center">
        <span className="text-text-light text-sm">No Images</span>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Thumbnails */}
      <div className="flex flex-col gap-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(img)}
            className={`relative w-16 h-16 border-2 cursor-pointer overflow-hidden shrink-0 ${
              activeImage === img
                ? "border-primary"
                : "border-gray-medium hover:border-primary"
            }`}
          >
            <Image
              src={img}
              alt={`${productName} ${index + 1}`}
              fill
              className="object-contain"
              sizes="64px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative flex-1 h-80 md:h-125 bg-gray-light">
        <Image
          src={activeImage}
          alt={productName}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );
}
