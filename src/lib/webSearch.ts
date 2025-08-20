import { ScandalEvent } from "@/types/scandal";

type NewsArticle = {
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt?: string;
};

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

function guessCategories(text: string): string[] {
  const t = text.toLowerCase();
  const cats = new Set<string>();
  if (/(ad|campaign|marketing|commercial|advert)/.test(t)) cats.add("advertising");
  if (/(donation|donated|pac|super pac|funded|sponsor|sponsorship)/.test(t)) cats.add("finance");
  if (/(labor|union|workers|strike|supply|factory|supplier)/.test(t)) cats.add("labor");
  if (/(privacy|data|breach|security|leak)/.test(t)) cats.add("privacy");
  if (/(tweet|post|comment|social|speech|offensive|backlash)/.test(t)) cats.add("social");
  if (cats.size === 0) cats.add("general");
  return Array.from(cats);
}

function guessIdeologicalTilt(text: string): number {
  const t = text.toLowerCase();
  let tilt = 0;
  if (/(environment|climate|lgbt|pride|diversity|equity)/.test(t)) tilt -= 20;
  if (/(gun|border|police|patriot|prolife|2a|second amendment)/.test(t)) tilt += 20;
  if (/(abortion|planned parenthood)/.test(t)) tilt += 25;
  if (/(transgender|drag|inclusion)/.test(t)) tilt -= 25;
  return Math.max(-100, Math.min(100, tilt));
}

function baseScoreFromSignals(a: NewsArticle[]): number {
  let score = 55;
  const sources = new Set(a.map((x) => x.source.toLowerCase())).size;
  score += Math.min(10, (sources - 2) * 3);
  const mostRecent = a
    .map((x) => (x.publishedAt ? Date.parse(x.publishedAt) : 0))
    .filter(Boolean)
    .sort((x, y) => y - x)[0];
  if (mostRecent) {
    const days = (Date.now() - mostRecent) / (1000 * 60 * 60 * 24);
    if (days < 14) score += 8;
    else if (days < 60) score += 4;
    else if (days < 180) score += 2;
  }
  return Math.max(30, Math.min(85, score));
}

function toScandalEvents(clusters: Map<string, NewsArticle[]>): ScandalEvent[] {
  const out: ScandalEvent[] = [];
  for (const [key, articles] of clusters) {
    const uniqueSources = new Set(articles.map((a) => a.source.toLowerCase()));
    if (uniqueSources.size < 2) continue;

    const top = articles[0];
    const description = top.description || top.title;
    const categories = guessCategories(top.title + " " + description);
    const baseScore = baseScoreFromSignals(articles);
    const ideologicalTilt = guessIdeologicalTilt(top.title + " " + description);
    out.push({
      id: `web-${Buffer.from(key).toString("base64").slice(0, 12)}`,
      entityName: extractEntityName(top.title),
      title: top.title,
      date: articles[0].publishedAt || new Date().toISOString(),
      description,
      categories,
      sources: articles.map((a) => ({ url: a.url, publisher: a.source, reliabilityScore: 75 })),
      baseScore,
      ideologicalTilt,
    });
  }
  return out;
}

function extractEntityName(title: string): string {
  const tokens = title.split(/\s+/).filter((w) => /[A-Z][a-zA-Z\-]+/.test(w));
  return tokens.slice(0, 3).join(" ") || "Subject";
}

