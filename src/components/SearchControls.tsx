'use client';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { Search, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import { SearchResponse } from '@/types/scandal';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function SearchControls() {
  const [input, setInput] = useState('');
  const [query, setQuery] = useState('');
  const [perspective, setPerspective] = useState(50);

  const { data, isLoading, error } = useSWR<SearchResponse, Error>(
    `/api/search?q=${encodeURIComponent(query)}&p=${perspective}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    const t = setTimeout(() => setQuery(input.trim()), 300);
    return () => clearTimeout(t);
  }, [input]);

  return (
    <div className="space-y-6">
      {/* Investigation Search Panel */}
      <div className="rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-stone-50 p-6 shadow-lg">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-stone-800 mb-2">🔍 Investigation Search</h2>
          <p className="text-stone-600 text-sm">Search for brands, public figures, or organizations to investigate their controversy history</p>
        </div>
        
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">Target Entity</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600" />
              <input
                className="w-full rounded-lg border-2 border-amber-200 bg-white/80 pl-12 pr-4 py-3 text-base outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all"
                placeholder="e.g., 'Brand A', 'Public Figure B', or 'Organization C'"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </div>
          
          {/* Perspective Slider */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-stone-700">Investigation Perspective</label>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-600">
                <span>Liberal Lens</span>
                <span>Neutral</span>
                <span>Conservative Lens</span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={perspective}
                  onChange={(e) => setPerspective(parseInt(e.target.value, 10))}
                  className="w-full h-3 bg-gradient-to-r from-blue-200 via-stone-200 to-red-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="text-center mt-2">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-red-100 text-stone-700 border border-stone-200">
                    Perspective: {perspective}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Panel */}
      <ResultsPanel data={data} loading={isLoading} error={error ?? undefined} perspective={perspective} />
    </div>
  );
}

function ResultsPanel({ data, loading, error, perspective }: { 
  data?: SearchResponse; 
  loading: boolean; 
  error?: Error;
  perspective: number;
}) {
  if (error) {
    return (
      <div className="rounded-xl border-2 border-red-300 bg-red-50 p-6 text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-3" />
        <div className="text-red-700 font-semibold">Investigation Error</div>
        <div className="text-red-600 text-sm">Unable to load results. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-amber-300 bg-white/80 shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-100 to-stone-100 border-b-2 border-amber-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-amber-700" />
          <span className="text-lg font-bold text-stone-800">Investigation Results</span>
          {perspective !== 50 && (
            <span className="ml-auto text-sm text-stone-600">
              {perspective < 50 ? 'Liberal' : 'Conservative'} perspective applied
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <div className="text-stone-600 font-medium">Investigating...</div>
            <div className="text-stone-500 text-sm">Searching through sources and analyzing credibility</div>
          </div>
        )}
        
        {!loading && data && data.results.length === 0 && (
          <div className="text-center py-8">
            <Search className="h-12 w-12 text-stone-400 mx-auto mb-4" />
            <div className="text-stone-600 font-medium">No controversies found</div>
            <div className="text-stone-500 text-sm">Try searching for a different entity or check spelling</div>
          </div>
        )}
        
        {!loading && data && data.results.length > 0 && (
          <div className="space-y-4">
            <div className="text-sm text-stone-600 mb-4">
              Found {data.results.length} controversy{data.results.length !== 1 ? 'ies' : ''} 
              {perspective !== 50 && ` (adjusted for ${perspective < 50 ? 'liberal' : 'conservative'} perspective)`}
            </div>
            
            {data.results.map(({ event, adjustedScore }) => (
              <div key={event.id} className="rounded-lg border-2 border-stone-200 bg-gradient-to-r from-stone-50 to-white p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-stone-800">{event.title}</h3>
                      <div className="flex gap-1">
                        {event.categories.map((cat, idx) => (
                          <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-sm text-stone-600 mb-2">
                      <span className="font-medium">{event.entityName}</span> • {new Date(event.date).toLocaleDateString()}
                    </div>
                    
                    <p className="text-stone-700 mb-3">{event.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {event.sources.length} source{event.sources.length !== 1 ? 's' : ''}
                      </span>
                      <div className="flex gap-2">
                        {event.sources.map((s, idx) => (
                          <a key={idx} href={s.url} target="_blank" className="underline decoration-dotted hover:text-amber-600 transition-colors">
                            {s.publisher}
                          </a>
                        ))}
                      </div>
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
  let color, text;
  if (score >= 75) {
    color = 'bg-gradient-to-r from-red-500 to-red-600';
    text = 'Critical';
  } else if (score >= 60) {
    color = 'bg-gradient-to-r from-amber-500 to-amber-600';
    text = 'High';
  } else {
    color = 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    text = 'Moderate';
  }
  
  return (
    <div className={`${color} px-3 py-2 text-sm font-bold text-white rounded-lg shadow-md`}>
      <div className="text-center">
        <div className="text-lg">{Math.round(score)}</div>
        <div className="text-xs opacity-90">{text}</div>
      </div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(score)));
  const gradient = 'bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500';
  
  return (
    <div className="mt-4">
      <div className="flex justify-between text-xs text-stone-600 mb-1">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
      <div className="h-3 w-full rounded-full bg-stone-200 overflow-hidden">
        <div className={`h-3 rounded-full ${gradient} transition-all duration-500 ease-out`} style={{ width: pct + '%' }} />
      </div>
    </div>
  );
}
