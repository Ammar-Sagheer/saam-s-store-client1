export default function MessagesLoading() {
  return (
    <div className="flex flex-col gap-6">
      <div className="h-8 w-32 bg-gray-medium rounded animate-pulse" />
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-surface border border-border rounded-lg p-6 shadow-sm h-32 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