async function fetchNewsApi(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=20&sortBy=publishedAt`;
  const res = await fetch(url, { headers: { "X-Api-Key": apiKey } });
  if (!res.ok) return [];
  const data: {
    articles?: Array<{
      title?: string;
      description?: string;
      url: string;
      source?: { name?: string };
      publishedAt?: string;
    }>;
  } = await res.json();
  const arts: NewsArticle[] = (data.articles || []).map((a) => ({
    title: a.title || "",
    description: a.description || "",
    url: a.url,
    source: a.source?.name || "Unknown",
    publishedAt: a.publishedAt,
  }));
  return arts;
}

async function fetchGoogleNewsRSS(query: string): Promise<NewsArticle[]> {
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": "ReputationDesk/1.0" } });
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.split("<item>").slice(1);
    const articles: NewsArticle[] = items.slice(0, 25).map((chunk) => {
      const title = matchTag(chunk, "title");
      const link = matchTag(chunk, "link");
      const pubDate = matchTag(chunk, "pubDate");
      let source = matchTag(chunk, "source") || "Google News";
      // If title contains " - Source" suffix, extract it
      const dashIdx = title.lastIndexOf(" - ");
      if (dashIdx > 0 && dashIdx < title.length - 3) {
        source = title.slice(dashIdx + 3).trim();
      }
      const cleanTitle = dashIdx > 0 ? title.slice(0, dashIdx).trim() : title;
      return {
        title: decodeEntities(cleanTitle),
        description: "",
        url: decodeEntities(link),
        source: decodeEntities(source),
        publishedAt: pubDate ? new Date(pubDate).toISOString() : undefined,
      };
    });
    return articles.filter((a) => a.title && a.url);
  } catch {
    return [];
  }
}

function matchTag(xmlChunk: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const m = xmlChunk.match(re);
  return m ? m[1].trim() : "";
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function singleSourceFallback(articles: NewsArticle[]): ScandalEvent[] {
  const dedup = new Map<string, NewsArticle>();
  for (const a of articles) {
    if (!a.title || !a.url) continue;
    const key = normalizeTitle(a.title);
    if (!dedup.has(key)) dedup.set(key, a);
  }
  return Array.from(dedup.values())
    .slice(0, 10)
    .map((a) => {
      const text = `${a.title} ${a.description ?? ""}`;
      return {
        id: `one-${Buffer.from(normalizeTitle(a.title)).toString("base64").slice(0, 12)}`,
        entityName: extractEntityName(a.title),
        title: a.title,
        date: a.publishedAt || new Date().toISOString(),
        description: a.description || a.title,
        categories: guessCategories(text),
        sources: [{ url: a.url, publisher: a.source, reliabilityScore: 70 }],
        baseScore: baseScoreFromSignals([a]),
        ideologicalTilt: guessIdeologicalTilt(text),
      };
    });
}
function singleSourceFallback(articles: NewsArticle[]): ScandalEvent[] {
  const dedup = new Map<string, NewsArticle>();
  for (const a of articles) {
    if (!a.title || !a.url) continue;
    const key = normalizeTitle(a.title);
    if (!dedup.has(key)) dedup.set(key, a);
  }
  return Array.from(dedup.values())
    .slice(0, 10)
    .map((a) => {
      const text = `${a.title} ${a.description ?? ""}`;
      return {
        id: `one-${Buffer.from(normalizeTitle(a.title)).toString("base64").slice(0, 12)}`,
        entityName: extractEntityName(a.title),
        title: a.title,
        date: a.publishedAt || new Date().toISOString(),
        description: a.description || a.title,
        categories: guessCategories(text),
        sources: [{ url: a.url, publisher: a.source, reliabilityScore: 70 }],
        baseScore: baseScoreFromSignals([a]),
        ideologicalTilt: guessIdeologicalTilt(text),
      };
    });
}
export async function searchControversies(query: string): Promise<ScandalEvent[]> {
  const articles: NewsArticle[] = [
    ...(await fetchNewsApi(query)),
    ...(await fetchGoogleNewsRSS(query)),
  ];
  if (articles.length === 0) return [];

  const clusters = new Map<string, NewsArticle[]>();
  for (const a of articles) {
    if (!a.title || !a.url) continue;
    const key = normalizeTitle(a.title);
    const list = clusters.get(key) || [];
    list.push(a);
    clusters.set(key, list);
  }

  let events = toScandalEvents(clusters);
  if (events.length === 0) {
    events = singleSourceFallback(articles);
  }

  return events.sort((a, b) => (b.baseScore || 0) - (a.baseScore || 0)).slice(0, 10);
}
