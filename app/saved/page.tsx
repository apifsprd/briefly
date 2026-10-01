import { StoryCollection } from "@/app/components/StoryCollection";

export const revalidate = 3600;

export default function SavedPage() {
  return (
    <main>
      <header className="mb-7 border-b border-slate-200 pb-5">
        <p className="eyebrow text-slate-500">Your reading list</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-5xl">
          Saved stories
        </h1>
      </header>
      <StoryCollection stories={[]} mode="saved" />
    </main>
  );
}
