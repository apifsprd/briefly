import { StoryCollection } from "@/app/components/StoryCollection";

export const revalidate = 3600;

export default function SavedPage() {
  return (
    <main>
      <header className="mb-7 border-b border-gray-300 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-800">
          Your reading list
        </p>
        <h1 className="text-3xl font-semibold">Saved stories</h1>
      </header>
      <StoryCollection stories={[]} mode="saved" />
    </main>
  );
}
