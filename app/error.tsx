"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl py-12" role="alert">
      <p className="eyebrow">Briefly</p>
      <h1 className="mt-3 font-serif text-3xl font-bold text-editorial-charcoal sm:text-4xl">
        Unable to load this edition.
      </h1>
      <p className="mt-4 text-base text-editorial-body">
        Some news sources may be temporarily unavailable. Your saved stories are
        still available in the browser, and you can retry this view anytime.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg border border-editorial-charcoal bg-editorial-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-editorial-accent"
      >
        Try again
      </button>
    </main>
  );
}
