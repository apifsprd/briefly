"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "lucide-react";
import { StoryCollection } from "@/app/components/StoryCollection";
import { searchStories, type Story } from "@/lib/stories";

export function SearchWorkspace({
  stories,
  initialQuery,
}: {
  stories: Story[];
  initialQuery: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const results = deferredQuery.trim()
    ? searchStories(stories, deferredQuery)
    : [];

  return (
    <>
      <form
        action="/search"
        role="search"
        className="mb-8 flex w-full max-w-2xl items-center gap-2 rounded-xl border border-editorial-border bg-white px-4 shadow-[0_2px_8px_rgba(20,20,19,0.02)] transition focus-within:border-editorial-charcoal"
      >
        <label htmlFor="story-search" className="sr-only">
          Search stories, sources, or topics
        </label>
        <Search
          size={17}
          className="shrink-0 text-editorial-muted"
          aria-hidden="true"
        />
        <input
          id="story-search"
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search headlines, publishers, and topics"
          className="min-w-0 flex-1 bg-transparent px-2 py-4 text-sm text-editorial-charcoal outline-none placeholder:text-editorial-muted"
        />
        <button
          type="submit"
          className="rounded-lg bg-editorial-charcoal px-4 py-2 text-sm font-semibold text-white transition hover:bg-editorial-accent"
        >
          Search
        </button>
      </form>
      {deferredQuery.trim() ? (
        <StoryCollection
          stories={results}
          heading={`${results.length} ${results.length === 1 ? "result" : "results"} for “${deferredQuery.trim()}”`}
          emptyMessage="No matching stories. Try a publisher, topic, or broader phrase."
        />
      ) : (
        <p className="border-y border-editorial-borderLight py-6 text-sm text-editorial-body">
          Search headlines, descriptions, publishers, and categories.
        </p>
      )}
    </>
  );
}
