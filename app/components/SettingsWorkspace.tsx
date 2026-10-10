"use client";

import { useEffect, useState } from "react";
import { Check, MoonStar, SunMedium } from "lucide-react";

const settingsKey = "briefly-settings";

const categoriesKey = "briefly-selected-categories";

type AppearanceMode = "light" | "dark" | "system";

const availableCategories = [
  { id: "world", name: "World Affairs" },
  { id: "business", name: "Business & Finance" },
  { id: "market", name: "Markets" },
  { id: "tech", name: "Technology" },
  { id: "ai", name: "Artificial Intelligence" },
  { id: "football", name: "Football" },
];

const defaultSettings = {
  appearance: "light" as AppearanceMode,
  categories: ["world", "business", "market", "tech", "ai", "football"],
};

function readSettings() {
  if (typeof window === "undefined") return defaultSettings;
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
      ? stored.categories
          .filter(
            (value: unknown): value is string => typeof value === "string",
          )
          .map((id: string) => (id === "technology" ? "tech" : id))
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
    localStorage.setItem(categoriesKey, JSON.stringify(categories));
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
      <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
        <h2 className="font-serif text-xl font-bold text-editorial-charcoal">
          Appearance
        </h2>
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
                  ? "border-editorial-charcoal bg-editorial-charcoal text-white"
                  : "border-editorial-border bg-editorial-surfaceMuted text-editorial-body hover:border-editorial-charcoal hover:bg-white"
              }`}
            >
              <span>{label}</span>
              <Icon size={16} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
        <h2 className="font-serif text-xl font-bold text-editorial-charcoal">
          Content
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {availableCategories.map(({ id, name }) => (
            <label
              key={id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-editorial-border bg-editorial-surfaceMuted px-4 py-3 text-sm text-editorial-body transition hover:border-editorial-charcoal hover:bg-white"
            >
              <span className="font-medium">{name}</span>
              <input
                type="checkbox"
                checked={categories.includes(id)}
                onChange={() => toggleCategory(id)}
                className="h-4 w-4 accent-editorial-charcoal"
                aria-label={`Toggle ${name}`}
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_8px_rgba(20,20,19,0.02)] sm:p-6">
        <h2 className="font-serif text-xl font-bold text-editorial-charcoal">
          Sources
        </h2>
        <p className="mt-2 text-sm text-editorial-body">
          Briefly keeps you connected to the feeds you follow. Manage preferred
          sources at the feed registry level in the project configuration.
        </p>
      </section>
    </div>
  );
}
