import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/app/_lib/data-service";

export default async function CategoryGrid() {
  const categories = await getCategories();

  return (
    <section className="py-16 bg-gray-light">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <h2 className="text-3xl font-bold text-dark-light text-center mb-10">
          Shop by Category
        </h2>

        {/* Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              {/* Image */}
              <div className="relative w-full h-40 md:h-48">
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  priority={index < 4}
                />
              </div>

              {/* Category Name */}
              <div className="py-3 px-4">
                <p className="text-text font-medium text-center group-hover:text-primary transition-colors">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
