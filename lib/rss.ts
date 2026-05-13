import Parser from "rss-parser";
import rssData from "@/data/rss.json";

const parser = new Parser();

export interface RssFeed {
  meta: {
    publisher: string;
    image: string;
    pubDate?: string;
    desc?: string;
    url: string;
  };
  items: {
    title: string;
    link: string;
    description: string;
    pubDate: string;
    isoDate: string;
    image?: string;
  }[];
}

const extractImageFromItem = (item: any): string | undefined => {
  // 1. Check enclosures (media attachments)
  if (item.enclosures && item.enclosures.length > 0) {
    const imageEnclosure = item.enclosures.find(
      (enc: any) => enc.type && enc.type.startsWith("image/"),
    );
    if (imageEnclosure?.url) {
      return imageEnclosure.url;
    }
  }

  // 2. Check media namespace (media:content, media:thumbnail)
  if (item.media) {
    if (item.media.content && Array.isArray(item.media.content)) {
      const imageMedia = item.media.content.find(
        (content: any) => content.medium === "image",
      );
      if (imageMedia?.url) {
        return imageMedia.url;
      }
    }
    if (item.media.thumbnail && Array.isArray(item.media.thumbnail)) {
      return item.media.thumbnail[0]?.url;
    }
  }

  // 3. Parse image from HTML description
  if (item.description || item.content) {
    const htmlContent = item.description || item.content;
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/;
    const match = htmlContent.match(imgRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 4. Check content:encoded (Wordpress RSS)
  if (item["content:encoded"]) {
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/;
    const match = item["content:encoded"].match(imgRegex);
    if (match && match[1]) {
      return match[1];
    }
  }

  return undefined;
};

const mainUrl = (url: string) => {
  return new URL(url).origin;
};

export async function getRssFeed({ category = "world" }: { category: string }) {
  try {
    const feeds =
      rssData.categories.find((c) => c.id === category)?.feeds || [];
    const sortedFeeds = feeds.sort((a, b) => a.name.localeCompare(b.name));

    const feedPromises = sortedFeeds.map((feed) =>
      parser
        .parseURL(feed?.url)
        .then((result) => ({ result, feedName: feed.name })),
    );
    const results = await Promise.allSettled(feedPromises);

    const sites: RssFeed[] = [];

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        const { result: feed, feedName } = result.value;
        sites.push({
          meta: {
            publisher: feedName || "Unknown Source",
            image:
              feed.image?.url ||
              `https://ui-avatars.com/api/?name=${feedName || "Briefly"}&background=random&length=${feedName.split(" ").length}`,
            pubDate: feed.pubDate || "",
            desc: feed.description || feed.title || "",
            url: mainUrl(feed?.link || "") || "",
          },
          items: (
            feed.items
              ?.sort((a, b) => {
                const dateB = new Date(b.isoDate ?? "").getTime();
                const dateA = new Date(a.isoDate ?? "").getTime();
                return dateB - dateA;
              })
              .slice(0, 5) || []
          ).map((item) => ({
            title: item.title || "No title",
            link: item.link || "#",
            description:
              item.description || item.summary || item.contentSnippet,
            pubDate: item.pubDate || "",
            isoDate: item.isoDate || new Date().toISOString(),
            image: extractImageFromItem(item),
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

export async function getLatestFeedFromAllSources() {
  try {
    const feedPromises = rssData.categories
      .flatMap((category) => category.feeds)
      .map((feed) =>
        parser.parseURL(feed.url).then((result) => {
          return {
            result,
            feedName: feed.name,
          };
        }),
      );

    const response = await Promise.allSettled(feedPromises);

    const sites: RssFeed[] = [];

    response.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        const { result: feed, feedName } = result.value;
        const items = (
          feed.items
            ?.sort((a, b) => {
              const dateB = new Date(b.isoDate ?? "").getTime();
              const dateA = new Date(a.isoDate ?? "").getTime();
              return dateB - dateA;
            })
            .slice(0, 1) || []
        ).map((item) => ({
          title: item.title || "No title",
          link: item.link || "#",
          description:
            item.description || item.summary || item.contentSnippet || "",
          pubDate: item.pubDate || "",
          isoDate: item.isoDate || new Date().toISOString(),
          image: extractImageFromItem(item),
        }));

        if (items.length > 0) {
          sites.push({
            meta: {
              publisher: feedName || "Unknown Source",
              image:
                feed.image?.url ||
                `https://ui-avatars.com/api/?name=${feedName || "Briefly"}&background=random&length=${feedName.split(" ").length}`,
              url: mainUrl(feed?.link || "") || "",
            },
            items,
          });
        }
      }
    });

    // Sort by latest isoDate (descending - newest first)
    const sortedByLatestItem = sites.sort((a, b) => {
      const dateB = new Date(b.items[0]?.isoDate ?? 0).getTime();
      const dateA = new Date(a.items[0]?.isoDate ?? 0).getTime();
      return dateB - dateA;
    });

    const hero = sortedByLatestItem.slice(0, 4);
    const aside = sortedByLatestItem.slice(4, 10);

    return { hero, aside };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return { hero: [], aside: [] };
  }
}

export async function getLatestFeedPerCategory() {}
