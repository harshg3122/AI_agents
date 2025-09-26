import { Agent, AgentMatch } from '@/types/agent';

export interface MatchingOptions {
  query: string;
  industry?: string[];
  tools?: string[];
  categories?: string[];
}

export function matchAgents(agents: Agent[], options: MatchingOptions): AgentMatch[] {
  const { query, industry = [], tools = [], categories = [] } = options;
  
  // Extract keywords from query for pain point matching
  const queryWords = query.toLowerCase()
    .split(/[\s,.-]+/)
    .filter(word => word.length > 2);
  
  const matches: AgentMatch[] = agents.map(agent => {
    let score = 0;
    const matchReason = {
      industry: [] as string[],
      painPoints: [] as string[],
      tools: [] as string[]
    };

    // Industry match (35% weight)
    const industryMatches = agent.industries.filter(ind => 
      industry.some(userInd => userInd.toLowerCase().includes(ind.toLowerCase()) || 
                              ind.toLowerCase().includes(userInd.toLowerCase()))
    );
    if (industryMatches.length > 0) {
      score += 35 * (industryMatches.length / Math.max(agent.industries.length, industry.length));
      matchReason.industry = industryMatches;
    }

    // Pain point matching (40% weight) - match against tags, oneLiner, and categories
    const searchableText = [
      ...agent.tags,
      agent.oneLiner.toLowerCase(),
      ...agent.categories
    ].join(' ').toLowerCase();
    
    const matchedKeywords = queryWords.filter(word => 
      searchableText.includes(word) || 
      agent.tags.some(tag => tag.includes(word))
    );
    
    if (matchedKeywords.length > 0) {
      score += 40 * (matchedKeywords.length / queryWords.length);
      matchReason.painPoints = matchedKeywords;
    }

    // Tool affinity (15% weight)
    const toolMatches = agent.tools.filter(tool => 
      tools.some(userTool => 
        tool.toLowerCase().includes(userTool.toLowerCase()) ||
        userTool.toLowerCase().includes(tool.toLowerCase())
      )
    );
    if (toolMatches.length > 0) {
      score += 15 * (toolMatches.length / Math.max(agent.tools.length, tools.length));
      matchReason.tools = toolMatches;
    }

    // Category match bonus
    const categoryMatches = agent.categories.filter(cat => 
      categories.some(userCat => 
        cat.toLowerCase().includes(userCat.toLowerCase()) ||
        userCat.toLowerCase().includes(cat.toLowerCase())
      )
    );
    if (categoryMatches.length > 0) {
      score += 5 * (categoryMatches.length / categories.length);
    }

    // Doc score normalized (10% weight)
    score += 10 * (agent.docScore / 100);

    return {
      ...agent,
      score: Math.min(100, score),
      matchReason
    };
  });

  return matches
    .filter(match => match.score > 20) // Only show relevant matches
    .sort((a, b) => b.score - a.score);
}

export function extractToolsFromQuery(query: string): string[] {
  const commonTools = [
    'gmail', 'hubspot', 'salesforce', 'slack', 'notion', 'airtable',
    'shopify', 'woocommerce', 'zendesk', 'intercom', 'calendly',
    'google drive', 'sheets', 'whatsapp', 'instagram', 'youtube',
    'openai', 'pinecone', 'twilio', 'clearbit', 'mixpanel'
  ];
  
  const queryLower = query.toLowerCase();
  return commonTools.filter(tool => queryLower.includes(tool));
}

export function extractIndustryFromQuery(query: string): string[] {
  const industries = [
    'e-commerce', 'saas', 'b2b', 'retail', 'healthcare', 'education',
    'consulting', 'agencies', 'fintech', 'media', 'd2c', 'manufacturing'
  ];
  
  const queryLower = query.toLowerCase();
  return industries.filter(industry => queryLower.includes(industry));
}