"use client";

import { Bookmark, Check, SlidersHorizontal, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Story } from "@/lib/stories";

const bookmarksKey = "briefly-bookmarks";
const readStoriesKey = "briefly-read-stories";
const categoriesKey = "briefly-selected-categories";

interface StoryCollectionProps {
  stories: Story[];
  heading?: string;
  mode?: "feed" | "saved";
  showPreferences?: boolean;
  emptyMessage?: string;
}

const readStoredStories = (): Story[] => {
  try {
    const saved: unknown = JSON.parse(
      localStorage.getItem(bookmarksKey) || "[]",
    );
    return Array.isArray(saved) ? (saved as Story[]) : [];
  } catch {
    return [];
  }
};

const readStoredIds = (key: string): string[] => {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(stored)
      ? stored.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
};

function relativeDate(value: string): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Update time unavailable";
  const formatted = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(timestamp);
  return `Updated ${formatted} UTC`;
}

export function StoryCollection({
  stories,
  heading,
  mode = "feed",
  showPreferences = false,
  emptyMessage = "No stories are available right now.",
}: StoryCollectionProps) {
  const [bookmarks, setBookmarks] = useState<Story[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[] | null>(
    null,
  );
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setBookmarks(readStoredStories());
    setReadIds(readStoredIds(readStoriesKey));
    try {
      const stored = JSON.parse(localStorage.getItem(categoriesKey) || "null");
      if (Array.isArray(stored)) {
        setSelectedCategories(
          stored.filter((value): value is string => typeof value === "string"),
        );
      }
    } catch {
      setSelectedCategories(null);
    }
    setReady(true);
  }, []);

  const categoryOptions = [...new Set(stories.map((story) => story.category))];
  const visibleStories =
    mode === "saved"
      ? bookmarks.map(
          (saved) => stories.find((story) => story.id === saved.id) || saved,
        )
      : stories.filter(
          (story) =>
            !selectedCategories || selectedCategories.includes(story.category),
        );

  const toggleBookmark = (story: Story) => {
    const next = bookmarks.some((saved) => saved.id === story.id)
      ? bookmarks.filter((saved) => saved.id !== story.id)
      : [story, ...bookmarks];
    setBookmarks(next);
    localStorage.setItem(bookmarksKey, JSON.stringify(next));
  };

  const toggleRead = (storyId: string) => {
    const next = readIds.includes(storyId)
      ? readIds.filter((id) => id !== storyId)
      : [...readIds, storyId];
    setReadIds(next);
    localStorage.setItem(readStoriesKey, JSON.stringify(next));
  };

  const toggleCategory = (category: string) => {
    const current = selectedCategories || categoryOptions;
    const next = current.includes(category)
      ? current.filter((item) => item !== category)
      : [...current, category];
    setSelectedCategories(next);
    localStorage.setItem(categoriesKey, JSON.stringify(next));
  };

  return (
    <section className="w-full" aria-label={heading || "Stories"}>
      {(heading || showPreferences) && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-300 pb-3">
          {heading && <h2 className="text-xl font-semibold">{heading}</h2>}
          {showPreferences && categoryOptions.length > 0 && (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-sm px-2 py-1 text-sm text-gray-600 hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700">
                <SlidersHorizontal size={16} aria-hidden="true" />
                Editions
              </summary>
              <fieldset className="absolute right-0 z-20 mt-2 grid min-w-48 gap-2 border border-gray-200 bg-white p-4 shadow-lg">
                <legend className="text-sm font-semibold">Your editions</legend>
                {categoryOptions.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={(selectedCategories || categoryOptions).includes(
                        category,
                      )}
                      onChange={() => toggleCategory(category)}
                      className="accent-blue-700"
                    />
                    <span className="capitalize">{category}</span>
                  </label>
                ))}
              </fieldset>
            </details>
          )}
        </div>
      )}

      {mode === "saved" && !ready ? (
        <p className="border-y border-gray-200 py-8 text-sm text-gray-500">
          Loading saved stories…
        </p>
      ) : visibleStories.length === 0 ? (
        <p className="border-y border-gray-200 py-8 text-sm text-gray-500">
          {mode === "saved" && ready
            ? "Stories you save will appear here."
            : emptyMessage}
        </p>
      ) : (
        <div>
          {visibleStories.map((story, index) => {
            const isBookmarked = bookmarks.some(
              (saved) => saved.id === story.id,
            );
            const isRead = readIds.includes(story.id);
            const leadArticle = story.articles[0];
            const isDeveloping = story.momentum;

            return (
              <article
                key={story.id}
                className={`grid grid-cols-1 gap-4 border-b border-gray-200 py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start ${isRead ? "opacity-65" : ""}`}
              >
                <div className="flex min-w-0 gap-4">
                  {index === 0 && leadArticle.image && (
                    <Link
                      href={`/story/${story.slug}`}
                      aria-label={`Open story: ${story.title}`}
                      className="relative hidden h-24 w-32 shrink-0 overflow-hidden bg-gray-100 sm:block"
                    >
                      <Image
                        src={leadArticle.image}
                        alt=""
                        fill
                        sizes="128px"
                        className="object-cover"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </Link>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-wide text-gray-500">
                      <Link
                        href={`/${story.category}`}
                        className="text-blue-800 hover:underline"
                      >
                        {story.category}
                      </Link>
                      <span>{story.sourceCount} sources</span>
                      <span>{relativeDate(story.lastUpdatedAt)}</span>
                      {isDeveloping && (
                        <span className="inline-flex items-center gap-1 text-emerald-800">
                          <TrendingUp size={13} aria-hidden="true" />
                          Developing
                        </span>
                      )}
                    </div>
                    <Link href={`/story/${story.slug}`} className="group">
                      <h3 className="text-lg font-semibold leading-snug text-gray-950 group-hover:text-blue-800 sm:text-xl">
                        {story.title}
                      </h3>
                    </Link>
                    {leadArticle.description && (
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                        {leadArticle.description}
                      </p>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500">
                      {story.articles
                        .slice(0, 4)
                        .map((article, sourceIndex) => (
                          <span key={article.id}>
                            {sourceIndex > 0 && (
                              <span aria-hidden="true"> · </span>
                            )}
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-blue-800 hover:underline"
                            >
                              {article.sourceName}
                            </a>
                          </span>
                        ))}
                      {story.sourceCount > 4 && (
                        <span>+{story.sourceCount - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => toggleBookmark(story)}
                    aria-label={
                      isBookmarked ? "Remove saved story" : "Save story"
                    }
                    title={isBookmarked ? "Remove saved story" : "Save story"}
                    className="rounded-sm p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700"
                  >
                    <Bookmark
                      size={18}
                      aria-hidden="true"
                      fill={isBookmarked ? "currentColor" : "none"}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleRead(story.id)}
                    aria-label={isRead ? "Mark as unread" : "Mark as read"}
                    title={isRead ? "Mark as unread" : "Mark as read"}
                    className="rounded-sm p-2 text-gray-600 hover:bg-gray-100 hover:text-blue-800 focus-visible:outline-2 focus-visible:outline-blue-700"
                  >
                    <Check size={18} aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
