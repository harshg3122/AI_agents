import { Agent } from '@/types/agent';

async function fetchJSON(path: string, base: string): Promise<Agent[]> {
  try {
    const res = await fetch(new URL(path, base), { cache: "force-cache" });
    if (!res.ok) {
      console.warn(`Failed to fetch ${path}: ${res.status}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Error fetching ${path}:`, error);
    return [];
  }
}

export async function loadAllAgents(base?: string): Promise<Agent[]> {
  // If no base provided, assume we're in a client context or use relative paths
  const baseUrl = base || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  const files = [
    "/agents.parts/part1.json",
    "/agents.parts/part2.json",
    "/agents.parts/part3.json",
    "/agents.parts/part4.json",
  ];
  
  const parts = await Promise.all(files.map(file => fetchJSON(file, baseUrl)));
  
  // Flatten and de-dupe by id
  const all = parts.flat();
  const uniqueAgents = Array.from(new Map(all.map(a => [a.id, a])).values());
  
  console.log(`Loaded ${uniqueAgents.length} agents from ${parts.length} parts`);
  return uniqueAgents;
}

// Build facets from loaded agents
export function buildFacetsFromAgents(agents: Agent[]) {
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
export function getPopularFacetsFromAgents(agents: Agent[]) {
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