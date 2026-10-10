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
  if (typeof window === "undefined") return [];
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
  if (typeof window === "undefined") return [];
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
      if (typeof window === "undefined") return null;
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
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-editorial-borderLight pb-4">
          {heading && (
            <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">
              {heading}
            </h2>
          )}
          {showPreferences && categoryOptions.length > 0 && (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full border border-editorial-border bg-white px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-editorial-body hover:border-editorial-charcoal hover:text-editorial-charcoal">
                <SlidersHorizontal size={14} aria-hidden="true" />
                Editions
              </summary>
              <fieldset className="absolute right-0 z-20 mt-2 min-w-52 rounded-xl border border-editorial-border bg-white p-4 text-left shadow-xl">
                <legend className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-editorial-muted">
                  Your editions
                </legend>
                <div className="grid gap-2">
                  {categoryOptions.map((category) => (
                    <label
                      key={category}
                      className="flex cursor-pointer items-center justify-between gap-3 rounded-lg bg-editorial-surfaceMuted px-3 py-2 text-sm text-editorial-body"
                    >
                      <span className="capitalize">{category}</span>
                      <input
                        type="checkbox"
                        checked={(
                          selectedCategories || categoryOptions
                        ).includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 accent-editorial-charcoal"
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
        <div className="rounded-xl border border-dashed border-editorial-border bg-white/70 p-8 text-center">
          <p className="text-base font-medium text-editorial-body">
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
                className={`rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] transition-all duration-200 hover:-translate-y-0.5 hover:border-editorial-charcoal/40 hover:shadow-md sm:p-6 ${
                  isRead ? "opacity-75" : ""
                }`}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {leadArticle.image && (
                    <Link
                      href={`/story/${story.slug}`}
                      className="relative block h-32 w-full overflow-hidden rounded-lg bg-editorial-surfaceMuted sm:h-32 sm:w-40"
                      aria-label={`Open story: ${story.title}`}
                    >
                      <Image
                        src={leadArticle.image}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover transition-transform duration-300 hover:scale-[1.03]"
                        onError={(event) => {
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    </Link>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-editorial-muted">
                      <Link
                        href={`/${story.category}`}
                        className="text-editorial-accent hover:text-editorial-charcoal"
                      >
                        {story.category}
                      </Link>
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] text-emerald-800">
                        {story.sourceCount}{" "}
                        {story.sourceCount === 1
                          ? "source"
                          : "sources summarized"}
                      </span>
                      <span>{relativeTime(story.lastUpdatedAt)}</span>
                      {story.momentum && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800">
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
                        <h3 className="font-serif text-xl font-bold leading-tight text-editorial-charcoal group-hover:text-editorial-accent sm:text-2xl">
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
                          className="rounded-full border border-editorial-border p-2 text-editorial-muted hover:border-editorial-charcoal hover:text-editorial-charcoal"
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
                          className="rounded-full border border-editorial-border p-2 text-editorial-muted hover:border-editorial-charcoal hover:text-editorial-charcoal"
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
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-editorial-body sm:text-base">
                        {leadArticle.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-editorial-borderLight pt-3 text-xs text-editorial-muted">
                      {sourceLabels.map((label, index) => (
                        <span
                          key={`${story.id}-${label}-${index}`}
                          className="inline-flex items-center gap-2 font-semibold text-editorial-charcoal"
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
