export default function ShopLoading() {
  return (
    <div className="bg-white min-h-screen">
      <div className="bg-dark-light py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-24 bg-dark rounded animate-pulse" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
            <div className="bg-gray-light rounded-lg p-4 h-32 animate-pulse" />
            <div className="bg-gray-light rounded-lg p-4 h-64 animate-pulse" />
            <div className="bg-gray-light rounded-lg p-4 h-32 animate-pulse" />
          </div>
          {/* Products skeleton */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex flex-col gap-3">
                <div className="w-full h-44 sm:h-52 md:h-64 bg-gray-light  animate-pulse" />
                <div className="h-4 bg-gray-light rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-light rounded animate-pulse w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
