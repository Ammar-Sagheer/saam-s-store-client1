import Link from "next/link";
import Image from "next/image";
import { PlusIcon, PencilIcon } from "@heroicons/react/24/outline";
import { getCategoriesWithCount } from "@/app/_lib/data-service";
import DeleteCategoryButton from "@/app/_components/admin/DeleteCategoryButton";

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCount();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-heading">Categories</h1>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-medium bg-gray-light">
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Image
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Name
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Slug
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Products
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-text-light">
                    No categories found.{" "}
                    <Link
                      href="/admin/categories/new"
                      className="text-primary hover:underline"
                    >
                      Add your first category
                    </Link>
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 bg-gray-light shrink-0 rounded overflow-hidden">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-light text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-text font-medium">
                      {category.name}
                    </td>
                    <td className="py-3 px-4 text-text-light">
                      {category.slug}
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-medium text-text px-2 py-1 rounded-full text-xs font-medium">
                        {category.products[0]?.count || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/categories/${category.id}`}
                          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <DeleteCategoryButton
                          categoryId={category.id}
                          productCount={category.products[0]?.count || 0}
                        />
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
