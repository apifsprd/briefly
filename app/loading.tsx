export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading stories"
      className="space-y-6 animate-pulse motion-reduce:animate-none"
    >
      <div className="rounded-xl border border-editorial-border bg-white p-5 sm:p-6">
        <div className="mb-4 h-3 w-32 rounded-full bg-editorial-surfaceMuted" />
        <div className="mb-4 h-12 w-3/4 rounded-full bg-editorial-surfaceMuted" />
        <div className="h-64 w-full rounded-lg bg-editorial-surfaceMuted" />
      </div>

      <div className="space-y-4">
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="rounded-xl border border-editorial-border bg-white p-5 sm:p-6"
          >
            <div className="mb-3 h-3 w-28 rounded-full bg-editorial-surfaceMuted" />
            <div className="mb-3 h-7 w-3/4 rounded-full bg-editorial-surfaceMuted" />
            <div className="h-4 w-full rounded-full bg-editorial-surfaceMuted" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-editorial-surfaceMuted" />
          </div>
        ))}
      </div>
    </div>
  );
}
