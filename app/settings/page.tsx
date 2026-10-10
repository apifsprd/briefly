import { SettingsWorkspace } from "@/app/components/SettingsWorkspace";

export const revalidate = 3600;

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl">
      <header className="mb-8 border-b border-editorial-borderLight pb-5">
        <p className="eyebrow mb-2">Preferences</p>
        <h1 className="font-serif text-3xl font-bold text-editorial-charcoal sm:text-4xl">
          Settings
        </h1>
      </header>
      <SettingsWorkspace />
    </main>
  );
}
