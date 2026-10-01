import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Flame, TrendingUp } from "lucide-react";
import { getStories, newsCategories } from "@/lib/story-feed";

export const revalidate = 3600;

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

export default async function Home() {
  const stories = await getStories();
  if (stories.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-lg font-semibold text-slate-700">
          No stories are available right now.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          RSS feeds may be temporarily unavailable.
        </p>
      </div>
    );
  }

  const featuredStory = stories[0];
  const latestStories = stories.slice(1, 6);
  const trendingStories = [...stories]
    .sort((left, right) => right.trendingScore - left.trendingScore)
    .slice(0, 4);
  const categorySections = newsCategories.map((category) => ({
    ...category,
    stories: stories
      .filter((story) => story.category === category.id)
      .slice(0, 3),
  }));

  const leadArticle = featuredStory.articles[0];

  return (
    <div className="space-y-10">
      <section
        aria-labelledby="briefly-headline"
        className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)] sm:p-6 lg:p-8"
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <p className="eyebrow text-slate-500">The news, in context</p>
          <Link
            href="/trending"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900"
          >
            Trending
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {leadArticle.image && (
              <div className="relative h-56 w-full overflow-hidden border-b border-slate-200 bg-slate-100 sm:h-72">
                <Image
                  src={leadArticle.image}
                  alt=""
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-5 sm:p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                <span className="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-700">
                  {featuredStory.category}
                </span>
                {featuredStory.momentum && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">
                    <Flame size={11} aria-hidden="true" />
                    Developing
                  </span>
                )}
              </div>
              <Link href={`/story/${featuredStory.slug}`} className="group">
                <h1
                  id="briefly-headline"
                  className="text-3xl font-semibold leading-tight text-slate-950 group-hover:text-slate-700 sm:text-4xl lg:text-5xl"
                >
                  {featuredStory.title}
                </h1>
              </Link>
              {leadArticle.description && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
                  {leadArticle.description}
                </p>
              )}
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {featuredStory.articles.slice(0, 4).map((article, index) => (
                  <span
                    key={article.id}
                    className="inline-flex items-center gap-2"
                  >
                    {index > 0 && <span aria-hidden="true">•</span>}
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-slate-900 hover:underline"
                    >
                      {article.sourceName}
                    </a>
                  </span>
                ))}
                {featuredStory.sourceCount > 4 && (
                  <span>+{featuredStory.sourceCount - 4} more</span>
                )}
              </div>
              <div className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Updated {relativeTime(featuredStory.lastUpdatedAt)}
              </div>
            </div>
          </article>

          <div className="space-y-4">
            {latestStories.map((story) => (
              <article
                key={story.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <span>{story.category}</span>
                  <span>{relativeTime(story.lastUpdatedAt)}</span>
                </div>
                <Link href={`/story/${story.slug}`} className="group">
                  <h2 className="text-xl font-semibold leading-snug text-slate-950 group-hover:text-slate-700">
                    {story.title}
                  </h2>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                  {story.articles[0]?.description ||
                    "Coverage is developing across multiple outlets."}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="trending-title" className="space-y-5">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
          <h2
            id="trending-title"
            className="text-2xl font-semibold text-slate-900"
          >
            Trending now
          </h2>
          <Link
            href="/trending"
            className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900"
          >
            View all
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <ol className="space-y-3">
            {trendingStories.map((story, index) => (
              <li
                key={story.id}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link href={`/story/${story.slug}`} className="group">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                        {story.title}
                      </h3>
                    </Link>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{story.sourceCount} sources</span>
                      <span aria-hidden="true">•</span>
                      <span>{relativeTime(story.lastUpdatedAt)}</span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <aside className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              <TrendingUp size={14} aria-hidden="true" />
              Momentum
            </div>
            <div className="space-y-4">
              {stories.slice(0, 4).map((story, index) => {
                const width = 70 + (index + 1) * 18;
                return (
                  <div key={`${story.id}-momentum`}>
                    <div className="mb-2 flex items-center justify-between gap-2 text-sm text-slate-600">
                      <span className="capitalize">{story.category}</span>
                      <span>{Math.min(100, width)}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-slate-900"
                        style={{ width: `${Math.min(100, width)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>
      </section>

      <section
        id="latest"
        aria-labelledby="latest-title"
        className="space-y-5 pt-2"
      >
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="latest-title"
              className="text-2xl font-semibold text-slate-900"
            >
              Latest stories
            </h2>
            <span className="rounded bg-slate-950 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
              Latest dispatches
            </span>
          </div>
          <span className="text-xs text-slate-500">
            Updated {relativeTime(stories[0].lastUpdatedAt)}
          </span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stories.slice(0, 6).map((story) => (
            <article
              key={story.id}
              className="group flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-slate-400"
            >
              <div>
                <div className="mb-2.5 flex items-center justify-between gap-2 text-[11px] text-slate-500">
                  <span className="font-bold uppercase tracking-wider text-orange-700">
                    {story.category}
                  </span>
                  <span>{relativeTime(story.lastUpdatedAt)}</span>
                </div>
                <Link href={`/story/${story.slug}`} className="group/link">
                  <h3 className="text-lg font-semibold leading-snug text-slate-950 transition-colors group-hover/link:text-orange-700">
                    {story.title}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {story.articles[0]?.description ||
                    "Multiple outlets are following developments in this story."}
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[11px]">
                <span className="font-semibold text-slate-900">
                  {story.articles
                    .slice(0, 2)
                    .map((article) => article.sourceName)
                    .join(" · ")}
                </span>
                <span className="shrink-0 text-slate-500">
                  {story.sourceCount}{" "}
                  {story.sourceCount === 1 ? "source" : "sources"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-8 pt-2">
        {categorySections.map((category) => (
          <div
            key={category.id}
            className="rounded-[24px] border border-slate-200 bg-white p-4 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-3">
              <h2 className="text-2xl font-semibold text-slate-900">
                {category.name}
              </h2>
              <Link
                href={`/${category.id}`}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900"
              >
                See more
              </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {category.stories.length > 0 ? (
                category.stories.map((story) => (
                  <article
                    key={story.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {story.sourceCount} sources ·{" "}
                      {relativeTime(story.lastUpdatedAt)}
                    </div>
                    <Link href={`/story/${story.slug}`} className="group">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">
                        {story.title}
                      </h3>
                    </Link>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-600">
                      {story.articles[0]?.description ||
                        "Coverage is developing across multiple outlets."}
                    </p>
                  </article>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No stories available in this edition.
                </p>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
