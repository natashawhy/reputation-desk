import { ScandalEvent } from "@/types/scandal";

type NewsArticle = {
  title: string;
  description?: string;
  url: string;
  source: string;
  publishedAt?: string;
  language?: string;
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

// NEW: Better scandal detection
function isScandalousContent(text: string): boolean {
  const t = text.toLowerCase();
  
  // Controversial keywords that indicate scandal
  const scandalKeywords = [
    'scandal', 'controversy', 'backlash', 'outrage', 'protest', 'boycott',
    'lawsuit', 'investigation', 'allegations', 'accusations', 'misconduct',
    'violation', 'breach', 'leak', 'exposed', 'revealed', 'whistleblower',
    'resignation', 'fired', 'suspended', 'penalty', 'fine', 'settlement',
    'crisis', 'emergency', 'recall', 'defective', 'unsafe', 'harmful',
    'discrimination', 'harassment', 'racism', 'sexism', 'bias', 'prejudice',
    'corruption', 'bribery', 'fraud', 'embezzlement', 'tax evasion',
    'environmental damage', 'pollution', 'climate denial', 'greenwashing'
  ];
  
  return scandalKeywords.some(keyword => t.includes(keyword));
}

// NEW: Enhanced scoring for scandalous content
function baseScoreFromSignals(a: NewsArticle[]): number {
  let score = 55;
  
  // Boost score for scandalous content
  const allText = a.map(article => `${article.title} ${article.description || ''}`).join(' ');
  if (isScandalousContent(allText)) {
    score += 25; // Significant boost for scandalous content
  }
  
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
  
  return Math.max(30, Math.min(100, score));
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

// NEW: Language-specific news sources
const LANGUAGE_SOURCES = {
  es: {
    name: "Spanish",
    sources: [
      "El País",
      "El Mundo",
      "ABC",
      "La Vanguardia",
      "El Periódico",
      "20 Minutos",
      "El Confidencial",
      "Público"
    ]
  },
  ru: {
    name: "Russian", 
    sources: [
      "Российская газета",
      "Известия",
      "Коммерсантъ",
      "Ведомости",
      "РБК",
      "Интерфакс",
      "ТАСС",
      "РИА Новости"
    ]
  },
  fr: {
    name: "French",
    sources: [
      "Le Monde",
      "Le Figaro", 
      "Libération",
      "L'Équipe",
      "Le Parisien",
      "L'Humanité",
      "Les Échos",
      "Le Point"
    ]
  }
};

async function fetchNewsApi(query: string, language?: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_KEY;
  if (!apiKey) return [];
  
  const langParam = language ? `&language=${language}` : "&language=en";
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}${langParam}&pageSize=20&sortBy=publishedAt`;
  
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
    language: language || "en"
  }));
  
  return arts;
}

async function fetchGoogleNewsRSS(query: string, language?: string): Promise<NewsArticle[]> {
  const langCode = language || "en";
  const countryCode = language === "es" ? "ES" : language === "ru" ? "RU" : language === "fr" ? "FR" : "US";
  
  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${langCode}-${countryCode}&gl=${countryCode}&ceid=${countryCode}:${langCode}`;
  
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
        language: language || "en"
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

export async function searchControversies(query: string, language?: string): Promise<ScandalEvent[]> {
  const articles: NewsArticle[] = [
    ...(await fetchNewsApi(query, language)),
    ...(await fetchGoogleNewsRSS(query, language)),
  ];
  
  if (articles.length === 0) return [];

  // NEW: Pre-filter for scandalous content
  const scandalousArticles = articles.filter(article => {
    const text = `${article.title} ${article.description || ''}`;
    return isScandalousContent(text);
  });

  // If we have scandalous articles, use those; otherwise fall back to all articles
  const articlesToProcess = scandalousArticles.length > 0 ? scandalousArticles : articles;

  const clusters = new Map<string, NewsArticle[]>();
  for (const a of articlesToProcess) {
    if (!a.title || !a.url) continue;
    const key = normalizeTitle(a.title);
    const list = clusters.get(key) || [];
    list.push(a);
    clusters.set(key, list);
  }

  let events = toScandalEvents(clusters);
  if (events.length === 0) {
    events = singleSourceFallback(articlesToProcess);
  }

  // NEW: Sort by scandal score first, then by base score
  return events
    .sort((a, b) => {
      // Prioritize scandalous content
      const aScandalous = isScandalousContent(`${a.title} ${a.description}`);
      const bScandalous = isScandalousContent(`${b.title} ${b.description}`);
      
      if (aScandalous && !bScandalous) return -1;
      if (!aScandalous && bScandalous) return 1;
      
      // Then sort by score
      return (b.baseScore || 0) - (a.baseScore || 0);
    })
    .slice(0, 10);
}

// NEW: Language-specific search function
export async function searchControversiesByLanguage(query: string, language: string): Promise<ScandalEvent[]> {
  if (!LANGUAGE_SOURCES[language as keyof typeof LANGUAGE_SOURCES]) {
    return searchControversies(query); // Fallback to default search
  }
  
  return searchControversies(query, language);
}
