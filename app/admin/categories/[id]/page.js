import { getCategoryById } from "@/app/_lib/data-service";
import CategoryForm from "@/app/_components/admin/CategoryForm";

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await getCategoryById(id);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-heading">Edit Category</h1>
      <CategoryForm category={category} />
    </div>
  );
}
