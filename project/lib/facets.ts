import agents from '@/data/agents.json';

export interface Facets {
  categories: string[];
  tools: string[];
  tags: string[];
  industries: string[];
}

export function buildFacets(): Facets {
  const cats = new Set<string>();
  const tools = new Set<string>();
  const tags = new Set<string>();
  const industries = new Set<string>();

  for (const agent of agents) {
    // Categories
    (agent.categories || []).forEach((c: string) => cats.add(c));
    
    // Tools
    (agent.tools || []).forEach((t: string) => tools.add(t));
    
    // Tags
    (agent.tags || []).forEach((t: string) => tags.add(t));
    
    // Industries
    (agent.industries || []).forEach((i: string) => industries.add(i));
  }

  // Sort alphabetically for consistent ordering
  const sortAlpha = (arr: string[]) => arr.sort((a, b) => a.localeCompare(b));

  return {
    categories: sortAlpha([...cats]),
    tools: sortAlpha([...tools]),
    tags: sortAlpha([...tags]),
    industries: sortAlpha([...industries])
  };
}

// Get popular items (by frequency in dataset)
export function getPopularFacets(): { categories: string[]; tools: string[]; tags: string[] } {
  const catCount = new Map<string, number>();
  const toolCount = new Map<string, number>();
  const tagCount = new Map<string, number>();

  for (const agent of agents) {
    (agent.categories || []).forEach(c => catCount.set(c, (catCount.get(c) || 0) + 1));
    (agent.tools || []).forEach(t => toolCount.set(t, (toolCount.get(t) || 0) + 1));
    (agent.tags || []).forEach(t => tagCount.set(t, (tagCount.get(t) || 0) + 1));
  }

  const sortByCount = (map: Map<string, number>) => 
    [...map.entries()].sort((a, b) => b[1] - a[1]).map(([key]) => key);

  return {
    categories: sortByCount(catCount).slice(0, 8),
    tools: sortByCount(toolCount).slice(0, 12),
    tags: sortByCount(tagCount).slice(0, 15)
  };
}