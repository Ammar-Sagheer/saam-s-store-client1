import Link from "next/link";
import Image from "next/image";
import {
  PlusIcon,
  PencilIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { getAllProductsAdmin } from "@/app/_lib/data-service";
import { formatPrice } from "@/app/_lib/helpers";
import DeleteProductButton from "@/app/_components/admin/DeleteProductButton";
import Pagination from "@/app/_components/admin/Pagination";

export default async function AdminProductsPage({ searchParams }) {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const { products, totalPages, currentPage, totalCount } =
    await getAllProductsAdmin(page);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-heading">Products</h1>
          <p className="text-text-light text-sm mt-1">
            {totalCount} total products
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products/import"
            className="flex items-center gap-2 bg-surface border border-gray-medium hover:border-primary text-text text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <ArrowUpTrayIcon className="w-4 h-4" />
            Bulk Import
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Product
          </Link>
        </div>
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
                  Category
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Sale
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Stock
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Featured
                </th>
                <th className="text-left py-3 px-4 text-text-light font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-text-light">
                    No products found.{" "}
                    <Link
                      href="/admin/products/new"
                      className="text-primary hover:underline"
                    >
                      Add your first product
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-gray-medium hover:bg-gray-light transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-12 bg-gray-light shrink-0">
                        {product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-light text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-text font-medium line-clamp-2 max-w-48">
                        {product.name}
                      </p>
                    </td>
                    <td className="py-3 px-4 text-text-light">
                      {product.categories?.name || "—"}
                    </td>
                    <td className="py-3 px-4 text-text">
                      {formatPrice(product.price)}
                    </td>
                    <td className="py-3 px-4 text-sale">
                      {product.sale_price
                        ? formatPrice(product.sale_price)
                        : "—"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-medium ${product.stock < 10 ? "text-sale" : "text-success"}`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-bold ${
                          product.is_featured
                            ? "bg-primary text-white"
                            : "bg-gray-medium text-text-light"
                        }`}
                      >
                        {product.is_featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Link>
                        <DeleteProductButton productId={product.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/admin/products"
      />
    </div>
  );
}
