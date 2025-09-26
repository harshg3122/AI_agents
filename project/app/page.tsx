"use client"

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { TrendingSection } from '@/components/TrendingSection';
import { ResultsSection } from '@/components/ResultsSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { LeadMagnetSection } from '@/components/LeadMagnetSection';
import { Footer } from '@/components/Footer';
import { Container } from '@/components/Container';
import { Agent } from '@/types/agent';

export default function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  useEffect(() => {
    async function loadAgents() {
      try {
        const response = await fetch('/api/agents');
        if (response.ok) {
          const data = await response.json();
          setAgents(Array.isArray(data) ? data : []);
        } else {
          console.error('Failed to fetch agents:', response.statusText);
          setAgents([]);
        }
      } catch (error) {
        console.error('Failed to load agents:', error);
        setAgents([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAgents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] text-[#EDEDF2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#FF3CAC] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading agents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] text-[#EDEDF2]">
      <Header />
      
      <main>
        <Container>
          <div data-search-section>
            <Hero />
          </div>
          
          {query ? (
            <ResultsSection query={query} agents={agents} suggestions={suggestions} />
          ) : (
            <>
              <TrendingSection agents={agents} />
            </>
          )}
          
          <HowItWorksSection />
          <LeadMagnetSection />
        </Container>
      </main>

      <Footer />
    </div>
  );
}