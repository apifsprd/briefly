import Parser from "rss-parser";
import rssData from "@/data/rss.json";

const parser = new Parser({ timeout: 10000 });

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
  category?: string;
}

type FeedCacheEntry = { expiresAt: number; value: Promise<RssFeed[]> };
const globalForRss = globalThis as typeof globalThis & {
  brieflyFeedCache?: Map<string, FeedCacheEntry>;
};
const feedCache = (globalForRss.brieflyFeedCache ??= new Map<
  string,
  FeedCacheEntry
>());
const feedCacheDuration = 60 * 60 * 1000;

type FeedRecord = Record<string, unknown>;

const asRecord = (value: unknown): FeedRecord | undefined =>
  typeof value === "object" && value !== null
    ? (value as FeedRecord)
    : undefined;

const safeImageUrl = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? value
      : undefined;
  } catch {
    return undefined;
  }
};

const extractImageFromItem = (item: unknown): string | undefined => {
  const record = asRecord(item);
  if (!record) return undefined;

  const enclosures = Array.isArray(record.enclosures) ? record.enclosures : [];
  const enclosure = enclosures
    .map(asRecord)
    .find(
      (value) =>
        typeof value?.type === "string" &&
        value.type.startsWith("image/") &&
        typeof value.url === "string",
    );
  const enclosureUrl = safeImageUrl(enclosure?.url);
  if (enclosureUrl) return enclosureUrl;

  const media = asRecord(record.media);
  const content = Array.isArray(media?.content) ? media.content : [];
  const mediaImage = content
    .map(asRecord)
    .find(
      (value) => value?.medium === "image" && typeof value.url === "string",
    );
  const mediaUrl = safeImageUrl(mediaImage?.url);
  if (mediaUrl) return mediaUrl;

  const thumbnails = Array.isArray(media?.thumbnail) ? media.thumbnail : [];
  const thumbnail = asRecord(thumbnails[0]);
  const thumbnailUrl = safeImageUrl(thumbnail?.url);
  if (thumbnailUrl) return thumbnailUrl;

  const description =
    typeof record.description === "string"
      ? record.description
      : typeof record.content === "string"
        ? record.content
        : typeof record["content:encoded"] === "string"
          ? record["content:encoded"]
          : "";
  const match = description.match(/<img[^>]+src=["']([^"']+)["']/i);
  return safeImageUrl(match?.[1]);
};

const convertPubDateToIsoDate = (pubDate: string): string => {
  try {
    if (!pubDate) return "";

    // Convert to Date object and then to ISO string
    const date = new Date(pubDate);

    if (Number.isNaN(date.getTime())) return "";

    return date.toISOString();
  } catch (error) {
    console.error(`Error converting pubDate "${pubDate}" to ISO date:`, error);
    return "";
  }
};

const mainUrl = (url: string) => {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
};

const publisherImage = (image: string | undefined, name: string) =>
  safeImageUrl(image) ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Briefly")}&background=random&length=${(name || "Briefly").split(" ").length}`;

async function fetchRssFeed({ category }: { category: string }) {
  try {
    const feeds =
      rssData.categories.find((c) => c.id === category)?.feeds || [];
    const sortedFeeds = [...feeds].sort((a, b) => a.name.localeCompare(b.name));

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
            image: publisherImage(feed.image?.url, feedName),
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
              .slice(0, 12) || []
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

export async function getRssFeed({ category = "world" }: { category: string }) {
  const cached = feedCache.get(category);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  const value = fetchRssFeed({ category });
  feedCache.set(category, {
    expiresAt: Date.now() + feedCacheDuration,
    value,
  });

  const feeds = await value;
  if (feeds.length === 0 && feedCache.get(category)?.value === value) {
    feedCache.delete(category);
  }
  return feeds;
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
            publisherImage: publisherImage(feed.image?.url, feedName),
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

export async function getAllArticlesFromAllCategories() {
  const results = await Promise.allSettled(
    rssData.categories.map(async (category) => ({
      category: category.id,
      feeds: await getRssFeed({ category: category.id }),
    })),
  );

  return results.flatMap((result) =>
    result.status === "fulfilled"
      ? result.value.feeds.flatMap((feed) =>
          feed.items.map((item) => ({
            ...item,
            publisher: feed.meta.publisher,
            publisherImage: feed.meta.image,
            publisherUrl: feed.meta.url,
            category: result.value.category,
          })),
        )
      : [],
  );
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
