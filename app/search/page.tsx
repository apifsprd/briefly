import { SearchWorkspace } from "@/app/components/SearchWorkspace";
import { getStories } from "@/lib/story-feed";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const revalidate = 3600;

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const allStories = await getStories();

  return (
    <main>
      <header className="mb-8 border-b border-editorial-borderLight pb-5">
        <p className="eyebrow">Search the brief</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-editorial-charcoal sm:text-5xl">
          Find a story
        </h1>
      </header>
      <SearchWorkspace stories={allStories} initialQuery={query} />
    </main>
  );
}
