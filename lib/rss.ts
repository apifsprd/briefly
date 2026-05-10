// lib/rss.ts
import Parser from "rss-parser";

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

const feedSources = {
  world: [
    "https://abcnews.com/abcnews/internationalheadlines",
    "https://www.aljazeera.com/xml/rss/all.xml",
    "http://rss.cnn.com/rss/edition_world.rss",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.france24.com/en/rss",
    "https://www.independent.co.uk/news/world/rss",
    "https://www.mirror.co.uk/news/world-news/?service=rss",
    "https://www.nytimes.com/svc/collections/v1/publish/https://www.nytimes.com/section/world/rss.xml",
    "https://feeds.skynews.com/feeds/rss/world.xml",
    "https://www.scmp.com/rss/91/feed/",
    "https://www.theguardian.com/international/rss",
    "https://www.thesun.co.uk/news/worldnews/feed/",
  ],
  football: [
    "https://feeds.bbci.co.uk/sport/football/rss.xml",
    "https://www.espn.com/espn/rss/soccer/news",
    "https://www.theguardian.com/football/rss",
    "https://talksport.com/football/feed/",
    "https://www.transfermarkt.co.uk/rss/news",
  ],
};

export async function getRssFeed({ category = "world" }: { category: string }) {
  try {
    const urls =
      feedSources[category as keyof typeof feedSources] || feedSources.world;

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
            url: feed.link || "",
          },
          items: (feed.items?.slice(0, 5) || []).map((item) => ({
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
