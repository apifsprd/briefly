import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { StoryCollection } from "@/app/components/StoryCollection";
import { getStories } from "@/lib/story-feed";
import { getRelatedStories, getKeywords } from "@/lib/stories";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

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

function formatPublicationTime(value: string): string {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp)
    ? new Intl.DateTimeFormat("en", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "UTC",
      }).format(timestamp)
    : "Publication time unavailable";
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params;
  const stories = await getStories();
  const story = stories.find((item) => item.slug === slug);
  if (!story) notFound();

  const relatedStories = getRelatedStories(story, stories);
  const overview = [
    ...new Set(
      story.articles.map((article) => article.description).filter(Boolean),
    ),
  ].slice(0, 3);
  const timeline = story.articles
    .filter((article) => Number.isFinite(Date.parse(article.publishedAt)))
    .sort(
      (left, right) =>
        Date.parse(left.publishedAt) - Date.parse(right.publishedAt),
    );

  return (
    <article className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-editorial-borderLight pb-4">
        <Link
          href={`/${story.category}`}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-editorial-accent hover:text-editorial-charcoal"
        >
          {story.category} edition
        </Link>
        <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800">
          {story.sourceCount} {story.sourceCount === 1 ? "source" : "sources summarized"}
        </span>
      </div>

      <header className="mb-8">
        <h1 className="max-w-4xl font-serif text-4xl font-bold text-editorial-charcoal sm:text-5xl">
          {story.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-editorial-muted">
          <span>{story.articleCount} articles</span>
          <span aria-hidden="true">•</span>
          <span>{relativeTime(story.lastUpdatedAt)}</span>
        </div>
      </header>

      {story.articles[0]?.image && (
        <div className="relative mb-8 aspect-[16/7] w-full overflow-hidden rounded-xl border border-editorial-borderLight bg-editorial-surfaceMuted">
          <Image
            src={story.articles[0].image}
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1152px"
            className="object-cover"
          />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section className="rounded-xl border border-editorial-border/80 bg-[#f5f4ef] p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
            <p className="eyebrow">Editorial summary</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-editorial-charcoal">
              Briefly overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-editorial-body">
              {overview[0] ||
                "Publisher coverage is still developing. This story is being tracked across multiple outlets and updated as new reporting arrives."}
            </p>
            {overview.length > 1 && (
              <ul className="mt-5 space-y-3">
                {overview.slice(1).map((point) => (
                  <li
                    key={point}
                    className="border-l-2 border-editorial-accent/50 pl-4 text-sm leading-relaxed text-editorial-body"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
            <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">
              Key developments
            </h2>
            <ul className="mt-4 space-y-3">
              {story.articles.slice(0, 4).map((article) => (
                <li key={article.id} className="border-b border-editorial-borderLight py-4 last:border-0 last:pb-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-editorial-accent">
                    {article.sourceName}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-base font-semibold text-editorial-charcoal hover:text-editorial-accent hover:underline"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {story.articles.length > 1 && (
            <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
              <div className="flex items-center justify-between gap-3 border-b border-editorial-borderLight pb-3">
                <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">
                  Source comparison
                </h2>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-editorial-muted">
                  {story.sourceCount}{" "}
                  {story.sourceCount === 1 ? "source" : "sources"}
                </span>
              </div>
              <p className="mt-3 text-sm text-editorial-body">
                Compare coverage angles and reporting differences across
                publishers.
              </p>
              <div className="mt-5 space-y-4">
                {story.articles.map((article) => {
                  const articleKeywords = [...getKeywords(article.title)].slice(
                    0,
                    4,
                  );
                  return (
                    <div
                      key={`compare-${article.id}`}
                      className="border-b border-editorial-borderLight py-4 transition-colors last:border-0"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-semibold uppercase tracking-wider text-editorial-charcoal">
                          {article.sourceName}
                        </span>
                        <span className="text-editorial-muted">
                          {relativeTime(article.publishedAt)}
                        </span>
                      </div>
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-base font-semibold leading-snug text-editorial-charcoal hover:text-editorial-accent hover:underline"
                      >
                        {article.title}
                      </a>
                      {article.description && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-editorial-body">
                          {article.description}
                        </p>
                      )}
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-editorial-borderLight pt-2.5">
                        {articleKeywords.length > 0 ? (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-editorial-muted">
                              Focus:
                            </span>
                            {articleKeywords.map((kw) => (
                              <span
                                key={kw}
                                className="rounded bg-editorial-surfaceMuted px-2 py-0.5 text-[10px] font-medium text-editorial-body"
                              >
                                {kw}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div />
                        )}
                        <a
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-editorial-accent hover:text-editorial-charcoal hover:underline"
                        >
                          Read on {article.sourceName} ↗
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

            <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
            <h2 className="font-serif text-2xl font-bold text-editorial-charcoal">Timeline</h2>
            {timeline.length > 0 ? (
              <ol className="mt-5 space-y-5 border-l border-editorial-border pl-5">
                {timeline.map((article) => (
                  <li key={article.id} className="relative">
                    <span
                      className="absolute left-[-1.7rem] top-1.5 h-3 w-3 rounded-full bg-editorial-accent"
                      aria-hidden="true"
                    />
                    <time
                      dateTime={article.publishedAt}
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-editorial-muted"
                    >
                      {formatPublicationTime(article.publishedAt)}
                    </time>
                    <p className="mt-1 text-sm font-semibold text-editorial-charcoal">
                      {article.sourceName}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-editorial-body">
                      {article.title}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-editorial-muted">
                These feeds did not provide publication times.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
            <h2 className="font-serif text-xl font-bold text-editorial-charcoal">Covered by</h2>
            <ul className="mt-4 space-y-3">
              {story.articles.map((article) => (
                <li
                  key={article.id}
                  className="flex items-start justify-between gap-3 border-b border-editorial-borderLight pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-editorial-charcoal hover:text-editorial-accent hover:underline"
                    >
                      {article.sourceName}
                    </a>
                    <p className="mt-1 text-xs text-editorial-muted">
                      {relativeTime(article.publishedAt)}
                    </p>
                  </div>
                  <span className="text-xs text-editorial-muted">
                    {article.sourceName}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {story.topics.length > 0 && (
            <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
              <h2 className="font-serif text-xl font-bold text-editorial-charcoal">Topics</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-editorial-border bg-editorial-surfaceMuted px-3 py-1 text-xs text-editorial-body"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>

      {relatedStories.length > 0 && (
        <div className="mt-10">
          <StoryCollection stories={relatedStories} heading="Related stories" />
        </div>
      )}
    </article>
  );
}
