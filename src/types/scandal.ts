export type SourceLink = {
  url: string;
  publisher: string;
  reliabilityScore: number; // 0-100
};

export type ScandalEvent = {
  id: string;
  entityName: string; // brand or person
  title: string;
  date: string; // ISO
  description: string;
  categories: string[];
  sources: SourceLink[]; // should be >= 2 for verified credibility
  baseScore: number; // 0-100 baseline scandal rating
  ideologicalTilt: number; // -100 (more scandalous to liberals) .. +100 (more scandalous to conservatives)
};

export type SearchResponse = {
  query: string;
  perspective: number; // 0 liberal .. 100 conservative
  results: Array<{
    event: ScandalEvent;
    adjustedScore: number;
  }>;
};
