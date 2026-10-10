import Link from "next/link";
import Image from "next/image";
import { Sparkles, TrendingUp, Compass, ArrowRight } from "lucide-react";
import { getStories, newsCategories } from "@/lib/story-feed";
import { EditorialLeadSection } from "@/app/components/EditorialLeadSection";
import { CategoryTabsSection } from "@/app/components/CategoryTabsSection";
import { NewsletterCallout } from "@/app/components/NewsletterCallout";

export const revalidate = 3600;

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

const categoryColorMap: Record<
  string,
  { badge: string; dot: string; text: string }
> = {
  football: {
    badge: "bg-orange-100 text-orange-800",
    dot: "bg-orange-600",
    text: "text-orange-700",
  },
  world: {
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-600",
    text: "text-blue-700",
  },
  market: {
    badge: "bg-emerald-100 text-emerald-800",
    dot: "bg-emerald-600",
    text: "text-emerald-700",
  },
  business: {
    badge: "bg-blue-100 text-blue-800",
    dot: "bg-blue-600",
    text: "text-blue-700",
  },
  tech: {
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-600",
    text: "text-amber-700",
  },
  ai: {
    badge: "bg-purple-100 text-purple-800",
    dot: "bg-purple-600",
    text: "text-purple-700",
  },
};

const categoryLabelMap: Record<string, string> = {
  ai: "Artificial Intelligence",
  business: "Business & Finance",
  football: "Football",
  market: "Markets",
  tech: "Technology",
  world: "World Affairs",
};

const quickFilterChips = [
  { label: "Trending Terkini", href: "/trending", icon: TrendingUp },
  { label: "Kecerdasan Buatan (AI)", href: "/ai", icon: Sparkles },
  { label: "Pasar Saham & Keuangan", href: "/market", icon: Compass },
  { label: "Teknologi Global", href: "/tech", icon: null },
  { label: "Dunia Internasional", href: "/world", icon: null },
  { label: "Sepakbola", href: "/football", icon: null },
];

