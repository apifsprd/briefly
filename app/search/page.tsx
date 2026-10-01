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
      <header className="mb-7 border-b border-slate-200 pb-5">
        <p className="eyebrow text-slate-500">Search the brief</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-5xl">
          Find a story
        </h1>
      </header>
      <SearchWorkspace stories={allStories} initialQuery={query} />
    </main>
  );
}
