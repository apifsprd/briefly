import { StoryCollection } from "@/app/components/StoryCollection";
import { getStories } from "@/lib/story-feed";

export const revalidate = 3600;

export default async function TrendingPage() {
  const stories = (await getStories()).sort(
    (left, right) => right.trendingScore - left.trendingScore,
  );

  return (
    <main>
      <header className="mb-8 border-b border-editorial-borderLight pb-5">
        <p className="eyebrow">Coverage activity</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-editorial-charcoal sm:text-5xl">
          Trending stories
        </h1>
        <p className="mt-3 max-w-2xl text-base text-editorial-body">
          Ranked by recency and how many independent publishers are covering the
          same story. This is a signal of attention, not a judgment on
          importance.
        </p>
      </header>
      <StoryCollection
        stories={stories}
        emptyMessage="No trending stories are available right now."
      />
    </main>
  );
}
