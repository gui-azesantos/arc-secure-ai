export const StrideSkeletonLoader = () => (
  <div className="animate-pulse space-y-6">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="p-5 bg-gray-800 rounded-lg border border-gray-700"
      >
        <div className="h-6 bg-teal-800 rounded w-3/4 mb-3"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-11/12"></div>
          <div className="h-4 bg-gray-700 rounded w-full"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonLoader = ({ lines = 3, className = "" }) => (
  <div className={`animate-pulse space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-700 rounded"></div>
    ))}
  </div>
);
