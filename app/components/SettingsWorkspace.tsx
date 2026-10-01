"use client";

import { useEffect, useState } from "react";
import { Check, MoonStar, SunMedium } from "lucide-react";

const settingsKey = "briefly-settings";

type AppearanceMode = "light" | "dark" | "system";

const defaultSettings = {
  appearance: "light" as AppearanceMode,
  categories: ["world", "business", "market", "technology", "ai", "football"],
};

function readSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(settingsKey) || "null");
    if (!stored || typeof stored !== "object") {
      return defaultSettings;
    }

    const appearance =
      stored.appearance === "light" ||
      stored.appearance === "dark" ||
      stored.appearance === "system"
        ? stored.appearance
        : defaultSettings.appearance;

    const categories = Array.isArray(stored.categories)
      ? stored.categories.filter(
          (value: unknown): value is string => typeof value === "string",
        )
      : [...defaultSettings.categories];

    return {
      appearance,
      categories:
        categories.length > 0 ? categories : [...defaultSettings.categories],
    };
  } catch {
    return defaultSettings;
  }
}

export function SettingsWorkspace() {
  const [{ appearance, categories }, setSettings] = useState<{
    appearance: AppearanceMode;
    categories: string[];
  }>(() => readSettings());

  useEffect(() => {
    localStorage.setItem(
      settingsKey,
      JSON.stringify({
        appearance,
        categories,
      }),
    );
  }, [appearance, categories]);

  const toggleCategory = (category: string) => {
    setSettings((current) => ({
      appearance: current.appearance,
      categories: current.categories.includes(category)
        ? current.categories.filter((item: string) => item !== category)
        : [...current.categories, category],
    }));
  };

  const appearanceOptions: Array<{
    value: AppearanceMode;
    label: string;
    icon: typeof SunMedium;
  }> = [
    { value: "light", label: "Light", icon: SunMedium },
    { value: "dark", label: "Dark", icon: MoonStar },
    { value: "system", label: "System", icon: Check },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Appearance</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {appearanceOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                setSettings((current) => ({ ...current, appearance: value }))
              }
              className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm font-medium transition ${
                appearance === value
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
              }`}
            >
              <span>{label}</span>
              <Icon size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Content</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {["world", "business", "market", "technology", "ai", "football"].map(
            (category) => (
              <label
                key={category}
                className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
              >
                <span className="capitalize">{category}</span>
                <input
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="h-4 w-4 accent-slate-900"
                  aria-label={`Toggle ${category}`}
                />
              </label>
            ),
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-semibold text-slate-900">Sources</h2>
        <p className="mt-2 text-sm text-slate-600">
          Briefly keeps you connected to the feeds you follow. Manage preferred
          sources at the feed registry level in the project configuration.
        </p>
      </section>
    </div>
  );
}
