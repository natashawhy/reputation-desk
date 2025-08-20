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
  let tilt = 0; // -100..+100
  // Simple heuristics to demonstrate perspective adjustments
  if (/(environment|climate|lgbt|pride|diversity|equity)/.test(t)) tilt -= 20;
  if (/(gun|border|police|patriot|prolife|2a|second amendment)/.test(t)) tilt += 20;
  if (/(abortion|planned parenthood)/.test(t)) tilt += 25;
  if (/(transgender|drag|inclusion)/.test(t)) tilt -= 25;
  return Math.max(-100, Math.min(100, tilt));
}

function baseScoreFromSignals(a: NewsArticle[]): number {
  // Start from 55 and scale by recency and number of corroborating sources
  let score = 55;
  const sources = new Set(a.map((x) => x.source.toLowerCase())).size;
  score += Math.min(10, (sources - 2) * 3);
  // Recent articles get a boost
  const mostRecent = a
    .map((x) => x.publishedAt ? Date.parse(x.publishedAt) : 0)
    .filter(Boolean)
    .sort((a, b) => b - a)[0];
  if (mostRecent) {
    const days = (Date.now() - mostRecent) / (1000 * 60 * 60 * 24);
    if (days < 14) score += 8; else if (days < 60) score += 4; else if (days < 180) score += 2;
  }
  return Math.max(30, Math.min(85, score));
}

function toScandalEvents(clusters: Map<string, NewsArticle[]>): ScandalEvent[] {
  const out: ScandalEvent[] = [];
  for (const [key, articles] of clusters) {
    const uniqueSources = new Set(articles.map((a) => a.source.toLowerCase()));
    if (uniqueSources.size < 2) continue; // require >= 2 sources for credibility

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
  // naive: take first 3 capitalized tokens as potential entity
  const tokens = title.split(/\s+/).filter((w) => /[A-Z][a-zA-Z\-]+/.test(w));
  return tokens.slice(0, 3).join(" ") || "Subject";
}

async function fetchNewsApi(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&pageSize=20&sortBy=publishedAt`;
  const res = await fetch(url, { headers: { "X-Api-Key": apiKey } });
  if (!res.ok) return [];
  const data: { articles?: Array<{ title?: string; description?: string; url: string; source?: { name?: string }; publishedAt?: string }> } = await res.json();
  const arts: NewsArticle[] = (data.articles || []).map((a) => ({
    title: a.title || "",
    description: a.description || "",
    url: a.url,
    source: a.source?.name || "Unknown",
    publishedAt: a.publishedAt,
  }));
  return arts;
}

async function fetchSerper(query: string): Promise<NewsArticle[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];
  const res = await fetch("https://google.serper.dev/news", {
    method: "POST",
    headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({ q: query, gl: "us", num: 20 }),
  });
  if (!res.ok) return [];
  const data: { news?: Array<{ title?: string; snippet?: string; link?: string; source?: string; date?: string }> } = await res.json();
  const items: NewsArticle[] = (data.news || []).map((n) => ({
    title: n.title || "",
    description: n.snippet || "",
    url: n.link || "",
    source: n.source || "Unknown",
    publishedAt: n.date ? new Date(n.date).toISOString() : undefined,
  }));
  return items;
}

export async function searchControversies(query: string): Promise<ScandalEvent[]> {
  const articles: NewsArticle[] = [
    ...(await fetchNewsApi(query)),
    ...(await fetchSerper(query)),
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
  const events = toScandalEvents(clusters)
    .sort((a, b) => (b.baseScore || 0) - (a.baseScore || 0))
    .slice(0, 10);
  return events;
}


