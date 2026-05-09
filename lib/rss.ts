// lib/rss.ts
import Parser from "rss-parser";

const parser = new Parser();

interface RssFeed {
  meta: {
    publisher: string;
    logo?: string; // Update the type of logo to allow for undefined
    pubDate: string;
    desc: string;
  };
  items: {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    image: string;
  }[];
}

export async function getRssFeed() {
  const newsSources = [
    "https://www.theguardian.com/international/rss",
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
  ];
  try {
    const news = await Promise.all(
      newsSources.map((url) => parser.parseURL(url)),
    );
    const sites: RssFeed[] = [];

    news.forEach((feed) => {
      sites.push({
        meta: {
          publisher: feed.title || "",
          image: feed.image?.url || "",
          pubDate: feed.pubDate,
          desc: feed.description || "",
        },
        items: feed.items.slice(0, 5),
      });
    });
    return sites;
  } catch (error) {
    console.error(`Error fetching RSS feed:`, error);
    return [];
  }
}
