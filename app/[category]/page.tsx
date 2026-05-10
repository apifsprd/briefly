import { getRssFeed } from "@/lib/rss";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return [{ category: "world" }, { category: "football" }];
}

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const news = await getRssFeed({ category });

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between items-start gap-4 sm:gap-5 md:gap-6">
      {news.map((source, idx) => (
        <section
          key={idx}
          className="flex flex-col flex-1 bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5"
          aria-labelledby={`source-${idx}`}
        >
          <header className="flex flex-row justify-start items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-14 sm:w-16 md:w-18 h-14 sm:h-16 md:h-18 relative overflow-hidden rounded-full border border-gray-200 flex-shrink-0">
              <Image
                src={source.meta.image}
                alt={`${source.meta.publisher} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
              />
            </div>
            <div className="flex flex-col flex-1 gap-0.5 sm:gap-1 min-w-0">
              <h2
                id={`source-${idx}`}
                className="line-clamp-1 text-sm sm:text-base md:text-lg"
              >
                {source.meta.publisher}
              </h2>
              {source.meta.desc && (
                <p className="line-clamp-2 text-xs sm:text-sm text-gray-400 capitalize tracking-normal font-medium">
                  {source.meta.desc}
                </p>
              )}
            </div>
          </header>

          <div className="flex flex-col gap-3 sm:gap-4 md:gap-6">
            {source?.items?.map((news, nIdx) => (
              <article
                key={nIdx}
                className="group w-full h-auto relative flex flex-row justify-between items-start gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-gray-200 last:border-0 "
              >
                <div className="flex flex-col flex-1 gap-1 sm:gap-2 min-w-0">
                  <Link
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3 className="font-medium leading-snug text-xs sm:text-sm md:text-base text-gray-900 group-hover:text-blue-600 transition-colors duration-300 cursor-pointer capitalize tracking-normal">
                      {news.title}
                    </h3>
                  </Link>

                  <time className="text-xs font-normal cursor-pointer text-gray-400">
                    {dayjs(news.isoDate).fromNow()}
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
