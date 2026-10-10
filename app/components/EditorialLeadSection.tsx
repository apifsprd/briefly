"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";
import type { Story } from "@/lib/stories";
import { LeadStoryActions } from "@/app/components/LeadStoryActions";

function relativeTime(value: string): string {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return "baru saja";
  const diffMinutes = Math.max(
    1,
    Math.round((Date.now() - timestamp) / 60_000),
  );
  if (diffMinutes < 60) return `${diffMinutes}m lalu`;
  if (diffMinutes < 24 * 60) return `${Math.floor(diffMinutes / 60)}j lalu`;
  return `${Math.floor(diffMinutes / (24 * 60))}h lalu`;
}

interface EditorialLeadSectionProps {
  featuredStory: Story;
  sidebarStories: Story[];
  categoryColorMap: Record<
    string,
    { badge: string; dot: string; text: string }
  >;
  categoryLabelMap: Record<string, string>;
  momentumTopics: Array<{ name: string; velocity: number }>;
}

export function EditorialLeadSection({
  featuredStory,
  sidebarStories,
  categoryColorMap,
  categoryLabelMap,
  momentumTopics,
}: EditorialLeadSectionProps) {
  const [isFocusActive, setIsFocusActive] = useState(false);
  const leadArticle = featuredStory.articles[0];

  const synthesisBullets = (() => {
    const fromDesc = [
      ...new Set(
        featuredStory.articles
          .map((a) => a.description)
          .filter(Boolean)
          .flatMap((desc) => desc.split(/(?<=[.?!])\s+/))
          .filter((sent) => sent.length > 25 && sent.length < 240),
      ),
    ].slice(0, 3);

    if (fromDesc.length >= 2) return fromDesc;

    return featuredStory.articles
      .slice(0, 3)
      .map((a) => `${a.sourceName}: ${a.title}`);
  })();

  const badgeStyle =
    categoryColorMap[featuredStory.category]?.badge ||
    "bg-neutral-100 text-neutral-800";
  const categoryLabel =
    categoryLabelMap[featuredStory.category] || featuredStory.category;

  return (
    <div className="space-y-4">
      {/* Utility Bar with Focus Mode Toggle */}
      <div className="flex items-center justify-between border-b border-editorial-borderLight pb-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-editorial-charcoal">
            Liputan Utama Terverifikasi Multi-Sumber
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsFocusActive(!isFocusActive)}
          className={`inline-flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
            isFocusActive
              ? "bg-editorial-charcoal text-white border-editorial-charcoal"
              : "text-editorial-body hover:bg-neutral-100 border-editorial-border/80"
          }`}
          title="Fokus Membaca Tanpa Distraksi"
        >
          <BookOpen
            size={13}
            className={isFocusActive ? "text-white" : "text-editorial-muted"}
            aria-hidden="true"
          />
          <span>{isFocusActive ? "Keluar Fokus" : "Mode Fokus"}</span>
        </button>
      </div>

      <section
        className={`grid grid-cols-1 items-start gap-8 transition-all ${
          isFocusActive ? "max-w-3xl mx-auto" : "lg:grid-cols-12 lg:gap-10"
        }`}
        data-purpose="hero-lead-section"
      >
        {/* Primary Editorial Lead Story (Main Hero) */}
        <article
          className={`bg-white p-6 sm:p-8 md:p-10 rounded-2xl border border-editorial-border/80 shadow-[0_2px_12px_rgba(20,20,19,0.03)] hover:shadow-md transition-all ${
            isFocusActive ? "w-full" : "lg:col-span-8"
          }`}
          data-purpose="lead-featured-story"
        >
          {/* Top Source Identification & Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5 pb-4 border-b border-editorial-borderLight">
            <div className="flex flex-wrap items-center gap-2">
              {/* Prominent Publisher Identity in Top Left */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-editorial-charcoal text-white shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {leadArticle.sourceName}
              </span>

              {/* Multi-Source Indicator Badge */}
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-800">
                {featuredStory.sourceCount}{" "}
                {featuredStory.sourceCount === 1
                  ? "Sumber Terverifikasi"
                  : "Konsensus Multi-Sumber"}
              </span>

              {/* Category Pill */}
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase ${badgeStyle}`}
              >
                {categoryLabel}
              </span>

              <span className="text-xs text-stone-500 font-medium">
                &bull; Diperbarui {relativeTime(featuredStory.lastUpdatedAt)}
              </span>
            </div>

            {/* Micro interaction tools */}
            <LeadStoryActions story={featuredStory} />
          </div>

          {/* Visual Anchor / Image or Editorial Fallback */}
          {leadArticle.image ? (
            <div className="relative mb-6 h-60 sm:h-80 w-full overflow-hidden rounded-xl border border-editorial-borderLight bg-editorial-surfaceMuted">
              <Image
                src={leadArticle.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 780px"
                className="object-cover"
              />
            </div>
          ) : (
            <div className="relative mb-6 h-36 sm:h-44 w-full overflow-hidden rounded-xl border border-editorial-borderLight bg-gradient-to-br from-[#faf8f2] via-[#f4f1e8] to-[#ece7d8] p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-stone-500 font-mono uppercase tracking-widest">
                <span>Rangkuman Editorial &bull; {categoryLabel}</span>
                <span className="font-sans font-bold text-emerald-800 bg-white/80 px-2 py-0.5 rounded">
                  {featuredStory.sourceCount} Media Terlibat
                </span>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-xl sm:text-2xl font-bold text-editorial-charcoal line-clamp-1">
                  {featuredStory.title}
                </p>
                <p className="text-xs text-stone-600">
                  Sintesis otomatis dari kabar aktual beberapa publikasi terpercaya.
                </p>
              </div>
            </div>
          )}

          {/* Headline - Larger 32px-44px bold font */}
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-bold leading-[1.18] text-editorial-charcoal mb-4 tracking-tight hover:text-neutral-800">
            <Link
              href={`/story/${featuredStory.slug}`}
              className="transition-colors"
            >
              {featuredStory.title}
            </Link>
          </h1>

          {/* Editorial Excerpt with Strong Contrast */}
          {leadArticle.description && (
            <p className="text-base sm:text-lg text-stone-800 leading-relaxed mb-6 font-normal">
              {leadArticle.description}
            </p>
          )}

          {/* Key Editorial Takeaways Callout Box */}
          {synthesisBullets.length > 0 && (
            <div className="bg-[#f6f5f0] border-l-4 border-editorial-charcoal p-5 rounded-r-xl mb-6 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-editorial-accent" />
                <h4 className="text-xs uppercase tracking-wider font-bold text-editorial-charcoal">
                  Poin Intisari Redaksi (Key Takeaways)
                </h4>
              </div>
              <ul className="text-xs sm:text-[13px] text-stone-800 space-y-2 leading-relaxed">
                {synthesisBullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2
                      size={14}
                      className="text-emerald-700 shrink-0 mt-0.5"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Read & Sources Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-editorial-border">
            <div className="flex items-center space-x-2 text-xs text-stone-600 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {featuredStory.sourceCount} laporan dari{" "}
                {featuredStory.articles
                  .slice(0, 3)
                  .map((a) => a.sourceName)
                  .join(", ")}
              </span>
            </div>
            <Link
              href={`/story/${featuredStory.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-editorial-charcoal hover:text-editorial-accent transition"
            >
              <span>Pelajari Rangkuman Lengkap</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </article>

        {/* Sidebar: The Day in Context (Compact List View) */}
        {!isFocusActive && (
          <aside
            className="lg:col-span-4 space-y-6"
            data-purpose="contextual-sidebar"
            id="quick-digest"
          >
            {/* The News in Context */}
            <div className="bg-white p-6 rounded-2xl border border-editorial-border/80 shadow-[0_2px_10px_rgba(20,20,19,0.02)]">
              <div className="flex items-center justify-between pb-3 mb-4 hairline-b">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-editorial-charcoal">
                    Konteks Hari Ini
                  </h2>
                  <span className="text-[11px] text-editorial-muted">
                    Ringkasan cepat dalam 3 menit
                  </span>
                </div>
                <Link
                  href="/trending"
                  className="text-xs font-semibold text-editorial-accent hover:underline"
                >
                  Trending &rarr;
                </Link>
              </div>

              {/* Compact List Items */}
              <div className="divide-y divide-editorial-borderLight">
                {sidebarStories.slice(0, 4).map((story, index) => (
                  <div key={story.id} className="py-3.5 first:pt-0 last:pb-0 group">
                    <div className="flex items-center justify-between text-[11px] mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[11px] font-bold text-stone-400">
                          #{index + 1}
                        </span>
                        <span className="font-bold text-editorial-charcoal uppercase">
                          {story.articles[0]?.sourceName || "Publisher"}
                        </span>
                      </div>
                      <span className="text-editorial-muted font-medium">
                        {relativeTime(story.lastUpdatedAt)}
                      </span>
                    </div>
                    <Link href={`/story/${story.slug}`}>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-editorial-charcoal group-hover:text-editorial-accent transition-colors leading-snug">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                      {story.articles[0]?.description ||
                        "Kabar sedang berkembang di berbagai media terkemuka."}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Momentum Radar Widget */}
            <div
              className="bg-editorial-surfaceMuted p-5 rounded-2xl border border-editorial-border/80"
              data-purpose="momentum-widget"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-editorial-charcoal flex items-center space-x-1.5">
                  <TrendingUp
                    size={14}
                    className="text-editorial-accent"
                    aria-hidden="true"
                  />
                  <span>Radar Momentum Topik</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-editorial-muted">
                  Aktivitas 24 Jam
                </span>
              </div>
              <div className="space-y-3 pt-1 text-xs">
                {momentumTopics.map((topic, idx) => (
                  <div key={topic.name}>
                    <div className="flex justify-between text-editorial-charcoal mb-1">
                      <span className="font-medium">
                        <span className="font-mono text-stone-400 mr-1.5 font-bold">
                          #{idx + 1}
                        </span>
                        {topic.name}
                      </span>
                      <span className="font-mono font-semibold">
                        {topic.velocity}%
                      </span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-editorial-charcoal h-full rounded-full transition-all duration-500"
                        style={{ width: `${topic.velocity}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </section>
    </div>
  );
}
