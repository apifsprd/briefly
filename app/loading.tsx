export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading stories"
      className="space-y-6 animate-pulse motion-reduce:animate-none"
    >
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-4 h-3 w-32 rounded-full bg-slate-200" />
        <div className="mb-4 h-12 w-3/4 rounded-full bg-slate-200" />
        <div className="h-64 w-full rounded-2xl bg-slate-100" />
      </div>

      <div className="space-y-4">
        {[0, 1, 2, 3].map((row) => (
          <div
            key={row}
            className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5"
          >
            <div className="mb-3 h-3 w-28 rounded-full bg-slate-200" />
            <div className="mb-3 h-7 w-3/4 rounded-full bg-slate-200" />
            <div className="h-4 w-full rounded-full bg-slate-100" />
            <div className="mt-2 h-4 w-2/3 rounded-full bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
