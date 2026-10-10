"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import type { Story } from "@/lib/stories";

interface CategoryGroup {
  id: string;
  name: string;
  stories: Story[];
}

interface CategoryTabsSectionProps {
  categories: CategoryGroup[];
  allStories: Story[];
  categoryColorMap: Record<
    string,
    { badge: string; dot: string; text: string }
  >;
}

export function CategoryTabsSection({
  categories,
  allStories,
  categoryColorMap,
}: CategoryTabsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("all");

  const tabOptions = [
    { id: "all", name: "Semua Liputan" },
    ...categories.map((c) => ({ id: c.id, name: c.name })),
  ];

  const currentCategory = categories.find((c) => c.id === activeTab);

  const displayedStories: Story[] =
    activeTab === "all"
      ? allStories.slice(0, 6)
      : currentCategory
        ? currentCategory.stories.slice(0, 6)
        : [];

  const relativeTime = (value: string) => {
    const timestamp = Date.parse(value);
    if (!Number.isFinite(timestamp)) return "waktu tidak tersedia";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(timestamp);
  };

  return (
    <section className="space-y-6 pt-4" data-purpose="category-tabs-section">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-editorial-borderLight pb-3">
        <div className="flex items-center space-x-2.5">
          <Layers
            size={18}
            className="text-editorial-accent"
            aria-hidden="true"
          />
          <h2 className="font-serif text-2xl font-bold text-editorial-charcoal tracking-tight">
            Liputan per Edisi &amp; Topik
          </h2>
        </div>
        {activeTab !== "all" && (
          <Link
            href={`/${activeTab}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-editorial-accent hover:underline uppercase tracking-wider"
          >
            <span>Lihat Edisi {currentCategory?.name} Lengkap</span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        )}
      </div>

      {/* Interactive Tabs Slider Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
        {tabOptions.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                isActive
                  ? "bg-editorial-charcoal text-white font-semibold shadow-sm"
                  : "bg-white text-editorial-body hover:bg-neutral-100 hover:text-editorial-charcoal border border-editorial-border/60"
              }`}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Grid of Cards for the selected Tab */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {displayedStories.map((story) => {
          const leadItem = story.articles[0];
          const dotColor =
            categoryColorMap[story.category]?.dot || "bg-editorial-charcoal";

          return (
            <article
              key={story.id}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-editorial-border hover:border-editorial-charcoal/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {/* Source and Verification in Top Left */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                    <span className="text-xs font-bold uppercase tracking-wider text-editorial-charcoal">
                      {leadItem?.sourceName || "Media Asal"}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-editorial-muted">
                    {relativeTime(story.lastUpdatedAt)}
                  </span>
                </div>

                {/* Headline */}
                <Link href={`/story/${story.slug}`}>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-editorial-charcoal mb-2.5 leading-snug group-hover:text-editorial-accent transition-colors">
                    {story.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p className="text-xs sm:text-sm text-stone-700 line-clamp-3 leading-relaxed">
                  {leadItem?.description ||
                    "Rangkuman liputan komprehensif dari beberapa publikasi terpercaya."}
                </p>
              </div>

              {/* Card Footer with Verified Source Count */}
              <div className="mt-4 pt-3.5 border-t border-editorial-borderLight flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {story.sourceCount}{" "}
                  {story.sourceCount === 1 ? "Sumber" : "Sumber Dirangkum"}
                </span>
                <Link
                  href={`/story/${story.slug}`}
                  className="font-semibold text-editorial-charcoal group-hover:text-editorial-accent inline-flex items-center gap-1 transition"
                >
                  <span>Baca</span>
                  <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {activeTab !== "all" && (
        <div className="text-center pt-2">
          <Link
            href={`/${activeTab}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-editorial-border bg-white text-xs font-bold text-editorial-charcoal hover:bg-neutral-900 hover:text-white transition shadow-sm"
          >
            <span>
              Jelajahi Arsip &amp; Liputan Penuh {currentCategory?.name}
            </span>
            <ArrowRight size={13} aria-hidden="true" />
          </Link>
        </div>
      )}
    </section>
  );
}
