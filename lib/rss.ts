import Parser from "rss-parser";
import rssData from "@/data/rss.json";
import { validateImageUrl } from "./utils";

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

export interface RssItemNotSeparated {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  isoDate: string;
  image?: string;
  publisher: string;
  publisherImage: string;
  publisherUrl: string;
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

const convertPubDateToIsoDate = (pubDate: string): string => {
  try {
    // If pubDate is empty or undefined, return current date in ISO format
    if (!pubDate) {
      return new Date().toISOString();
    }

    // Convert to Date object and then to ISO string
    const date = new Date(pubDate);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return new Date().toISOString();
    }

    return date.toISOString();
  } catch (error) {
    console.error(`Error converting pubDate "${pubDate}" to ISO date:`, error);
    return new Date().toISOString();
  }
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
                const dateB = new Date(
                  b.isoDate ?? convertPubDateToIsoDate(b.pubDate || ""),
                ).getTime();
                const dateA = new Date(
                  a.isoDate ?? convertPubDateToIsoDate(a.pubDate || ""),
                ).getTime();
                return dateB - dateA;
              })
              .slice(0, 5) || []
          ).map((item) => ({
            title: item.title || "No title",
            link: item.link || "#",
            description:
              item.description || item.summary || item.contentSnippet,
            pubDate: item.pubDate || "",
            isoDate:
              item.isoDate || convertPubDateToIsoDate(item.pubDate || ""),
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

    // Get latest item from each feed
    const allItems: Array<{
      title: string;
      link: string;
      description: string;
      pubDate: string;
      isoDate: string;
      image?: string;
      publisher: string;
      publisherImage: string;
      publisherUrl: string;
    }> = [];

    response.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        const { result: feed, feedName } = result.value;

        // Take only the first item (already sorted by feed parser)
        const latestItem = feed.items?.[0];

        if (latestItem) {
          allItems.push({
            title: latestItem.title || "No title",
            link: latestItem.link || "#",
            description:
              latestItem.description ||
              latestItem.summary ||
              latestItem.contentSnippet ||
              "",
            pubDate: latestItem.pubDate || "",
            isoDate:
              latestItem.isoDate ||
              convertPubDateToIsoDate(latestItem.pubDate || ""),
            image: extractImageFromItem(latestItem),
            publisher: feedName || "Unknown Source",
            publisherImage:
              feed.image?.url ||
              `https://ui-avatars.com/api/?name=${feedName || "Briefly"}&background=random&length=${feedName.split(" ").length}`,
            publisherUrl: mainUrl(feed?.link || "") || "",
          });
        }
      }
    });

    // Sort globally by isoDate (newest first)
    const sortedItems = allItems.sort((a, b) => {
      const dateB = new Date(
        b.isoDate ?? convertPubDateToIsoDate(b.pubDate || ""),
      ).getTime();
      const dateA = new Date(
        a.isoDate ?? convertPubDateToIsoDate(a.pubDate || ""),
      ).getTime();
      return dateB - dateA;
    });

    // Split into hero (4) and aside (6)
    const hero = sortedItems.slice(0, 4);
    const aside = sortedItems.slice(4, 10);

    return { hero, aside };
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return { hero: [], aside: [] };
  }
}

export async function getLatestNewsFromAllCategories() {
  try {
    const categoryPromises = rssData.categories.map((category) =>
      getRssFeed({ category: category.id }).then((feeds) => ({
        categoryId: category.id,
        categoryName: category.name,
        feeds,
      })),
    );

    const results = await Promise.allSettled(categoryPromises);

    const categorizedFeeds: Record<
      string,
      {
        name: string;
        items: {
          title: string;
          link: string;
          description: string;
          pubDate: string;
          isoDate: string;
          image?: string;
          publisher: string;
          publisherImage: string;
          publisherUrl: string;
        }[];
      }
    > = {};

    results.forEach((result) => {
      if (result.status === "fulfilled" && result.value) {
        const { categoryId, categoryName, feeds } = result.value;

        // Flatten all items from all feeds in this category
        const allItems = feeds.flatMap((feed) =>
          feed.items.map((item) => ({
            ...item,
            publisher: feed.meta.publisher,
            publisherImage: feed.meta.image,
            publisherUrl: feed.meta.url,
          })),
        );

        // Sort by isoDate (newest first) and get top 5
        const topItems = allItems
          .sort((a, b) => {
            const dateB = new Date(
              b.isoDate ?? convertPubDateToIsoDate(b.pubDate || ""),
            ).getTime();
            const dateA = new Date(
              a.isoDate ?? convertPubDateToIsoDate(a.pubDate || ""),
            ).getTime();
            return dateB - dateA;
          })
          .slice(0, 5);

        categorizedFeeds[categoryId] = {
          name: categoryName,
          items: topItems,
        };
      }
    });

    return categorizedFeeds;
  } catch (error) {
    console.error("Error fetching latest news from all categories:", error);
    return {};
  }
}
