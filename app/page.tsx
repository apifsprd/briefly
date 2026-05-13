import { getLatestFeedFromAllSources, RssFeed } from "@/lib/rss";
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
  const latestNews: { hero: RssFeed[]; aside: RssFeed[] } =
    (await getLatestFeedFromAllSources()) as {
      hero: RssFeed[];
      aside: RssFeed[];
    };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6">
      <section className="w-full flex flex-col gap-4 sm:gap-5 lg:gap-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-gray-900 ">
          Latest News
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
            {latestNews.hero.map((source, idx) => (
              <Link
                href={source.items[0].link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
              >
                <article className="card group gap-4">
                  <div className="flex flex-row justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative rounded-full overflow-hidden border border-gray-200 shrink-0">
                        <Image
                          src={source.meta.image}
                          alt={source.meta.publisher}
                          fill
                          className="object-contain"
                          sizes="32px"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {source.meta.publisher}
                      </span>
                    </div>
                    <time className="text-xs font-normal cursor-pointer text-gray-600">
                      {dayjs(source.items[0].isoDate).fromNow()}
                    </time>
                  </div>
                  <h2
                    className="text-base sm:text-base md:text-lg font-medium leading-snug text-gray-900 group-hover:text-blue-600 transition-colors duration-300 capitalize cursor-pointer line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: cleanTitle(source.items[0].title),
                    }}
                  />
                  <p className="text-sm sm:text-sm md:text-base text-gray-500 leading-relaxed line-clamp-4">
                    {source.items[0].description || source.items[0].title}
                  </p>
                </article>
              </Link>
            ))}
          </div>
          <div className="card h-full gap-4 justify-between">
            {latestNews.aside.map((source, idx) => (
              <Link
                href={source.items[0].link}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
              >
                <article className="flex flex-col gap-2 group:">
                  <h3 className="text-base sm:text-base md:text-lg font-medium leading-snug text-gray-900 cursor-pointer hover:text-blue-600 transition-colors duration-300 capitalize line-clamp-2">
                    {source.items[0].title}
                  </h3>
                  <p className="text-xs sm:text-xs lg:text-sm text-gray-400">
                    {source.meta.publisher} -{" "}
                    {dayjs(source.items[0].isoDate).fromNow()}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
