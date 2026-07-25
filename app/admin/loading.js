export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      <div className="h-8 w-40 bg-gray-medium rounded animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-lg p-4 shadow-sm h-20 animate-pulse"
          />
        ))}
      </div>

      <div className="bg-surface border border-border rounded-lg p-6 shadow-sm h-72 animate-pulse" />

      <div className="bg-surface border border-border rounded-lg p-6 shadow-sm h-48 animate-pulse" />
    </div>
  );
}
