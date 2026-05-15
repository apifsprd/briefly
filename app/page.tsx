import {
  getLatestFeedFromAllSources,
  getLatestNewsFromAllCategories,
  RssFeed,
  RssItemNotSeparated,
} from "@/lib/rss";
import Image from "next/image";
import Link from "next/link";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export const revalidate = 3600;

const cleanTitle = (html: string) => {
  return html.replace(/<a\b[^>]*>(.*?)<\/a>/gi, "$1");
};

export default async function Home() {
  const latestNews: {
    hero: RssItemNotSeparated[];
    aside: RssItemNotSeparated[];
  } = (await getLatestFeedFromAllSources()) as {
    hero: RssItemNotSeparated[];
    aside: RssItemNotSeparated[];
  };
  const latestNewsFromAllCategory = await getLatestNewsFromAllCategories();

  return (
    <div className="w-full flex flex-col gap-6 sm:gap-6 lg:gap-8">
      <section
        className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6"
        aria-labelledby="latest-news"
      >
        <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight text-gray-900 ">
          Latest News
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {latestNews.hero.map((source, idx) => (
              <Link
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
              >
                <article className="card group gap-4">
                  {source.image && (
                    <div className="relative w-full h-40 sm:h-48 md:h-56 overflow-hidden rounded-lg border border-gray-200 shrink-0">
                      <Image
                        src={source.image}
                        alt={source.title}
                        fill
                        className="object-cover"
                        sizes="100%"
                      />
                    </div>
                  )}
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <Image
                          src={source.publisherImage}
                          alt={source.publisher}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                      <span className="text-xs sm:text-xs lg:text-sm font-medium tracking-normal text-gray-900 uppercase">
                        {source.publisher}
                      </span>
                    </div>
                    <time className="text-xs font-normal cursor-pointer text-gray-400">
                      {dayjs(source.isoDate).fromNow()}
                    </time>
                  </div>
                  <h2
                    className="text-base sm:text-base md:text-lg lg:text-xl font-medium leading-snug text-gray-900 group-hover:text-blue-600 transition-colors duration-300 capitalize cursor-pointer line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: cleanTitle(source.title),
                    }}
                  />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: source.description || source.title,
                    }}
                    className="text-sm sm:text-sm md:text-base text-gray-500 leading-relaxed line-clamp-4"
                  />
                </article>
              </Link>
            ))}
          </div>
          <div className="card h-full gap-4 justify-start">
            {latestNews.aside.map((source, idx) => (
              <Link
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
              >
                <article
                  className={`w-full flex flex-row justify-start items-center gap-2 group ${idx !== latestNews.aside.length - 1 ? "border-b border-gray-200 pb-4" : "border-0"} `}
                >
                  <div className="flex flex-1 flex-col gap-2">
                    <h3
                      dangerouslySetInnerHTML={{ __html: source.title }}
                      className="text-base sm:text-base font-medium leading-snug text-gray-900 cursor-pointer capitalize line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 "
                    />
                    <p className="text-xs sm:text-xs lg:text-sm text-gray-400 font-normal tracking-normal line-clamp-1">
                      {source.publisher} - {dayjs(source.isoDate).fromNow()}
                    </p>
                  </div>
                  {source.image && (
                    <div className="w-14 sm:w-16 md:w-18 h-14 sm:h-16 md:h-18 relative overflow-hidden rounded-lg border border-gray-200 shrink-0">
                      <Image
                        src={source.image}
                        alt={`${source.publisher} logo`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
                      />
                    </div>
                  )}
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <div className="relative w-full h-32 sm:h-48 md:h-64 overflow-hidden">
        <Image
          src="/images/header-banner.png"
          alt="Briefly Special Announcement"
          fill
          priority
          className="object-contain object-center"
          sizes="100vw"
        />
      </div>

      <section
        className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6"
        aria-labelledby="category"
      >
        <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 ">
            Latest News By Category
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.keys(latestNewsFromAllCategory).map((category) => (
              <article key={category} className="card gap-4">
                <h2 className="text-lg sm:text-lg md:text-xl font-semibold leading-snug text-gray-900 uppercase line-clamp-2">
                  {category}
                </h2>
                {latestNewsFromAllCategory[category].items.map(
                  (source, idx) => (
                    <Link
                      href={source.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={`${category}-${idx}`}
                    >
                      <article className="w-full flex flex-row justify-start items-center gap-2 group border-t border-gray-200 pt-4">
                        <div className="flex flex-1 flex-col gap-2">
                          <h3
                            dangerouslySetInnerHTML={{ __html: source.title }}
                            className="text-base sm:text-base font-medium leading-snug text-gray-900 cursor-pointer group-hover:text-blue-600 transition-colors duration-300 capitalize line-clamp-2"
                          />
                          <p className="text-xs sm:text-xs lg:text-sm text-gray-400 font-normal tracking-normal line-clamp-1">
                            {source.publisher} -{" "}
                            {dayjs(source.isoDate).fromNow()}
                          </p>
                        </div>
                        {source.image && (
                          <div className="w-14 sm:w-16 md:w-18 h-14 sm:h-16 md:h-18 relative overflow-hidden rounded-lg border border-gray-200 shrink-0">
                            <Image
                              src={source.image}
                              alt={`${source.publisher} logo`}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 72px"
                            />
                          </div>
                        )}
                      </article>
                    </Link>
                  ),
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
