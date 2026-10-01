import rssData from "@/data/rss.json";
import { getAllArticlesFromAllCategories, getRssFeed } from "@/lib/rss";
import { clusterStories, type Story } from "@/lib/stories";

export const newsCategories = rssData.categories.map(({ id, name }) => ({
  id,
  name,
}));

export function getNewsCategory(categoryId: string) {
  return newsCategories.find((category) => category.id === categoryId);
}

export async function getStories(categoryId?: string): Promise<Story[]> {
  if (!categoryId) {
    return clusterStories(await getAllArticlesFromAllCategories());
  }

  const feeds = await getRssFeed({ category: categoryId });
  const articles = feeds.flatMap((feed) =>
    feed.items.map((item) => ({
      ...item,
      publisher: feed.meta.publisher,
      publisherImage: feed.meta.image,
      publisherUrl: feed.meta.url,
      category: categoryId,
    })),
  );
  return clusterStories(articles);
}
