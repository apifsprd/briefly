import { getRssFeed } from "@/lib/rss";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const news = await getRssFeed();
  return (
    // Gunakan kontainer yang deskriptif, tambahkan padding untuk spacing yang baik
    <div className="container mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
      {news.map((source, idx) => (
        <section
          key={idx}
          className="flex flex-col flex-1 bg-white border border-gray-200 rounded-xl p-5"
          aria-labelledby={`source-${idx}`}
        >
          {/* HEADER SUMBER BERITA */}
          <header className="flex flex-row justify-start items-center mb-6">
            <div className="w-12 h-12 relative overflow-hidden rounded-full border border-gray-200">
              <Image
                src={source.meta.image}
                alt={`${source.meta.publisher} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className="flex flex-col flex-1 ml-4 ">
              <h2 id={`source-${idx}`} className="line-clamp-1">
                {source.meta.publisher}
              </h2>
            </div>
          </header>

          {/* DAFTAR BERITA */}
          <div className="flex flex-col gap-6">
            {source?.items?.map((news, nIdx) => (
              <article
                key={nIdx}
                className="group w-full h-auto relative flex flex-row justify-between items-start gap-4 pb-4 border-b border-gray-200 last:border-0 "
              >
                <div className="flex flex-col flex-1 gap-2">
                  <Link href={news.link}>
                    <h3 className="font-medium leading-snug text-gray-900 group-hover:text-blue-600 transition-colors duration-300 cursor-pointer">
                      {news.title}
                    </h3>
                  </Link>

                  <time className="text-xs font-normal cursor-pointer">
                    {news.pubDate}
                  </time>
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
