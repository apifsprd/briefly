import type { RssItemNotSeparated } from "@/lib/rss";

export interface StoryArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  image?: string;
  sourceId: string;
  sourceName: string;
  sourceImage: string;
  sourceUrl: string;
  category: string;
  publishedAt: string;
}

export interface Story {
  id: string;
  slug: string;
  title: string;
  articles: StoryArticle[];
  category: string;
  sourceCount: number;
  articleCount: number;
  firstSeenAt: string;
  lastUpdatedAt: string;
  trendingScore: number;
  momentum: boolean;
  topics: string[];
}

const stopWords = new Set(
  "about after again against all also amid an and are around as at be been before being between both but by can could did do does for from had has have he her hers him his how if in into is it its may more most new no not of on one or other our out over said says she so some than that the their them then there these they this those through to up was we were what when where which while who will with would you your".split(
    " ",
  ),
);

export function cleanFeedText(value: string): string {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(value: string): string {
  return cleanFeedText(value)
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getKeywords(value: string): Set<string> {
  return new Set(
    normalizeTitle(value)
      .split(" ")
      .filter((word) => word.length > 2 && !stopWords.has(word)),
  );
}

function canonicalUrl(value: string): string {
  try {
    const url = new URL(value);
    url.hash = "";
    [...url.searchParams.keys()].forEach((key) => {
      if (/^(utm_|fbclid$|gclid$|mc_cid$|mc_eid$|ref$)/i.test(key)) {
        url.searchParams.delete(key);
      }
    });
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.trim();
  }
}

function hash(value: string): string {
  let result = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    result ^= value.charCodeAt(index);
    result = Math.imul(result, 16777619);
  }
  return (result >>> 0).toString(36);
}

function slugify(value: string): string {
  return normalizeTitle(value).replace(/\s+/g, "-").slice(0, 72) || "story";
}

function dateValue(value: string): number {
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function titleSimilarity(left: string, right: string): number {
  const leftWords = getKeywords(left);
  const rightWords = getKeywords(right);
  if (leftWords.size === 0 || rightWords.size === 0) return 0;

  let shared = 0;
  leftWords.forEach((word) => {
    if (rightWords.has(word)) shared += 1;
  });
  const jaccard = shared / (leftWords.size + rightWords.size - shared);
  const containment = shared / Math.min(leftWords.size, rightWords.size);
  return Math.max(jaccard, containment * 0.72);
}

function normalizeArticles(items: RssItemNotSeparated[]): StoryArticle[] {
  const seenUrls = new Set<string>();
  const seenSourceTitles = new Set<string>();

  return items.flatMap((item) => {
    const title = cleanFeedText(item.title);
    const url = item.link.trim();
    if (!title || !/^https?:\/\//i.test(url) || url.endsWith("#")) return [];

    const normalizedUrl = canonicalUrl(url);
    const sourceName = item.publisher || "Unknown source";
    const sourceId = normalizeTitle(sourceName) || sourceName.toLowerCase();
    const titleKey = `${sourceId}|${normalizeTitle(title)}`;
    if (seenUrls.has(normalizedUrl) || seenSourceTitles.has(titleKey))
      return [];
    seenUrls.add(normalizedUrl);
    seenSourceTitles.add(titleKey);

    return [
      {
        id: hash(normalizedUrl),
        title,
        description: cleanFeedText(item.description || "").slice(0, 500),
        url,
        image: item.image,
        sourceId,
        sourceName,
        sourceImage: item.publisherImage,
        sourceUrl: item.publisherUrl,
        category: item.category || "world",
        publishedAt: item.isoDate || "",
      },
    ];
  });
}

function makeStory(articles: StoryArticle[]): Story {
  const ordered = [...articles].sort(
    (left, right) => dateValue(right.publishedAt) - dateValue(left.publishedAt),
  );
  const lead = ordered[0];
  const dated = ordered
    .map((article) => article.publishedAt)
    .filter((value) => dateValue(value) > 0);
  const topics = [
    ...getKeywords(ordered.map((article) => article.title).join(" ")),
  ]
    .sort((left, right) => left.localeCompare(right))
    .slice(0, 8);
  const id = hash(
    `${lead.category}|${
      [...articles].sort((left, right) => left.url.localeCompare(right.url))[0]
        .id
    }`,
  );
  const ageHours = dated.length
    ? Math.max(0, (Date.now() - dateValue(lead.publishedAt)) / 3_600_000)
    : 72;
  const momentum =
    ordered.length > 1 &&
    ageHours < 6 &&
    new Set(ordered.map((article) => article.sourceId)).size > 1;
  const trendingScore =
    (ordered.length * 0.7 +
      new Set(ordered.map((article) => article.sourceId)).size) /
    (1 + ageHours / 12);

  return {
    id,
    slug: `${slugify(lead.title)}-${id}`,
    title: lead.title,
    articles: ordered,
    category: lead.category,
    sourceCount: new Set(ordered.map((article) => article.sourceId)).size,
    articleCount: ordered.length,
    firstSeenAt: dated.length ? dated[dated.length - 1] : "",
    lastUpdatedAt: dated[0] || "",
    trendingScore,
    momentum,
    topics,
  };
}

export function clusterStories(items: RssItemNotSeparated[]): Story[] {
  const articles = normalizeArticles(items).sort(
    (left, right) => dateValue(right.publishedAt) - dateValue(left.publishedAt),
  );
  const clusters: StoryArticle[][] = [];

  articles.forEach((article) => {
    const articleDate = dateValue(article.publishedAt);
    let bestCluster: StoryArticle[] | undefined;
    let bestSimilarity = 0;

    clusters.forEach((cluster) => {
      const representative = cluster[0];
      if (representative.category !== article.category) return;
      const representativeDate = dateValue(representative.publishedAt);
      if (
        articleDate &&
        representativeDate &&
        Math.abs(articleDate - representativeDate) > 36 * 3_600_000
      ) {
        return;
      }

      const similarity = titleSimilarity(article.title, representative.title);
      const articleKeywords = getKeywords(article.title);
      const representativeKeywords = getKeywords(representative.title);
      const sharedKeywords = [...articleKeywords].filter((word) =>
        representativeKeywords.has(word),
      ).length;
      const nearExactTitle =
        normalizeTitle(article.title) === normalizeTitle(representative.title);
      if (
        (nearExactTitle || (sharedKeywords >= 2 && similarity >= 0.25)) &&
        similarity > bestSimilarity
      ) {
        bestCluster = cluster;
        bestSimilarity = similarity;
      }
    });

    if (bestCluster) bestCluster.push(article);
    else clusters.push([article]);
  });

  return clusters
    .map(makeStory)
    .sort(
      (left, right) =>
        dateValue(right.lastUpdatedAt) - dateValue(left.lastUpdatedAt) ||
        right.trendingScore - left.trendingScore,
    );
}

export function searchStories(stories: Story[], query: string): Story[] {
  const terms = new Set(
    normalizeTitle(query)
      .split(" ")
      .filter((word) => word.length > 1 && !stopWords.has(word)),
  );
  if (terms.size === 0) return [];

  return stories
    .map((story) => {
      const searchableWords = new Set(
        normalizeTitle(
          [
            story.title,
            story.category,
            story.topics.join(" "),
            ...story.articles.flatMap((article) => [
              article.title,
              article.description,
              article.sourceName,
            ]),
          ].join(" "),
        ).split(" "),
      );
      const matches = [...terms].filter((term) =>
        searchableWords.has(term),
      ).length;
      return { story, matches };
    })
    .filter((item) => item.matches > 0)
    .sort((left, right) => right.matches - left.matches)
    .map((item) => item.story);
}

export function getRelatedStories(story: Story, stories: Story[]): Story[] {
  return stories
    .filter((candidate) => candidate.id !== story.id)
    .map((candidate) => {
      const sharedTopics = candidate.topics.filter((topic) =>
        story.topics.includes(topic),
      ).length;
      const sameCategory = candidate.category === story.category ? 1 : 0;
      return { story: candidate, score: sharedTopics + sameCategory * 0.5 };
    })
    .filter((candidate) => candidate.score >= 1)
    .sort((left, right) => right.score - left.score)
    .slice(0, 4)
    .map((candidate) => candidate.story);
}
