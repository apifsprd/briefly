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
    <div className="space-y-8">
      <header className="border-b border-slate-200 pb-5">
        <p className="eyebrow text-slate-500">Edition</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-5xl">
          {categoryInfo.name}
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Latest developments from the publishers covering this topic.
        </p>
      </header>

      {featuredStory && (
        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_1px_0_rgba(15,23,42,0.03)]">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            {leadArticle?.image && (
              <div className="relative h-60 w-full overflow-hidden bg-slate-100 lg:h-full">
                <Image
                  src={leadArticle.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-5 sm:p-6 lg:p-8">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                <span>{categoryInfo.name}</span>
                <span aria-hidden="true">•</span>
                <span>{relativeTime(featuredStory.lastUpdatedAt)}</span>
              </div>
              <Link href={`/story/${featuredStory.slug}`} className="group">
                <h2 className="text-3xl font-semibold leading-tight text-slate-900 group-hover:text-slate-700">
                  {featuredStory.title}
                </h2>
              </Link>
              {leadArticle?.description && (
                <p className="mt-4 text-base leading-relaxed text-slate-600">
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
              </div>
            </div>
          </div>
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
