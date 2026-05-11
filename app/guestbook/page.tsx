"use client";

import Giscus from "@giscus/react";
import { version } from "@/package.json";

export default function page() {
  return (
    <section className="w-full max-w-2xl bg-white p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-2xl md:mx-auto border border-gray-200">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
          Guestbook
        </h1>
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">
          Thank you for visiting{" "}
          <span className="font-semibold text-blue-600">Briefly</span>. This
          page is open to anyone who wants to share their thoughts, provide
          feedback on version{" "}
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-sm font-mono">
            v{version}
          </span>
          , or simply say hello.
        </p>
      </header>

      <Giscus
        id="comments"
        repo="apifsprd/briefly" // Ganti dengan repo Anda
        repoId="R_kgDOSXee9g" // Dapatkan dari giscus.app
        category="General" // Kategori diskusi di GitHub
        categoryId="DIC_kwDOSXee9s4C8uUL" // Dapatkan dari giscus.app
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
