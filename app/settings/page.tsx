import { SettingsWorkspace } from "@/app/components/SettingsWorkspace";

export const revalidate = 3600;

export default function SettingsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl">
      <header className="mb-8 border-b border-slate-200 pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-600">
          Preferences
        </p>
        <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
          Settings
        </h1>
      </header>
      <SettingsWorkspace />
    </main>
  );
}
