import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StoryCollection } from "@/app/components/StoryCollection";
import { getNewsCategory, getStories } from "@/lib/story-feed";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
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

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = getNewsCategory(category);
  if (!categoryInfo) notFound();

  const stories = await getStories(category);
  const featuredStory = stories[0];
  const leadArticle = featuredStory?.articles[0];

  return (
    <div className="space-y-12">
      <header className="border-b border-editorial-borderLight pb-5">
        <p className="eyebrow">Edition</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-editorial-charcoal sm:text-5xl">
          {categoryInfo.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-editorial-body">
          Latest developments from the publishers covering this topic.
        </p>
      </header>

      {featuredStory && (
        <section className="grid items-stretch gap-6 lg:grid-cols-12">
          <article className="overflow-hidden rounded-xl border border-editorial-border/80 bg-white shadow-[0_2px_10px_rgba(20,20,19,0.03)] transition-shadow hover:shadow-md lg:col-span-8">
            <div className="grid h-full gap-0 lg:grid-cols-12">
              {leadArticle?.image && (
                <div className="relative h-60 w-full overflow-hidden bg-editorial-surfaceMuted lg:col-span-5 lg:h-full lg:min-h-80">
                  <Image
                    src={leadArticle.image}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 480px"
                    className="object-cover"
                  />
                </div>
              )}
              <div
                className={`p-5 sm:p-6 lg:p-8 ${leadArticle?.image ? "lg:col-span-7" : "lg:col-span-12"}`}
              >
                <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-editorial-muted">
                  <span className="rounded-md bg-editorial-charcoal px-2.5 py-1 text-white">
                    {leadArticle?.sourceName || "Publisher"}
                  </span>
                  <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                    {featuredStory.sourceCount}{" "}
                    {featuredStory.sourceCount === 1
                      ? "source"
                      : "sources summarized"}
                  </span>
                  <span>{categoryInfo.name}</span>
                  <span aria-hidden="true">•</span>
                  <span>{relativeTime(featuredStory.lastUpdatedAt)}</span>
                </div>
                <Link href={`/story/${featuredStory.slug}`} className="group">
                  <h2 className="font-serif text-3xl font-bold leading-tight text-editorial-charcoal transition-colors group-hover:text-editorial-accent sm:text-4xl">
                    {featuredStory.title}
                  </h2>
                </Link>
                {leadArticle?.description && (
                  <p className="mt-4 text-base leading-relaxed text-editorial-body">
                    {leadArticle.description}
                  </p>
                )}
                <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-editorial-borderLight pt-4 text-xs text-editorial-muted">
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
                        className="font-semibold text-editorial-charcoal hover:text-editorial-accent hover:underline"
                      >
                        {article.sourceName}
                      </a>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          <aside
            className="rounded-xl border border-editorial-border/80 bg-white p-5 sm:p-6 lg:col-span-4"
            aria-label="More in this edition"
          >
            <div className="mb-3 border-b border-editorial-borderLight pb-3">
              <p className="eyebrow">More in this edition</p>
              <h2 className="mt-1 font-serif text-xl font-bold text-editorial-charcoal">
                Coverage in context
              </h2>
            </div>
            <ol className="divide-y divide-editorial-borderLight">
              {stories.slice(1, 4).map((story, index) => (
                <li key={story.id} className="py-3 first:pt-1 last:pb-1">
                  <div className="mb-1 flex items-center justify-between gap-2 text-[10px] font-semibold uppercase tracking-wider text-editorial-muted">
                    <span className="text-editorial-accent">
                      #{index + 1} ·{" "}
                      {story.articles[0]?.sourceName || "Publisher"}
                    </span>
                    <span>{story.sourceCount} sources</span>
                  </div>
                  <Link
                    href={`/story/${story.slug}`}
                    className="font-serif text-base font-bold leading-snug text-editorial-charcoal hover:text-editorial-accent"
                  >
                    {story.title}
                  </Link>
                </li>
              ))}
              {stories.length < 2 && (
                <li className="py-4 text-sm text-editorial-muted">
                  More reporting will appear as this edition updates.
                </li>
              )}
            </ol>
          </aside>
        </section>
      )}

      <section>
        <StoryCollection
          stories={stories}
          heading="Latest stories"
          showPreferences
          emptyMessage="No stories are available for this edition right now."
        />
      </section>
    </div>
  );
}