export default async function Home() {
  const stories = await getStories();

  if (stories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-editorial-border bg-white p-12 text-center">
        <p className="font-serif text-2xl font-bold text-editorial-charcoal">
          Belum ada cerita yang tersedia saat ini.
        </p>
        <p className="mt-2 text-sm text-editorial-muted">
          Feed RSS sedang melakukan sinkronisasi berkala. Silakan muat ulang
          halaman.
        </p>
      </div>
    );
  }

  const featuredStory = stories[0];
  const sidebarStories = stories.slice(1, 5);
  const trendingStories = [...stories]
    .sort((left, right) => right.trendingScore - left.trendingScore)
    .slice(0, 4);

  // Split latest stories into 1 Large Feature Card + 4 Compact Cards
  const latestFeatureStory = stories[1] || stories[0];
  const latestCompactStories = stories.slice(2, 6);

  const momentumTopics = [
    { id: "world", name: "Dunia & Geopolitik" },
    { id: "market", name: "Pasar & Finansial" },
    { id: "tech", name: "Teknologi & AI" },
    { id: "football", name: "Sepakbola & Olahraga" },
  ].map((item) => {
    const count = stories.filter(
      (s) =>
        s.category === item.id || (item.id === "tech" && s.category === "ai"),
    ).length;
    const velocity = Math.min(100, Math.max(68, 68 + count * 5));
    return { name: item.name, velocity };
  });

  const channelCategories = newsCategories
    .map((category) => ({
      ...category,
      stories: stories.filter((story) => story.category === category.id),
    }))
    .filter((category) => category.stories.length > 0);

  return (
    <div className="space-y-16 lg:space-y-20">
      {/* Quick Filter Chips Bar */}
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 text-xs"
        aria-label="Quick Topic Filters"
      >
        <span className="text-[11px] font-bold uppercase tracking-wider text-editorial-muted whitespace-nowrap mr-1">
          Pintasan Topik:
        </span>
        {quickFilterChips.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-editorial-border/70 text-editorial-body hover:border-editorial-charcoal hover:text-editorial-charcoal hover:bg-neutral-50 transition shadow-2xs whitespace-nowrap font-medium"
          >
            {Icon && <Icon size={12} className="text-editorial-accent" />}
            <span>{label}</span>
          </Link>
        ))}
      </div>

      {/* Top Section: Lead Story + The Day in Context Sidebar */}
      <EditorialLeadSection
        featuredStory={featuredStory}
        sidebarStories={sidebarStories}
        categoryColorMap={categoryColorMap}
        categoryLabelMap={categoryLabelMap}
        momentumTopics={momentumTopics}
      />

      {/* BEGIN: Trending Stories Section */}
      <section
        className="space-y-6 pt-2"
        data-purpose="trending-now-section"
        id="trending"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-editorial-borderLight pb-3">
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="font-serif text-2xl font-bold tracking-tight text-editorial-charcoal">
              Trending Saat Ini
            </h2>
            <span className="text-xs text-editorial-muted hidden sm:inline">
              Diurutkan berdasarkan frekuensi liputan silang media dan kecepatan
              kabar
            </span>
          </div>
          <Link
            href="/trending"
            className="text-xs font-bold text-editorial-accent hover:underline uppercase tracking-wider transition"
          >
            Lihat Semua Trending &rarr;
          </Link>
        </div>

        {/* 4 Cards Grid with Strong Visual Rank and Source Branding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trendingStories.map((story, index) => {
            const formattedIndex = String(index + 1).padStart(2, "0");
            const leadItem = story.articles[0];

            return (
              <article
                key={story.id}
                className="bg-white p-5 sm:p-6 rounded-2xl border border-editorial-border/80 shadow-[0_2px_8px_rgba(20,20,19,0.02)] hover:border-editorial-charcoal/40 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
              >
                <div>
                  {/* Source identification in Top-Left */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="font-mono text-2xl font-bold text-editorial-accent">
                      {formattedIndex}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 bg-neutral-100 px-2 py-0.5 rounded">
                      {leadItem?.sourceName || "Publisher"}
                    </span>
                  </div>

                  <Link href={`/story/${story.slug}`}>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-editorial-charcoal leading-snug group-hover:text-editorial-accent transition-colors line-clamp-3">
                      {story.title}
                    </h3>
                  </Link>
                </div>

                <div className="mt-5 pt-3.5 border-t border-editorial-borderLight flex items-center justify-between text-[11px] text-editorial-muted">
                  <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {story.sourceCount} Sumber &bull;{" "}
                    {relativeTime(story.lastUpdatedAt)}
                  </span>
                  <span
                    className="text-neutral-400 group-hover:text-editorial-charcoal font-bold transition-colors"
                    aria-hidden="true"
                  >
                    &rarr;
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
      {/* END: Trending Stories Section */}

      {/* BEGIN: Latest Stories Stream (Mixed Layout: 1 Large + 4 Compact) */}
      <section
        className="space-y-6 pt-2"
        data-purpose="latest-stories-feed"
        id="latest"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-editorial-borderLight pb-3">
          <div className="flex items-center space-x-3">
            <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">
              Aliran Berita Terkini
            </h2>
            <span className="bg-editorial-charcoal text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Live Dispatch
            </span>
          </div>
          <span className="text-xs text-editorial-muted">
            Pembaruan otomatis berkala &bull; {stories.length} peristiwa aktif
          </span>
        </div>

        {/* Dynamic Mixed Layout: 1 Large Card (Left) + 4 Compact Cards Grid (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: 1 Large Feature Card */}
          <article className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-2xl border border-editorial-border/80 shadow-[0_2px_10px_rgba(20,20,19,0.03)] hover:border-editorial-charcoal/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
            <div>
              {/* Source in top left */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider bg-editorial-charcoal text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {latestFeatureStory.articles[0]?.sourceName || "Publisher"}
                </span>
                <span className="text-xs font-medium text-editorial-muted">
                  {relativeTime(latestFeatureStory.lastUpdatedAt)}
                </span>
              </div>

              {/* Optional Thumbnail */}
              {latestFeatureStory.articles[0]?.image && (
                <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl border border-editorial-borderLight bg-editorial-surfaceMuted">
                  <Image
                    src={latestFeatureStory.articles[0].image}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  />
                </div>
              )}

              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 block mb-1.5">
                {categoryLabelMap[latestFeatureStory.category] ||
                  latestFeatureStory.category}
              </span>

              <Link href={`/story/${latestFeatureStory.slug}`}>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-editorial-charcoal group-hover:text-editorial-accent transition-colors mb-3 leading-snug">
                  {latestFeatureStory.title}
                </h3>
              </Link>

              <p className="text-sm text-stone-700 line-clamp-4 leading-relaxed">
                {latestFeatureStory.articles[0]?.description ||
                  "Laporan menyeluruh sedang berkembang di berbagai kanal berita global."}
              </p>
            </div>

            <div className="pt-4 mt-6 border-t border-editorial-borderLight flex items-center justify-between text-xs">
              <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                {latestFeatureStory.sourceCount} Sumber Terverifikasi
              </span>
              <Link
                href={`/story/${latestFeatureStory.slug}`}
                className="font-bold text-editorial-charcoal group-hover:text-editorial-accent inline-flex items-center gap-1 transition"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </div>
          </article>

          {/* Right: 4 Compact Cards in 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {latestCompactStories.map((story) => {
              const leadItem = story.articles[0];
              const categoryColor =
                categoryColorMap[story.category]?.text ||
                "text-editorial-charcoal";

              return (
                <article
                  key={story.id}
                  className="bg-white p-5 rounded-2xl border border-editorial-border/80 shadow-[0_2px_8px_rgba(20,20,19,0.02)] hover:border-editorial-charcoal/40 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    {/* Source in top left */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="font-bold text-xs uppercase tracking-wider text-editorial-charcoal truncate">
                        {leadItem?.sourceName || "Media Asal"}
                      </span>
                      <span className="text-[11px] font-medium text-editorial-muted shrink-0">
                        {relativeTime(story.lastUpdatedAt)}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider block mb-1 ${categoryColor}`}
                    >
                      {categoryLabelMap[story.category] || story.category}
                    </span>

                    <Link href={`/story/${story.slug}`}>
                      <h4 className="font-serif text-base font-bold text-editorial-charcoal group-hover:text-editorial-accent transition-colors mb-2 leading-snug line-clamp-3">
                        {story.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {leadItem?.description ||
                        "Rangkuman liputan komprehensif dari media terpercaya."}
                    </p>
                  </div>

                  <div className="pt-3 mt-3.5 border-t border-editorial-borderLight flex items-center justify-between text-[11px]">
                    <span className="text-stone-500 font-medium">
                      {story.sourceCount} Sumber
                    </span>
                    <Link
                      href={`/story/${story.slug}`}
                      className="font-semibold text-editorial-charcoal group-hover:text-editorial-accent inline-flex items-center gap-1 transition"
                    >
                      <span>Rangkuman</span>
                      <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      {/* END: Latest Stories Stream */}

      {/* BEGIN: Tabbed Category Feeds (Solusi anti-scroll panjang berulang) */}
      <CategoryTabsSection
        categories={channelCategories}
        allStories={stories}
        categoryColorMap={categoryColorMap}
      />
      {/* END: Tabbed Category Feeds */}
    </div>
  );
}
