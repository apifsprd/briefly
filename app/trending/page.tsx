import { StoryCollection } from "@/app/components/StoryCollection";
import { getStories } from "@/lib/story-feed";

export const revalidate = 3600;

export default async function TrendingPage() {
  const stories = (await getStories()).sort(
    (left, right) => right.trendingScore - left.trendingScore,
  );

  return (
    <main>
      <header className="mb-7 border-b border-slate-200 pb-5">
        <p className="eyebrow text-slate-500">Coverage activity</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-5xl">
          Trending stories
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
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
