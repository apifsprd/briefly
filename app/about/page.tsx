import React from "react";

import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Briefly, your trusted source for verified daily news briefs from around the world.",
  openGraph: {
    title: "About Briefly - Verified Daily News",
    description: "The mission and team behind Briefly.",
  },
};

export default function AboutPage() {
  return (
    <section>
      <article className="mx-auto w-full max-w-3xl rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_10px_rgba(20,20,19,0.03)] sm:p-8 md:p-10">
        <header className="mb-8 flex flex-col items-start gap-5 sm:mb-10 sm:gap-6">
          <p className="eyebrow">Our editorial approach</p>
          <h1 className="font-serif text-4xl font-bold text-editorial-charcoal sm:text-5xl">
            About Briefly
          </h1>
          <p className="leading-relaxed tracking-wide">
            In today’s massive information era, keeping up with the news has
            become a daily necessity. But with the social media and AI boom,
            we’re often flooded with news that isn&apos;t always accurate.
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
            This project is open-source and is now live on my GitHub (
            <a
              href="https://github.com/apifsprd/briefly"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold italic text-editorial-accent underline underline-offset-4 transition-colors hover:text-editorial-charcoal"
            >
              https://github.com/apifsprd/briefly
            </a>
            ). If you&apos;re a developer facing the same problem, feel free to
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
              className="font-semibold italic text-editorial-accent underline underline-offset-4 transition-colors hover:text-editorial-charcoal"
            >
              @apifsprd
            </a>
          </div>
        </header>
      </article>

      <div className="relative mx-auto mt-8 h-32 w-full max-w-5xl overflow-hidden rounded-xl border border-editorial-borderLight bg-editorial-surfaceMuted sm:h-48 md:h-64">
        <Image
          src="/images/header-banner.png"
          alt="Briefly Special Announcement"
          fill
          priority
          className="object-contain object-center"
          sizes="100vw"
        />
      </div>
    </section>
  );
}
