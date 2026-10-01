import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCollection } from "@/app/components/StoryCollection";
import { getStories } from "@/lib/story-feed";
import { getRelatedStories } from "@/lib/stories";

interface StoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;

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
  const descriptions = [
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
    <article className="mx-auto max-w-4xl">
      <Link
        href={`/${story.category}`}
        className="text-sm font-medium text-blue-800 hover:underline"
      >
        {story.category} edition
      </Link>
      <header className="mt-3 border-b border-gray-300 pb-6">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
          {story.title}
        </h1>
        <p className="mt-3 text-sm text-gray-600">
          {story.sourceCount} sources · {story.articleCount} articles ·{" "}
          {formatPublicationTime(story.lastUpdatedAt)}
        </p>
      </header>

      <section
        className="border-b border-gray-200 py-6"
        aria-labelledby="coverage-notes"
      >
        <h2 id="coverage-notes" className="text-xl font-semibold">
          Coverage notes
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Publisher-provided descriptions, shown as published. Briefly does not
          generate or infer a summary.
        </p>
        {descriptions.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {descriptions.map((description) => (
              <li
                key={description}
                className="border-l-2 border-blue-700 pl-4 text-sm leading-relaxed text-gray-800"
              >
                {description}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            No publisher descriptions were included in these feeds.
          </p>
        )}
      </section>

      <section
        className="border-b border-gray-200 py-6"
        aria-labelledby="source-comparison"
      >
        <h2 id="source-comparison" className="text-xl font-semibold">
          Source comparison
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-160 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-300 text-xs uppercase tracking-wide text-gray-500">
                <th scope="col" className="py-2 pr-4">
                  Publisher
                </th>
                <th scope="col" className="py-2 pr-4">
                  Headline
                </th>
                <th scope="col" className="py-2">
                  Published
                </th>
              </tr>
            </thead>
            <tbody>
              {story.articles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b border-gray-100 align-top"
                >
                  <td className="py-3 pr-4 font-medium">
                    {article.sourceName}
                  </td>
                  <td className="py-3 pr-4">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-800 hover:underline"
                    >
                      {article.title}
                    </a>
                  </td>
                  <td className="py-3 text-gray-600">
                    {formatPublicationTime(article.publishedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {story.topics.length > 0 && (
          <p className="mt-4 text-xs text-gray-500">
            Shared headline terms: {story.topics.join(", ")}
          </p>
        )}
      </section>

      <section
        className="border-b border-gray-200 py-6"
        aria-labelledby="story-timeline"
      >
        <h2 id="story-timeline" className="text-xl font-semibold">
          Timeline
        </h2>
        {timeline.length > 0 ? (
          <ol className="mt-4 border-l border-gray-300 pl-5">
            {timeline.map((article) => (
              <li key={article.id} className="relative pb-4 last:pb-0">
                <span
                  className="absolute -left-6.25 top-1.5 h-2 w-2 rounded-full bg-blue-800"
                  aria-hidden="true"
                />
                <time
                  dateTime={article.publishedAt}
                  className="text-xs text-gray-500"
                >
                  {formatPublicationTime(article.publishedAt)}
                </time>
                <p className="text-sm font-medium">{article.sourceName}</p>
                <p className="text-sm text-gray-600">{article.title}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-gray-500">
            These feeds did not provide publication times.
          </p>
        )}
      </section>

      {relatedStories.length > 0 && (
        <div className="pt-6">
          <StoryCollection stories={relatedStories} heading="Related stories" />
        </div>
      )}
    </article>
  );
}
