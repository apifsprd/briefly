"use client";

import Giscus from "@giscus/react";
import { version } from "@/package.json";

export default function GuestbookPage() {
  return (
    <section className="mx-auto w-full max-w-3xl rounded-xl border border-editorial-border/80 bg-white p-5 shadow-[0_2px_10px_rgba(20,20,19,0.03)] sm:p-8">
      <header className="mb-10 text-left">
        <p className="eyebrow mb-2">Community</p>
        <h1 className="mb-4 font-serif text-4xl font-bold tracking-tight text-editorial-charcoal">
          Guestbook
        </h1>
        <p className="text-sm leading-relaxed text-editorial-body md:text-base">
          Thank you for visiting{" "}
          <span className="font-semibold text-editorial-accent">Briefly</span>.
          This page is open to anyone who wants to share their thoughts, provide
          feedback on version{" "}
          <span className="rounded bg-editorial-surfaceMuted px-2 py-0.5 font-mono text-sm text-editorial-charcoal">
            v{version}
          </span>
          , or simply say hello.
        </p>
      </header>

      <Giscus
        id="comments"
        repo="apifsprd/briefly" // Ganti dengan repo Anda
        repoId={process.env.NEXT_PUBLIC_GISCUS_REPO_ID || ""} // Dapatkan dari giscus.app
        category={process.env.NEXT_PUBLIC_GISCUS_CATEGORY} // Kategori diskusi di GitHub
        categoryId={process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID} // Dapatkan dari giscus.app
        mapping="pathname" // Komentar akan berbeda di setiap URL/halaman
        term="Welcome to Briefly Guestbook!"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light" // Bisa disesuaikan (light/dark)
        lang="en" // Bahasa Indonesia
        loading="lazy"
      />
    </section>
  );
}
