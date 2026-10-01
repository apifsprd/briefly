"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-2xl py-12" role="alert">
      <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-800">
        Briefly
      </p>
      <h1 className="text-3xl font-semibold">This edition could not load.</h1>
      <p className="mt-3 text-sm text-gray-600">
        The page hit an unexpected error. Your saved stories remain in this
        browser.
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-blue-700"
      >
        Try again
      </button>
    </main>
  );
}
