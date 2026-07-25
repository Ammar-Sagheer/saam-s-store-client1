export default function HomeLoading() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero skeleton */}
      <div className="w-full h-125 md:h-150 bg-gray-light animate-pulse" />

      {/* Features skeleton */}
      <div className="bg-dark py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-dark-light rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Category grid skeleton */}
      <div className="py-16 bg-gray-light">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-8 w-48 bg-gray-medium rounded animate-pulse mx-auto mb-10" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col rounded-lg overflow-hidden">
                <div className="w-full h-40 md:h-48 bg-gray-medium animate-pulse" />
                <div className="py-3 px-4">
                  <div className="h-4 bg-gray-medium rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
