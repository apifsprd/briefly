import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCollection } from "@/app/components/StoryCollection";
import { getStories } from "@/lib/story-feed";
import { getRelatedStories } from "@/lib/stories";

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
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <Link
          href={`/${story.category}`}
          className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 hover:text-slate-900"
        >
          {story.category} edition
        </Link>
        <span className="text-xs text-slate-500">
          {story.sourceCount} sources
        </span>
      </div>

      <header className="mb-8">
        <h1 className="max-w-4xl text-4xl font-semibold text-slate-900 sm:text-5xl">
          {story.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{story.articleCount} articles</span>
          <span aria-hidden="true">•</span>
          <span>{relativeTime(story.lastUpdatedAt)}</span>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-8">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Briefly overview
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              {overview[0] ||
                "Publisher coverage is still developing. This story is being tracked across multiple outlets and updated as new reporting arrives."}
            </p>
            {overview.length > 1 && (
              <ul className="mt-5 space-y-3">
                {overview.slice(1).map((point) => (
                  <li
                    key={point}
                    className="border-l-2 border-slate-300 pl-4 text-sm leading-relaxed text-slate-600"
                  >
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-slate-900">
              Key developments
            </h2>
            <ul className="mt-4 space-y-3">
              {story.articles.slice(0, 4).map((article) => (
                <li key={article.id} className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {article.sourceName}
                  </p>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-base font-medium text-slate-900 hover:text-slate-700 hover:underline"
                  >
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-2xl font-semibold text-slate-900">Timeline</h2>
            {timeline.length > 0 ? (
              <ol className="mt-5 space-y-5 border-l border-slate-200 pl-5">
                {timeline.map((article) => (
                  <li key={article.id} className="relative">
                    <span
                      className="absolute -left-[1.7rem] top-1.5 h-3 w-3 rounded-full bg-slate-900"
                      aria-hidden="true"
                    />
                    <time
                      dateTime={article.publishedAt}
                      className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500"
                    >
                      {formatPublicationTime(article.publishedAt)}
                    </time>
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {article.sourceName}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">
                      {article.title}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                These feeds did not provide publication times.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-semibold text-slate-900">Covered by</h2>
            <ul className="mt-4 space-y-3">
              {story.articles.map((article) => (
                <li
                  key={article.id}
                  className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0"
                >
                  <div>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-slate-900 hover:text-slate-700 hover:underline"
                    >
                      {article.sourceName}
                    </a>
                    <p className="mt-1 text-xs text-slate-500">
                      {relativeTime(article.publishedAt)}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">
                    {article.sourceName}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {story.topics.length > 0 && (
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-xl font-semibold text-slate-900">Topics</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600"
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
