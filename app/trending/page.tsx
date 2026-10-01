import { StoryCollection } from "@/app/components/StoryCollection";
import { getStories } from "@/lib/story-feed";

export const revalidate = 3600;

export default async function TrendingPage() {
  const stories = (await getStories()).sort(
    (left, right) => right.trendingScore - left.trendingScore,
  );

  return (
    <main>
      <header className="mb-7 border-b border-gray-300 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-800">
          Coverage activity
        </p>
        <h1 className="text-3xl font-semibold">Trending stories</h1>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Ranked by recency and the number of independent articles and
          publishers in the current feeds. This is a coverage signal, not an
          importance rating.
        </p>
      </header>
      <StoryCollection
        stories={stories}
        emptyMessage="No trending stories are available right now."
      />
    </main>
  );
}
