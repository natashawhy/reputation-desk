import { ScandalEvent } from "@/types/scandal";

// Demo dataset; in a real app this would be fetched from providers
export const SAMPLE_EVENTS: ScandalEvent[] = [
  {
    id: "evt-001",
    entityName: "Brand A",
    title: "Misleading Environmental Claims in Ad Campaign",
    date: "2023-05-14",
    description:
      "Brand A faced backlash for overstating the eco-friendliness of its products in a widely distributed campaign.",
    categories: ["advertising", "greenwashing"],
    sources: [
      { url: "https://newsroom.example.com/a", publisher: "Example News", reliabilityScore: 82 },
      { url: "https://investigate.example.org/a", publisher: "Investigate Org", reliabilityScore: 90 },
    ],
    baseScore: 62,
    ideologicalTilt: -20,
  },
  {
    id: "evt-002",
    entityName: "Public Figure B",
    title: "Donation to Politically Controversial PAC",
    date: "2024-01-08",
    description:
      "Public Figure B donated to a PAC associated with policies that are polarizing across the ideological spectrum.",
    categories: ["politics", "finance"],
    sources: [
      { url: "https://paper.example.net/b", publisher: "Daily Paper", reliabilityScore: 78 },
      { url: "https://records.example.gov/b", publisher: "Public Records", reliabilityScore: 95 },
    ],
    baseScore: 70,
    ideologicalTilt: 35,
  },
  {
    id: "evt-003",
    entityName: "Brand C",
    title: "Labor Practice Violations at Supplier",
    date: "2022-11-27",
    description:
      "Investigations revealed labor violations at a supplier facility within Brand C's supply chain.",
    categories: ["labor", "supply-chain"],
    sources: [
      { url: "https://globalwatch.example.com/c", publisher: "Global Watch", reliabilityScore: 88 },
      { url: "https://journal.example.com/c", publisher: "Investigative Journal", reliabilityScore: 84 },
    ],
    baseScore: 75,
    ideologicalTilt: -5,
  },
  {
    id: "evt-004",
    entityName: "Public Figure D",
    title: "Controversial Comments on Social Media",
    date: "2025-03-03",
    description:
      "A series of posts led to controversy and boycotts among certain audience segments.",
    categories: ["social", "speech"],
    sources: [
      { url: "https://platform.example/social-d", publisher: "Social Platform", reliabilityScore: 70 },
      { url: "https://factcheck.example/d", publisher: "FactCheck", reliabilityScore: 90 },
    ],
    baseScore: 55,
    ideologicalTilt: 50,
  },
  {
    id: "evt-005",
    entityName: "Brand E",
    title: "Data Privacy Breach Affecting Customers",
    date: "2023-09-16",
    description:
      "Data breach exposed user information due to inadequate security configurations.",
    categories: ["privacy", "security"],
    sources: [
      { url: "https://technews.example/e", publisher: "Tech News", reliabilityScore: 80 },
      { url: "https://regulator.example.gov/e", publisher: "Regulator", reliabilityScore: 92 },
    ],
    baseScore: 68,
    ideologicalTilt: 0,
  },
  {
    id: "evt-006",
    entityName: "Brand A",
    title: "Sponsorship of Polarizing Event",
    date: "2024-07-22",
    description:
      "Brand A sponsored an event that is positively received by conservatives but criticized by liberals.",
    categories: ["sponsorship", "politics"],
    sources: [
      { url: "https://localpaper.example/a", publisher: "Local Paper", reliabilityScore: 72 },
      { url: "https://ngo.example/a", publisher: "NGO Watch", reliabilityScore: 87 },
    ],
    baseScore: 58,
    ideologicalTilt: 60,
  },
];

export function filterAndRank(query: string, perspective: number) {
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = SAMPLE_EVENTS.filter((e) =>
    !normalizedQuery || e.entityName.toLowerCase().includes(normalizedQuery)
  );
  const results = filtered
    .map((event) => {
      const tilt = event.ideologicalTilt; // -100..+100
      const centerPerspective = perspective - 50; // -50..+50
      const alignment = (tilt / 100) * (centerPerspective / 50); // -1..+1
      const adjustment = alignment * 20; // up to +/-20 adjustment
      const credibilityBoost = Math.min(
        10,
        Math.max(0, event.sources.reduce((acc, s) => acc + s.reliabilityScore, 0) / 200)
      );
      const adjustedScore = Math.max(
        0,
        Math.min(100, event.baseScore + adjustment + credibilityBoost)
      );
      return { event, adjustedScore };
    })
    .sort((a, b) => b.adjustedScore - a.adjustedScore)
    .slice(0, 5);
  return results;
}
