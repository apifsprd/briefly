import { getStories, newsCategories } from "@/lib/story-feed";
import { StoryCollection } from "@/app/components/StoryCollection";
import Link from "next/link";

export const revalidate = 3600;

const cleanTitle = (html: string) => {
  return html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1");
};

export default async function Home() {
  const stories = await getStories();
  const trending = [...stories]
    .sort((left, right) => right.trendingScore - left.trendingScore)
    .slice(0, 3);

  return (
    <div className="flex w-full flex-col gap-10">
      <section
        className="border-b border-gray-300 pb-8"
        aria-labelledby="briefly-title"
      >
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-blue-800">
          The news, in context
        </p>
        <h1
          id="briefly-title"
          className="max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl"
        >
          Understand the news, not just the headlines.
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-600">
          Follow developing stories across publishers, compare coverage, and
          read directly from the source.
        </p>
      </section>

      <section aria-labelledby="trending-title">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <h2 id="trending-title" className="text-xl font-semibold">
            Trending now
          </h2>
          <Link
            href="/trending"
            className="text-sm font-medium text-blue-800 hover:underline"
          >
            All trending stories
          </Link>
        </div>
        <StoryCollection
          stories={trending}
          emptyMessage="No stories are available. RSS sources may be temporarily unavailable."
        />
      </section>

      <StoryCollection
        stories={stories.slice(0, 36)}
        heading="Latest stories"
        showPreferences
        emptyMessage="Stories will appear here when RSS sources are available."
      />

      <nav
        aria-label="News categories"
        className="border-t border-gray-300 pt-6"
      >
        <h2 className="mb-4 text-xl font-semibold">Browse editions</h2>
        <ul className="flex flex-wrap gap-x-6 gap-y-3">
          {newsCategories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/${category.id}`}
                className="text-sm font-medium text-blue-800 hover:underline"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
