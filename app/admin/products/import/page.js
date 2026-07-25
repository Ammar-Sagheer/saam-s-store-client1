import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import ProductImportForm from "@/app/_components/admin/ProductImportForm";

export default function ImportProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/products"
          className="p-2 text-text-light hover:text-primary hover:bg-gray-light rounded-lg transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-heading">
          Bulk Import Products
        </h1>
      </div>
      <ProductImportForm />
    </div>
  );
}
