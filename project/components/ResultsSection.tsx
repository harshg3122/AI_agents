"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AgentCard } from './AgentCard';
import { DetailsModal } from './DetailsModal';
import { LeadModal } from './LeadModal';
import { Agent } from '@/types/agent';
import { SearchResult } from '@/types/agent';
import { searchAgents } from '@/lib/search';

interface ResultsSectionProps {
  query: string;
  agents: Agent[];
  suggestions?: string[];
}

type SortOption = 'match' | 'setup' | 'newest';

export function ResultsSection({ query, agents, suggestions = [] }: ResultsSectionProps) {
  const [matches, setMatches] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('match');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showLeadModal, setShowLeadModal] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setMatches([]);
      return;
    }
        
    setIsLoading(true);
    
    searchAgents(query, {
      ai: true,
      model: 'gemini'
    }).then(({ results }) => {
      setMatches(results);
    }).catch(error => {
      console.error('Search failed:', error);
      setMatches([]);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [query]);

  const sortedMatches = [...matches].sort((a, b) => {
    switch (sortBy) {
      case 'setup':
        return a.setupTimeMins - b.setupTimeMins;
      case 'newest':
        return b.docScore - a.docScore; // Use doc score as proxy for "newest"
      default:
        return (b._score ?? 0) - (a._score ?? 0);
    }
  });

  const handlePreview = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailsModal(true);
  };

  const handleRecommend = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowLeadModal(true);
  };

  const handleGetConfig = (agent: Agent) => {
    setShowDetailsModal(false);
    setSelectedAgent(agent);
    setShowLeadModal(true);
  };

  if (!query.trim()) {
    return null;
  }

  if (isLoading) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <div className="flex flex-col items-center text-center gap-6">
          <div className="w-12 h-12 border-2 border-[#FF3CAC] border-t-transparent rounded-full animate-spin" />
          <p className="text-white/70">Searching agents...</p>
        </div>
      </motion.section>
    );
  }

  if (matches.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <div className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-white mb-3">No agents found</h2>
            <p className="text-white/70">
              We couldn&apos;t find any agents matching &quot;{query}&quot;. Try these suggestions:
            </p>
          </div>
          
          {suggestions.length > 0 && (
            <div className="w-full">
              <h3 className="text-lg font-semibold text-white mb-4">Try these instead:</h3>
              <div className="space-y-3">
                {suggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      const newQuery = suggestion.split('—')[0].trim();
                      window.location.href = `/?q=${encodeURIComponent(newQuery)}`;
                    }}
                    className="w-full text-left p-4 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8 transition-all"
                  >
                    <div className="text-white font-medium">{suggestion}</div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/agents'}
            className="rounded-full bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl"
          >
            Browse All Agents
          </motion.button>
        </div>
      </motion.section>
    );
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-12"
      >
        <div className="flex flex-col items-center text-center gap-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl font-bold text-white"
          >
            Your matches
          </motion.h2>

          {/* Sort tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur-md"
          >
            {[
              { key: 'match' as const, label: 'Best match' },
              { key: 'setup' as const, label: 'Setup time' },
              { key: 'newest' as const, label: 'Newest' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`rounded-xl px-6 py-2 text-sm font-medium transition-all ${
                  sortBy === key
                    ? 'bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] text-white shadow-lg'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </motion.div>

          {/* Results grid */}
          <motion.div
            layout
            className="mx-auto grid max-w-6xl grid-cols-1 md:grid-cols-2 lg:grid-cols-3 place-items-center gap-6 w-full"
          >
            <AnimatePresence mode="popLayout">
              {sortedMatches.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-full flex justify-center"
                >
                  <AgentCard
                    agent={agent}
                    onPreview={handlePreview}
                    onRecommend={handleRecommend}
                    index={index}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Results count */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-white/60"
          >
            Showing {matches.length} matching agent{matches.length !== 1 ? 's' : ''}
            <span className="ml-2 text-[#2B86C5]">• AI Enhanced</span>
          </motion.p>
        </div>
      </motion.section>

      {/* Modals */}
      <DetailsModal
        agent={selectedAgent}
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        onGetConfig={handleGetConfig}
      />
      
      <LeadModal
        agent={selectedAgent}
        isOpen={showLeadModal}
        onClose={() => setShowLeadModal(false)}
      />
    </>
  );
}