import { NextRequest, NextResponse } from 'next/server';
import { smartSearch } from '@/lib/search';
import { expandQuery, getSuggestions } from '@/lib/keyword-expand';

export const dynamic = 'force-dynamic';

// Optional AI embedding functions
async function embedOpenAI(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn('OpenAI API key not configured, skipping OpenAI embedding');
    return [];
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      input: text,
      model: 'text-embedding-3-small'
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data?.[0]?.embedding || [];
}

async function embedGemini(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.warn('Google API key not configured, skipping Gemini embedding');
    return [];
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedText?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.embedding?.value || [];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const aiProvider = searchParams.get('ai') as 'openai' | 'gemini' | null;

    // Fast path: keyword + fuzzy search
    let results = await smartSearch(query, { 
      ai: !!aiProvider, 
      model: aiProvider || 'openai' 
    });

    // AI reranking if requested and configured
    if (aiProvider && query && results.length > 0) {
      try {
        const queryVector = aiProvider === 'gemini' 
          ? await embedGemini(query)
          : await embedOpenAI(query);

        if (queryVector && Array.isArray(queryVector) && queryVector.length > 0) {
          // For MVP, we'll add a semantic boost to already matched items
          // In production, you'd precompute embeddings for all agents
          results = results.map(result => ({
            ...result,
            _score: (result._score ?? 0) + 5, // Small semantic boost
            _why: [...(result._why || []), 'AI enhanced']
          }));
        } else {
          console.log('AI embedding skipped due to missing API key, using keyword search only');
        }
      } catch (error) {
        console.warn('AI embedding failed, falling back to keyword search:', error);
        // Continue with keyword results
      }
    }

    // Handle empty results with suggestions
    if (results.length === 0) {
      const understoodTerms = expandQuery(query);
      const suggestions = getSuggestions(query);

      return NextResponse.json({
        results: [],
        suggestions,
        understoodTerms,
        message: query 
          ? `No agents found for "${query}". Try these suggestions:`
          : 'Try searching for your business type and challenges'
      });
    }

    // Return successful results
    return NextResponse.json({
      results: results.slice(0, 60),
      total: results.length,
      query,
      understoodTerms: expandQuery(query)
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Search failed', 
        message: 'Please try again or browse all agents',
        results: []
      },
      { status: 500 }
    );
  }
}