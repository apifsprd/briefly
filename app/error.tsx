"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl py-12" role="alert">
      <p className="eyebrow text-slate-500">Briefly</p>
      <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
        Unable to load this edition.
      </h1>
      <p className="mt-4 text-base text-slate-600">
        Some news sources may be temporarily unavailable. Your saved stories are
        still available in the browser, and you can retry this view anytime.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
      >
        Try again
      </button>
    </main>
  );
}
