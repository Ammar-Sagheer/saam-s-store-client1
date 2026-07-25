export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-64 bg-gray-light rounded animate-pulse mb-8" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image skeleton */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <div className="w-16 h-16 bg-gray-light animate-pulse" />
              <div className="w-16 h-16 bg-gray-light animate-pulse" />
            </div>
            <div className="flex-1 h-80 md:h-125 bg-gray-light animate-pulse" />
          </div>

          {/* Info skeleton */}
          <div className="flex flex-col gap-6">
            <div className="h-8 bg-gray-light rounded animate-pulse w-3/4" />
            <div className="h-6 bg-gray-light rounded animate-pulse w-1/4" />
            <div className="h-24 bg-gray-light rounded animate-pulse" />
            <div className="h-12 bg-gray-light rounded animate-pulse w-48" />
          </div>
        </div>
      </div>
    </div>
  );
}
