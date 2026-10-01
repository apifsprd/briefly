export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading stories"
      className="animate-pulse motion-reduce:animate-none"
    >
      <span className="sr-only">Loading stories</span>
      <div className="mb-8 h-32 border-b border-gray-200" />
      <div className="mb-5 h-7 w-48 bg-gray-200" />
      <div className="space-y-5">
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="border-b border-gray-200 py-5">
            <div className="mb-3 h-3 w-40 bg-gray-200" />
            <div className="mb-2 h-6 w-3/4 bg-gray-200" />
            <div className="h-4 w-full max-w-2xl bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
