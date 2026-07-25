import CategoryForm from "@/app/_components/admin/CategoryForm";

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-heading">Add New Category</h1>
      <CategoryForm />
    </div>
  );
}
