"use client"

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AgentCard } from './AgentCard';
import { DetailsModal } from './DetailsModal';
import { LeadModal } from './LeadModal';
import { Agent } from '@/types/agent';

interface TrendingSectionProps {
  agents: Agent[];
}

export function TrendingSection({ agents }: TrendingSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = React.useState<Agent | null>(null);
  const [showDetailsModal, setShowDetailsModal] = React.useState(false);
  const [showLeadModal, setShowLeadModal] = React.useState(false);

  // Get top 6 trending agents (highest doc scores)
  const trendingAgents = Array.isArray(agents) ? [...agents]
    .sort((a, b) => b.docScore - a.docScore)
    .slice(0, 6) : [];

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  return (
    <>
      <section className="py-16">
        <div className="flex flex-col items-center text-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              What builders are using this week
            </h2>
            <p className="text-white/70">
              The most popular and highest-rated agents from our catalog
            </p>
          </motion.div>

          {/* Desktop: Grid view */}
          <div className="hidden lg:grid grid-cols-3 gap-6 w-full max-w-6xl">
            {trendingAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex justify-center"
              >
                <AgentCard
                  agent={agent}
                  onPreview={handlePreview}
                  onRecommend={handleRecommend}
                  index={index}
                />
              </motion.div>
            ))}
          </div>

          {/* Mobile/Tablet: Horizontal scroll */}
          <div className="lg:hidden relative w-full">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto pb-4 px-4 scrollbar-hide"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {trendingAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0"
                  style={{ scrollSnapAlign: 'center' }}
                >
                  <AgentCard
                    agent={agent}
                    onPreview={handlePreview}
                    onRecommend={handleRecommend}
                    index={index}
                  />
                </motion.div>
              ))}
            </div>

            {/* Scroll buttons */}
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-md hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5 p-2 backdrop-blur-md hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Display all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/agents'}
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-medium text-white/90 hover:border-white/40 hover:bg-white/5 transition-all"
          >
            Display all (159)
          </motion.button>
        </motion.div>
      </section>

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