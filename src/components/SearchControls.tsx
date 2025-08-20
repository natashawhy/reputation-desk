'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Search } from 'lucide-react';
import { SearchResponse } from '@/types/scandal';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SearchControls() {
  const [query, setQuery] = useState('');
  const [perspective, setPerspective] = useState(50);

  const { data, isLoading, error } = useSWR<SearchResponse, Error>(
    `/api/search?q=${encodeURIComponent(query)}&p=${perspective}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    // debounce typing for better UX
    const t = setTimeout(() => setQuery(query), 150);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-stone-700 bg-stone-800/60 p-3">
        <label className="mb-2 block text-sm text-stone-300">Search a brand or person</label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              className="w-full rounded-md border border-stone-600 bg-stone-900/60 pl-9 pr-3 py-2 text-sm outline-none focus:border-amber-500"
              placeholder="e.g. Brand A or Public Figure B"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="w-60">
            <label className="mb-1 block text-xs text-stone-400">Perspective: Liberal ⟷ Conservative</label>
            <input
              type="range"
              min={0}
              max={100}
              value={perspective}
              onChange={(e) => setPerspective(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500"
            />
            <div className="text-right text-xs text-stone-400">{perspective}</div>
          </div>
        </div>
      </div>

      <ResultsPanel data={data} loading={isLoading} error={error ?? undefined} />
    </div>
  );
}

function ResultsPanel({ data, loading, error }: { data?: SearchResponse; loading: boolean; error?: Error }) {
  if (error) {
    return <div className="text-red-400">Error loading results</div>;
  }
  return (
    <div className="rounded-lg border border-stone-700 bg-stone-800/60">
      <div className="border-b border-stone-700 px-3 py-2 text-sm text-stone-300">Top-5 most scandalous (≥2 sources)</div>
      <div className="p-3">
        {loading && <div className="text-stone-400 text-sm">Loading…</div>}
        {!loading && data && data.results.length === 0 && (
          <div className="text-stone-400 text-sm">No results found.</div>
        )}
        {!loading && data && data.results.length > 0 && (
          <div className="space-y-3">
            {data.results.map(({ event, adjustedScore }) => (
              <div key={event.id} className="rounded-md border border-stone-700 bg-stone-900/40 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-medium text-stone-100">{event.title}</div>
                    <div className="text-xs text-stone-400">{event.entityName} • {new Date(event.date).toLocaleDateString()} • {event.categories.join(', ')}</div>
                    <p className="mt-2 text-sm text-stone-200">{event.description}</p>
                    <div className="mt-2 text-xs text-stone-400 space-x-2">
                      {event.sources.map((s, idx) => (
                        <a key={idx} href={s.url} target="_blank" className="underline decoration-dotted hover:text-amber-400">
                          {s.publisher}
                        </a>
                      ))}
                    </div>
                  </div>
                  <ScoreBadge score={adjustedScore} />
                </div>
                <ScoreBar score={adjustedScore} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 75 ? 'bg-red-600' : score >= 60 ? 'bg-amber-500' : 'bg-emerald-600';
  return (
    <div className={`rounded-md ${color} px-2 py-1 text-xs font-semibold text-white`}>Scandal {Math.round(score)}</div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const gradient =
    'bg-gradient-to-r from-emerald-600 via-amber-500 to-red-600';
  return (
    <div className="mt-3 h-2 w-full rounded bg-stone-700">
      <div className={"h-2 rounded " + gradient} style={{ width: pct + '%' }} />
    </div>
  );
}
