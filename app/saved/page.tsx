import { StoryCollection } from "@/app/components/StoryCollection";

export const revalidate = 3600;

export default function SavedPage() {
  return (
    <main>
      <header className="mb-8 border-b border-editorial-borderLight pb-5">
        <p className="eyebrow">Your reading list</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-editorial-charcoal sm:text-5xl">
          Saved stories
        </h1>
      </header>
      <StoryCollection stories={[]} mode="saved" />
    </main>
  );
}
