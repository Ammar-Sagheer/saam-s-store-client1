import { getCategories } from "@/app/_lib/data-service";
import ProductForm from "@/app/_components/admin/ProductForm";

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-heading">Add New Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
