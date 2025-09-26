export interface Agent {
  id: string;
  name: string;
  oneLiner: string;
  description: string;
  categories: string[];
  industries: string[];
  tools: string[];
  tags: string[];
  docScore: number;
  setupTimeMins: number;
  prerequisites: string[];
  configUrl: string;
}

export interface SearchResult extends Agent {
  _score?: number; // optional
  _why?: string[];
}

export interface AgentMatch extends Agent {
  score: number;
  matchReason: {
    industry: string[];
    painPoints: string[];
    tools: string[];
  };
}

export interface LeadFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  agentId: string;
  query: string;
  consent: boolean;
  utm?: {
    source?: string;
    medium?: string;
    campaign?: string;
  };
}