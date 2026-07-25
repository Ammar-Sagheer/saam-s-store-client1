import { getProductById, getCategories } from "@/app/_lib/data-service";
import ProductForm from "@/app/_components/admin/ProductForm";

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-heading">Edit Product</h1>
      <ProductForm categories={categories} product={product} />
    </div>
  );
}
