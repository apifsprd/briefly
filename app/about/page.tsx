import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Briefly, your trusted source for verified daily news briefs from around the world.",
  openGraph: {
    title: "About Briefly - Verified Daily News",
    description: "The mission and team behind Briefly.",
  },
};

export default function page() {
  return (
    <article className="container mx-auto max-w-2xl bg-white p-8 rounded-2xl border border-gray-200">
      <header className="mb-12 flex flex-col items-start gap-8">
        <h1>About Briefly</h1>
        <p className="leading-relaxed tracking-wide">
          In today’s massive information era, keeping up with the news has
          become a daily necessity. But with the social media and AI boom, we’re
          often flooded with news that isn&apos;t always accurate.
        </p>
        <p className="leading-relaxed tracking-wide">
          One of the best ways to filter what we consume is by following or
          visiting trusted news outlets. The problem is, checking dozens of
          different sites every day is a total hassle. I felt this struggle
          personally—I need my daily fix of updates on markets, politics,
          football, and more, but I didn&apos;t want to keep jumping from one
          tab to another.
        </p>
        <p className="leading-relaxed tracking-wide">
          To solve this, I built a web app that monitors news from reliable
          sources using their official RSS feeds.
        </p>
        <p className="leading-relaxed tracking-wide">
          I hope this tool can be useful for others too. I&apos;d love to hear
          your feedback or suggestions!
        </p>
        <p className="leading-relaxed tracking-wide">
          This project is open-source and is now live on my GitHub. If
          you&apos;re a developer facing the same problem, feel free to
          contribute and help me make Briefly even better.
        </p>
        <div>
          <p className="leading-relaxed tracking-wide font-bold">
            Apif Supriadi
          </p>
          <a
            href="https://apifsprd.web.id"
            target="_blank"
            rel="noopener noreferrer"
          >
            @apifsprd
          </a>
        </div>
      </header>
    </article>
  );
}
