import Fuse from 'fuse.js';
import agents from '@/data/agents.json';
import { expandQuery } from './keyword-expand';
import { Agent, SearchResult } from '@/types/agent';

// Simple cosine similarity for vectors
function cosine(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB) + 1e-9);
}

export interface SearchOptions {
  ai?: boolean;
  model?: 'openai' | 'gemini';
  maxResults?: number;
  semanticBoost?: number;
}

export function normalizeResults(results: Agent[]): SearchResult[] {
  return results.map((result) => ({
    ...result,
    _score: (result as any)._score ? (result as any)._score : 0, // ensure present
  }));
}

export async function smartSearch(
  query: string, 
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const { ai = false, model = 'openai', maxResults = 60 } = options;
  
  if (!query.trim()) {
    // Return all agents sorted by doc score when no query
    return agents.map(agent => ({
      ...agent,
      _score: agent.docScore,
      _why: ['high quality']
    })).sort((a, b) => (b._score ?? 0) - (a._score ?? 0)).slice(0, maxResults);
  }

  const terms = expandQuery(query);
  const queryLower = query.toLowerCase();

  // Helper to create searchable text for an agent
  const getSearchableText = (agent: Agent): string => [
    agent.name,
    agent.oneLiner,
    ...(agent.tags || []),
    ...(agent.categories || []),
    ...(agent.tools || [])
  ].join(' ').toLowerCase();

  // 1) Keyword scoring
  const keywordScored = agents.map(agent => {
    const searchText = getSearchableText(agent);
    const directHits = terms.filter(term => searchText.includes(term)).length;
    const score = directHits * 20 + (agent.docScore / 10);
    
    const why: string[] = [];
    terms.forEach(term => {
      if (agent.tags?.some(tag => tag.toLowerCase().includes(term))) {
        why.push(`tag: ${term}`);
      }
      if (agent.tools?.some(tool => tool.toLowerCase().includes(term))) {
        why.push(`tool: ${term}`);
      }
      if (agent.categories?.some(cat => cat.toLowerCase().includes(term))) {
        why.push(`category: ${term}`);
      }
      if (agent.name.toLowerCase().includes(term)) {
        why.push(`name: ${term}`);
      }
    });

    return {
      ...agent,
      _score: score,
      _why: [...new Set(why)].slice(0, 3)
    };
  }).sort((a, b) => (b._score ?? 0) - (a._score ?? 0));

  // Get results with decent keyword scores
  let results: SearchResult[] = keywordScored.filter(r => (r._score ?? 0) >= 15).slice(0, maxResults);

  // 2) Fuzzy fallback if we don't have enough good results
  if (results.length < 12 && terms.length > 0) {
    const fuse = new Fuse(agents, {
      keys: [
        { name: 'name', weight: 0.3 },
        { name: 'oneLiner', weight: 0.3 },
        { name: 'tags', weight: 0.2 },
        { name: 'categories', weight: 0.1 },
        { name: 'tools', weight: 0.1 }
      ],
      threshold: 0.4, // Allow some fuzziness
      minMatchCharLength: 3,
      ignoreLocation: true,
      includeScore: true
    });

    const fuseResults = fuse.search(query).slice(0, 50).map(result => ({
      ...result.item,
      _score: Math.max(10, 60 - Math.round((result.score || 0) * 60)),
      _why: [`fuzzy match: "${query}"`]
    }));

    // Merge and deduplicate
    const allResults = [...results, ...fuseResults];
    const uniqueResults = allResults.filter((agent, index, arr) => 
      arr.findIndex(a => a.id === agent.id) === index
    );

    results = uniqueResults
      .sort((a, b) => (b._score ?? 0) - (a._score ?? 0))
      .slice(0, maxResults);
  }

  // 3) AI reranking (placeholder for now - actual implementation in API route)
  if (ai && query.trim() && results.length > 0) {
    // This will be handled by the API route with actual embeddings
    // For now, just add a small boost to maintain order
    results = results.map(r => ({
      ...r,
      _score: (r._score ?? 0) + 2 // Small boost for AI-enabled searches
    }));
  }

  return results;
}

// Client-side search function that calls the API
export async function searchAgents(
  query: string,
  options: SearchOptions = {}
): Promise<{ results: SearchResult[]; suggestions?: string[]; understoodTerms?: string[] }> {
  try {
    const { ai, model } = options;
    const params = new URLSearchParams({ q: query });
    
    if (ai && model) {
      params.set('ai', model);
    }

    const response = await fetch(`/api/search?${params}`);
    if (!response.ok) {
      throw new Error(`Search failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Handle both direct results array and structured response
    if (Array.isArray(data)) {
      return { results: data };
    }
    
    const boosted = data.results.map((result: Agent) => ({
      ...result,
      // Small semantic boost; keep all properties inside the object literal
      _score: ((result as any)._score ?? 0) + (options.semanticBoost ?? 5),
    }));

    boosted.sort((a: SearchResult, b: SearchResult) => (b._score ?? 0) - (a._score ?? 0));

    return {
      results: boosted as SearchResult[],
      suggestions: data.suggestions || [],
      understoodTerms: data.understoodTerms || []
    };
  } catch (error) {
    console.error('Search error:', error);
    
    // Fallback to local search
    const results = await smartSearch(query, options);
    return { results };
  }
}