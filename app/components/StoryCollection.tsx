"use client";

import { Bookmark, Check, SlidersHorizontal, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

function relativeTime(value: string): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "Updated recently";

  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - timestamp) / 60_000),
  );
  if (diffMinutes < 60) return `${diffMinutes} min ago`;
  if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)} hr ago`;
  return `${Math.floor(diffMinutes / (24 * 60))} day ago`;
}

export function StoryCollection({
  stories,
  heading,
  mode = "feed",
  showPreferences = false,
  emptyMessage = "No stories are available right now.",
}: StoryCollectionProps) {
  const [bookmarks, setBookmarks] = useState<Story[]>(() =>
    readStoredStories(),
  );
  const [readIds, setReadIds] = useState<string[]>(() =>
    readStoredIds(readStoriesKey),
  );
  const [selectedCategories, setSelectedCategories] = useState<string[] | null>(
    () => {
      try {
        const stored = JSON.parse(
          localStorage.getItem(categoriesKey) || "null",
        );
        return Array.isArray(stored)
          ? stored.filter((value): value is string => typeof value === "string")
          : null;
      } catch {
        return null;
      }
    },
  );

  const categoryOptions = [...new Set(stories.map((story) => story.category))];
  const visibleStories =
    mode === "saved"
      ? bookmarks
          .map(
            (saved) => stories.find((story) => story.id === saved.id) || saved,
          )
          .filter((story) => story)
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
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
          {heading && (
            <h2 className="text-2xl font-semibold text-slate-900">{heading}</h2>
          )}
          {showPreferences && categoryOptions.length > 0 && (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 hover:border-slate-300 hover:text-slate-900">
                <SlidersHorizontal size={14} aria-hidden="true" />
                Editions
              </summary>
              <fieldset className="absolute right-0 z-20 mt-2 min-w-52 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xl">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Your editions
                </legend>
                <div className="grid gap-2">
                  {categoryOptions.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <span className="capitalize">{category}</span>
                      <input
                        type="checkbox"
                        checked={(
                          selectedCategories || categoryOptions
                        ).includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 accent-slate-900"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            </details>
          )}
        </div>
      )}

      {visibleStories.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
          <p className="text-base font-medium text-slate-700">
            {mode === "saved"
              ? "Stories you save will appear here."
              : emptyMessage}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visibleStories.map((story) => {
            const isBookmarked = bookmarks.some(
              (saved) => saved.id === story.id,
            );
            const isRead = readIds.includes(story.id);
            const leadArticle = story.articles[0];
            const sourceLabels = story.articles
              .slice(0, 4)
              .map((article) => article.sourceName);

            return (
              <article
                key={story.id}
                className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] transition-colors hover:border-slate-300 sm:p-5 ${
                  isRead ? "opacity-75" : ""
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {leadArticle.image && (
                    <Link
                      href={`/story/${story.slug}`}
                      className="relative block h-32 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-40"
                      aria-label={`Open story: ${story.title}`}
                    >
                      <Image
                        src={leadArticle.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </Link>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      <Link
                        href={`/${story.category}`}
                        className="text-slate-700 hover:text-slate-900"
                      >
                        {story.category}
                      </Link>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[9px]">
                        {story.sourceCount} sources
                      </span>
                      <span>{relativeTime(story.lastUpdatedAt)}</span>
                      {story.momentum && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-700">
                          <TrendingUp size={11} aria-hidden="true" />
                          Developing
                        </span>
                      )}
                    </div>

                    <div className="flex items-start justify-between gap-3">
                      <Link
                        href={`/story/${story.slug}`}
                        className="group flex-1"
                      >
                        <h3 className="text-xl font-semibold leading-tight text-slate-900 group-hover:text-slate-700 sm:text-2xl">
                          {story.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => toggleRead(story.id)}
                          aria-label={
                            isRead ? "Mark as unread" : "Mark as read"
                          }
                          className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          title={isRead ? "Mark as unread" : "Mark as read"}
                        >
                          <Check
                            size={14}
                            aria-hidden="true"
                            className={isRead ? "text-emerald-600" : ""}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(story)}
                          aria-label={
                            isBookmarked ? "Remove saved story" : "Save story"
                          }
                          className="rounded-full border border-slate-200 p-2 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                          title={
                            isBookmarked ? "Remove saved story" : "Save story"
                          }
                        >
                          <Bookmark
                            size={14}
                            aria-hidden="true"
                            fill={isBookmarked ? "currentColor" : "none"}
                          />
                        </button>
                      </div>
                    </div>

                    {leadArticle.description && (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {leadArticle.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {sourceLabels.map((label, index) => (
                        <span
                          key={`${story.id}-${label}-${index}`}
                          className="inline-flex items-center gap-2"
                        >
                          {index > 0 && <span aria-hidden="true">•</span>}
                          <span>{label}</span>
                        </span>
                      ))}
                      {story.sourceCount > sourceLabels.length && (
                        <span>
                          +{story.sourceCount - sourceLabels.length} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
