import { notFound } from "next/navigation";
import { StoryCollection } from "@/app/components/StoryCollection";
import { getNewsCategory, getStories } from "@/lib/story-feed";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const categoryInfo = getNewsCategory(category);
  if (!categoryInfo) notFound();
  const stories = await getStories(category);

  return (
    <div className="w-full">
      <header className="mb-7 border-b border-gray-300 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-800">
          Edition
        </p>
        <h1 className="text-3xl font-semibold">{categoryInfo.name}</h1>
        <p className="mt-2 text-sm text-gray-600">
          Stories grouped across the publishers covering this beat.
        </p>
      </header>
      <StoryCollection
        stories={stories}
        emptyMessage="No stories are available for this edition right now."
      />
    </div>
  );
}
