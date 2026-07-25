export default function CategoriesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-gray-medium rounded animate-pulse" />
        <div className="h-9 w-32 bg-gray-medium rounded animate-pulse" />
      </div>
      <div className="bg-surface border border-border rounded-lg shadow-sm p-6 flex flex-col gap-4">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-14 bg-gray-light rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
