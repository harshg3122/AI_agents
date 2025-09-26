export const SYNONYMS: Record<string, string[]> = {
  // Pain points and business challenges
  "slow reply": ["lead", "response", "auto-reply", "outreach", "support", "speed"],
  "slow response": ["lead", "response", "auto-reply", "outreach", "support", "speed"],
  "manual follow": ["outreach", "sequence", "automation", "follow-up"],
  "manual followup": ["outreach", "sequence", "automation", "follow-up"],
  "support": ["helpdesk", "ticket", "whatsapp", "zendesk", "freshdesk", "intercom", "customer"],
  "customer service": ["support", "helpdesk", "ticket", "whatsapp", "zendesk"],
  "knowledge base": ["rag", "retrieval", "pinecone", "qdrant", "weaviate", "search", "docs"],
  "documentation": ["rag", "retrieval", "pinecone", "qdrant", "knowledge", "search"],
  "crm": ["hubspot", "pipedrive", "salesforce", "airtable", "sales"],
  "whatsapp": ["chatbot", "twilio", "gupshup", "messaging", "chat"],
  "content": ["instagram", "youtube", "caption", "calendar", "seo", "social"],
  "social media": ["instagram", "youtube", "facebook", "linkedin", "content", "posts"],
  "scrape": ["crawler", "etl", "csv", "google sheets", "airtable", "notion", "data"],
  "scraping": ["crawler", "etl", "csv", "google sheets", "airtable", "data"],
  "data extraction": ["scrape", "crawler", "etl", "csv", "sheets"],
  "lead generation": ["prospect", "outreach", "cold email", "linkedin", "sales"],
  "lead gen": ["prospect", "outreach", "cold email", "linkedin", "sales"],
  "prospecting": ["lead", "outreach", "cold email", "linkedin", "sales"],
  "email marketing": ["outreach", "sequence", "gmail", "cold email", "automation"],
  "automation": ["workflow", "zapier", "n8n", "sequence", "trigger"],
  "workflow": ["automation", "zapier", "n8n", "sequence", "process"],
  "inventory": ["stock", "supply chain", "reorder", "shopify", "woocommerce"],
  "reviews": ["reputation", "google my business", "yelp", "feedback"],
  "scheduling": ["calendar", "calendly", "meetings", "appointments"],
  "invoicing": ["billing", "finance", "quickbooks", "stripe", "payments"],
  "onboarding": ["user experience", "setup", "guidance", "activation"],

  // Industries
  "ecommerce": ["shopify", "store", "d2c", "retail", "woocommerce"],
  "e-commerce": ["shopify", "store", "d2c", "retail", "woocommerce"],
  "saas": ["software", "subscription", "b2b", "platform"],
  "b2b": ["prospect", "lead gen", "sequence", "sales", "enterprise"],
  "retail": ["store", "shopify", "inventory", "pos", "ecommerce"],
  "healthcare": ["medical", "patient", "hipaa", "clinic", "hospital"],
  "consulting": ["professional services", "advisory", "expertise"],
  "agency": ["marketing", "advertising", "client", "campaign"],
  "fintech": ["finance", "banking", "payments", "stripe", "financial"],

  // Tools and platforms
  "gmail": ["email", "google", "outreach", "automation"],
  "google sheets": ["spreadsheet", "data", "csv", "airtable", "excel"],
  "slack": ["notifications", "team", "alerts", "messaging"],
  "notion": ["documentation", "knowledge", "notes", "wiki"],
  "airtable": ["database", "crm", "data", "spreadsheet"],
  "hubspot": ["crm", "sales", "marketing", "automation"],
  "salesforce": ["crm", "sales", "enterprise", "automation"],
  "shopify": ["ecommerce", "store", "retail", "inventory"],
  "stripe": ["payments", "billing", "finance", "subscription"],
  "openai": ["ai", "gpt", "chatgpt", "artificial intelligence"],
  "claude": ["ai", "anthropic", "artificial intelligence"],
  "pinecone": ["vector", "embedding", "rag", "search"],
  "telegram": ["messaging", "bot", "chat", "notifications"],
  "youtube": ["video", "content", "social", "marketing"],
  "instagram": ["social", "content", "reels", "marketing"],
  "linkedin": ["professional", "b2b", "networking", "outreach"],
  "facebook": ["social", "advertising", "marketing", "meta"],
  "twilio": ["sms", "messaging", "phone", "communication"],
  "calendly": ["scheduling", "meetings", "appointments", "calendar"],
  "zendesk": ["support", "helpdesk", "tickets", "customer service"],
  "intercom": ["support", "chat", "messaging", "customer"],
  "zapier": ["automation", "workflow", "integration", "trigger"],
  "n8n": ["automation", "workflow", "integration", "open source"]
};

export function expandQuery(q: string): string[] {
  const base = (q || "").toLowerCase().trim();
  if (!base) return [];

  const terms = new Set<string>();
  
  // Add original words
  base.split(/\W+/).filter(word => word.length > 2).forEach(word => terms.add(word));

  // Add synonyms for phrases and individual words
  for (const [phrase, synonyms] of Object.entries(SYNONYMS)) {
    if (base.includes(phrase.toLowerCase())) {
      synonyms.forEach(synonym => terms.add(synonym.toLowerCase()));
    }
  }

  // Limit to prevent overly broad searches
  return [...terms].slice(0, 24);
}

export function getSuggestions(query: string): string[] {
  const suggestions = [
    "B2B SaaS — manual onboarding, slow support replies",
    "D2C skincare brand — slow lead response, manual support",
    "Consulting firm — scattered documents, hard to find info",
    "E-commerce store — inventory chaos, manual reorders",
    "Agency — client reporting, manual social posts",
    "Healthcare clinic — appointment scheduling, patient follow-up",
    "Real estate — lead nurturing, property updates",
    "Restaurant — order management, customer feedback"
  ];

  // If query is empty, return general suggestions
  if (!query.trim()) {
    return suggestions.slice(0, 4);
  }

  // Filter suggestions based on query terms
  const queryLower = query.toLowerCase();
  const filtered = suggestions.filter(suggestion => {
    const suggestionLower = suggestion.toLowerCase();
    return queryLower.split(/\s+/).some(term => 
      suggestionLower.includes(term) && term.length > 2
    );
  });

  // If we have relevant suggestions, return them, otherwise return general ones
  return filtered.length > 0 ? filtered.slice(0, 3) : suggestions.slice(0, 3);
}