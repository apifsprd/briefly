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
        className="mb-7 flex w-full max-w-xl items-center border-b border-gray-300 focus-within:border-blue-800"
      >
        <label htmlFor="story-search" className="sr-only">
          Search stories, sources, or topics
        </label>
        <Search
          size={17}
          className="shrink-0 text-gray-500"
          aria-hidden="true"
        />
        <input
          id="story-search"
          type="search"
          name="q"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search headlines, publishers, and topics"
          className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-500"
        />
        <button
          type="submit"
          className="px-2 py-3 text-sm font-medium text-blue-800 hover:text-blue-950 focus-visible:outline-2 focus-visible:outline-blue-700"
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
        <p className="border-y border-gray-200 py-6 text-sm text-gray-600">
          Search headlines, descriptions, publishers, and categories.
        </p>
      )}
    </>
  );
}
