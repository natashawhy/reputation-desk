import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { filterAndRank } from "@/lib/sampleData";
import { SearchResponse, ScandalEvent } from "@/types/scandal";
import { searchControversies, searchControversiesByLanguage } from "@/lib/webSearch";

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

const querySchema = z.object({
  q: z.string().optional().default(""),
  p: z.coerce.number().min(0).max(100).optional().default(50),
  lang: z.string().optional().default("en"), // NEW: Language parameter
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    p: searchParams.get("p") ?? "50",
    lang: searchParams.get("lang") ?? "en", // NEW: Parse language parameter
  });
  
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  
  const { q, p, lang } = parsed.data;
  
  // Try live web search with language support; fallback to local sample
  let events: ScandalEvent[] = [];
  try {
    if (q) {
      if (lang && lang !== "en") {
        // Use language-specific search
        events = await searchControversiesByLanguage(q, lang);
      } else {
        // Use default search
        events = await searchControversies(q);
      }
    }
  } catch {
    // ignore and fallback
  }
  
  let results;
  if (events.length > 0) {
    // IMPROVED: Better perspective adjustment calculation
    const centerPerspective = p - 50; // -50..+50
    results = events
      .map((event) => {
        const tilt = event.ideologicalTilt; // -100..+100
        
        // Enhanced perspective adjustment based on ideological alignment
        let adjustment = 0;
        
        if (centerPerspective !== 0 && tilt !== 0) {
          // Calculate how much the user's perspective aligns with the event's tilt
          const alignment = (tilt / 100) * (centerPerspective / 50); // -1..+1
          
          // More dramatic adjustment for stronger ideological differences
          if (Math.abs(alignment) > 0.5) {
            adjustment = alignment * 30; // Up to +/-30 for strong alignment
          } else {
            adjustment = alignment * 20; // Up to +/-20 for moderate alignment
          }
          
          // Add bonus for events that strongly align with user's perspective
          if (Math.abs(alignment) > 0.7) {
            adjustment += Math.sign(alignment) * 10; // Extra 10 points for strong alignment
          }
        }
        
        // Credibility boost from multiple reliable sources
        const credibilityBoost = Math.min(
          15, // Increased from 10
          Math.max(0, event.sources.reduce((acc, s) => acc + s.reliabilityScore, 0) / 200)
        );
        
        const adjustedScore = Math.max(
          0,
          Math.min(100, (event.baseScore || 55) + adjustment + credibilityBoost)
        );
        
        return { event, adjustedScore };
      })
      .sort((a, b) => b.adjustedScore - a.adjustedScore)
      .slice(0, 5);
  } else {
    results = filterAndRank(q, p);
  }
  
  const payload: SearchResponse = {
    query: q,
    perspective: p,
    language: lang, // NEW: Include language in response
    results,
  };
  
  return NextResponse.json(payload);
}
