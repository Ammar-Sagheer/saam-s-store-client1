import Link from "next/link";
import Image from "next/image";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getHeroSlides } from "@/app/_lib/data-service";
import DeleteHeroSlideButton from "@/app/_components/admin/DeleteHeroSlideButton";

export default async function AdminHeroPage() {
  const slides = await getHeroSlides();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Hero Banner</h1>
        <Link
          href="/admin/hero/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Slide
        </Link>
      </div>

      <p className="text-sm text-text-light">
        These slides appear in the homepage's rotating hero banner, in
        display-order. If a slide has no image, it falls back to a plain
        background color.
      </p>

      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-medium bg-gray-light">
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Image
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Title
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Order
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {slides.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-text-light">
                    No hero slides found.{" "}
                    <Link
                      href="/admin/hero/new"
                      className="text-primary hover:underline"
                    >
                      Add your first slide
                    </Link>
                  </td>
                </tr>
              ) : (
                slides.map((slide) => (
                  <tr
                    key={slide.id}
                    className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="relative w-16 h-10 bg-gray-light shrink-0 rounded overflow-hidden">
                        {slide.image_url ? (
                          <Image
                            src={slide.image_url}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-light text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text font-medium">
                      {slide.title}
                    </td>
                    <td className="py-3 px-4 text-text-light">
                      {slide.display_order}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/hero/${slide.id}`}
                          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <DeleteHeroSlideButton slideId={slide.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
