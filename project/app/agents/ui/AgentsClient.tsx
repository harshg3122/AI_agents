"use client";

import { useEffect, useMemo, useState } from "react";

/** Base agent type coming from JSON files */
export type Agent = {
  id: string;
  name: string;
  oneLiner?: string;
  description?: string;
  categories?: string[];
  tools?: string[];
  tags?: string[];
  configUrl?: string;
  [k: string]: any; // tolerate extra fields
};

/** SearchResult extends Agent with optional scoring/highlights */
import { SearchResult } from '@/types/agent';

/** Local SearchResult for this component with matchScore */
type LocalSearchResult = SearchResult & {
  matchScore?: number;
  highlights?: string[];
};

type Filters = {
  categories: string[];
  tools: string[];
  minDocScore?: number;
  maxSetupMins?: number;
};

export default function AgentsClient() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    tools: [],
  });
  const [sortBy, setSortBy] = useState<"best"|"docScore"|"setup"|"name">("best");

  // Load from /public to avoid SSR/build issues
  useEffect(() => {
    (async () => {
      try {
        const files = ["part1.json","part2.json","part3.json","part4.json"];
        const parts = await Promise.all(
          files.map(f => fetch(`/agents.parts/${f}`).then(r => r.ok ? r.json() : []))
        );
        const all: Agent[] = parts.flat();
        // de-dupe by id, in case of overlaps
        const uniq = Array.from(new Map(all.map(a => [a.id, a])).values());
        setAgents(uniq);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load agents");
      }
    })();
  }, []);

  // --- SEARCH / FILTER / SORT ---
  const displayAgents: LocalSearchResult[] = useMemo(() => {
    let filtered: Agent[] = [...agents];

    // text query (simple contains across name/oneLiner/description)
    const q = query.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter(a => {
        const hay = `${a.name} ${a.oneLiner ?? ""} ${a.description ?? ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // category filter
    if (filters.categories.length) {
      filtered = filtered.filter(a => (a.categories ?? []).some(c => filters.categories.includes(c)));
    }
    // tools filter
    if (filters.tools.length) {
      filtered = filtered.filter(a => (a.tools ?? []).some(t => filters.tools.includes(t)));
    }
    // docScore and setup time (optional fields)
    if (typeof filters.minDocScore === "number") {
      filtered = filtered.filter((a: any) => typeof a.docScore === "number" ? a.docScore >= filters.minDocScore! : true);
    }
    if (typeof filters.maxSetupMins === "number") {
      filtered = filtered.filter((a: any) => typeof a.setupTimeMins === "number" ? a.setupTimeMins <= filters.maxSetupMins! : true);
    }

    // basic scoring for "best" sort (bump exact title hits & docScore)
    const scored: LocalSearchResult[] = filtered.map((a: any) => {
      const nameHit = q && a.name?.toLowerCase().includes(q) ? 5 : 0;
      const score = (a.docScore ?? 80) + nameHit;
      return { ...a, matchScore: score };
    });

    switch (sortBy) {
      case "docScore":
        scored.sort((a, b) => (b.docScore ?? 0) - (a.docScore ?? 0));
        break;
      case "setup":
        scored.sort((a: any, b: any) => (a.setupTimeMins ?? 999) - (b.setupTimeMins ?? 999));
        break;
      case "name":
        scored.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "best":
      default:
        scored.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
        break;
    }
    return scored;
  }, [agents, query, filters, sortBy]);

  if (error) return <div className="p-6 text-red-400">Error: {error}</div>;
  if (agents.length === 0) return <div className="p-6 opacity-70">Loading agents…</div>;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2 text-center">Browse all agents</h1>
      <p className="text-sm opacity-70 mb-6 text-center">{displayAgents.length} results</p>

      {/* simple controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 justify-center">
        <input
          className="w-full sm:w-96 rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          placeholder="Search by name or use case…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
        >
          <option value="best">Best match</option>
          <option value="docScore">Doc score</option>
          <option value="setup">Setup time</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* results grid */}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {displayAgents.map(a => (
          <li key={a.id} className="rounded-2xl border border-white/10 p-4">
            <div className="font-semibold">{a.name}</div>
            <div className="text-xs opacity-70 mt-1">{a.oneLiner ?? a.description}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {(a.categories ?? []).slice(0,2).map(c => (
                <span key={c} className="text-[10px] rounded-full border border-white/15 px-2 py-0.5 opacity-80">{c}</span>
              ))}
              {(a.tools ?? []).slice(0,2).map(t => (
                <span key={t} className="text-[10px] rounded-full border border-white/15 px-2 py-0.5 opacity-60">{t}</span>
              ))}
            </div>
            <div className="mt-4">
              {a.configUrl && (
                <a
                  className="inline-block rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-xs hover:bg-white/10"
                  href={a.configUrl}
                  target="_blank" rel="noreferrer"
                >
                  Download JSON
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}