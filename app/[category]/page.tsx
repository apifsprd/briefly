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

export const revalidate = 3600;

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const news = await getRssFeed({ category });

  const cleanTitle = (html: string) => {
    // remove <a> tags
    return html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1");
  };

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-between items-start gap-4 sm:gap-5 md:gap-6">
      {news.map((source, idx) => (
        <section key={idx} className="card" aria-labelledby={`source-${idx}`}>
          <header className="flex flex-row justify-start items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-14 sm:w-16 md:w-18 h-14 sm:h-16 md:h-18 relative overflow-hidden rounded-full border border-gray-200 shrink-0">
              <Image
                src={source.meta.image}
                alt={`${source.meta.publisher} logo`}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
              />
            </div>
            <div className="flex flex-col flex-1 gap-0.5 sm:gap-1 min-w-0">
              <Link
                href={source.meta.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <h2
                  id={`source-${idx}`}
                  className="line-clamp-1 text-base sm:text-base md:text-lg hover:text-blue-600 transition-colors duration-300 font-semibold text-gray-900 cursor-pointer capitalize tracking-normal"
                >
                  {source.meta.publisher}
                </h2>
              </Link>
              {source.meta.desc && (
                <p className="line-clamp-2 text-xs sm:text-sm text-gray-400 capitalize tracking-normal font-medium leading-snug">
                  {source.meta.desc}
                </p>
              )}
            </div>
          </header>

          <div className="flex flex-col ">
            {source?.items?.map((news, nIdx) => (
              <article
                key={nIdx}
                className="group w-full h-auto relative flex flex-row justify-center items-start gap-2 sm:gap-3 border-t border-gray-200 py-4"
              >
                <div className="flex flex-col flex-1 gap-1 sm:gap-2 min-w-0">
                  <Link
                    href={news.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3
                      dangerouslySetInnerHTML={{
                        __html: cleanTitle(news.title) || "",
                      }}
                      className="font-medium leading-snug text-sm sm:text-sm md:text-base text-gray-900 group-hover:text-blue-600 transition-colors duration-300 cursor-pointer capitalize tracking-normal "
                    />
                  </Link>

                  <time className="text-xs font-normal cursor-pointer text-gray-500">
                    {dayjs(news.isoDate).fromNow()}
                  </time>
                </div>
                {
                  // if image is available, show it
                  news.image && (
                    <Image
                      src={news.image}
                      alt={news.title}
                      width={100}
                      height={100}
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
                    />
                  )
                }
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
