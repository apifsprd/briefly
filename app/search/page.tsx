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
      <header className="mb-7 border-b border-gray-300 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-800">
          Search the brief
        </p>
        <h1 className="mb-5 text-3xl font-semibold">Find a story</h1>
      </header>
      <SearchWorkspace stories={allStories} initialQuery={query} />
    </main>
  );
}
