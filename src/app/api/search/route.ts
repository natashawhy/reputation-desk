import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { filterAndRank } from "@/lib/sampleData";
import { SearchResponse } from "@/types/scandal";

const querySchema = z.object({
  q: z.string().optional().default(""),
  p: z.coerce.number().min(0).max(100).optional().default(50),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? "",
    p: searchParams.get("p") ?? "50",
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid query" }, { status: 400 });
  }
  const { q, p } = parsed.data;
  const results = filterAndRank(q, p);
  const payload: SearchResponse = {
    query: q,
    perspective: p,
    results,
  };
  return NextResponse.json(payload);
}
