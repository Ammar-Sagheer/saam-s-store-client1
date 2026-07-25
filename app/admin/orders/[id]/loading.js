export default function OrderDetailLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-40 bg-gray-medium rounded animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface border border-border rounded-lg p-6 h-96 animate-pulse" />
        <div className="flex flex-col gap-6">
          <div className="bg-surface border border-border rounded-lg p-6 h-32 animate-pulse" />
          <div className="bg-surface border border-border rounded-lg p-6 h-40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
