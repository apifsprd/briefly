import Parser from "rss-parser";
import rssData from "@/data/rss-feeds.json";

const parser = new Parser();

interface RssFeed {
  meta: {
    publisher: string;
    image: string;
    pubDate: string;
    desc: string;
    url: string;
  };
  items: {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    isoDate: string;
  }[];
}

const mainUrl = (url: string) => {
  return new URL(url).origin;
};

export async function getRssFeed({ category = "world" }: { category: string }) {
  try {
    const urls = rssData.categories.find((c) => c.id === category)?.feeds || [];

    const feedPromises = urls.map((url) => parser.parseURL(url));
    const results = await Promise.allSettled(feedPromises);

    const sites: RssFeed[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        const feed = result.value;
        sites.push({
          meta: {
            publisher: feed.title || "Unknown Source",
            image:
              feed.image?.url ||
              `https://ui-avatars.com/api/?name=${feed.title || "Briefly"}&background=random&length=1`,
            pubDate: feed.pubDate || "",
            desc: feed.description || "",
            url: mainUrl(feed?.link || "") || "",
          },
          items: (
            feed.items
              ?.sort(
                (a, b) =>
                  new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime(),
              )
              .slice(0, 5) || []
          ).map((item) => ({
            title: item.title || "No title",
            link: item.link || "#",
            description: item.description || item.summary || "No description",
            pubDate: item.pubDate || "",
            isoDate: item.isoDate || new Date().toISOString(),
          })),
        });
      }
    });

    return sites;
  } catch (error) {
    console.error(`Error fetching RSS feed for category '${category}':`, error);
    return [];
  }
}
