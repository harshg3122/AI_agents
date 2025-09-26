"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Download, Clock, Star } from 'lucide-react';
import { Agent } from '@/types/agent';
import { SearchResult } from '@/types/agent';

interface AgentCardProps {
  agent: SearchResult;
  onPreview?: (agent: Agent) => void;
  onRecommend?: (agent: Agent) => void;
  index?: number;
}

export function AgentCard({ agent, onPreview, onRecommend, index = 0 }: AgentCardProps) {
  const hasMatchScore = agent._score !== undefined && agent._score !== null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ 
        y: -8, 
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      className="group relative w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-md transition-all duration-300 hover:border-white/25 hover:bg-white/8 hover:shadow-2xl"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
           style={{
             background: 'radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255, 60, 172, 0.1), transparent 40%)',
           }} />
      
      <div className="relative z-10">
        {/* Header with tags and score */}
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs text-white/60">
            {agent.tags.slice(0, 3).join(' · ')}
          </div>
          {hasMatchScore && (agent._score ?? 0) > 70 && (
            <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] px-2 py-0.5 text-xs font-medium">
              <Star className="h-3 w-3" />
              {Math.round(agent._score ?? 0)}%
            </div>
          )}
        </div>

        {/* Agent name and description */}
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-[#FF3CAC] group-hover:to-[#2B86C5] group-hover:bg-clip-text transition-all duration-300">
          {agent.name}
        </h3>
        
        <p className="text-sm text-white/75 leading-relaxed mb-4 line-clamp-2">
          {agent.oneLiner}
        </p>

        {/* Match reason (for search results) */}
        {agent._why && agent._why.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 rounded-lg bg-white/5 p-3 text-left"
          >
            <div className="text-xs font-medium text-white/80 mb-1">Why this match:</div>
            <div className="text-xs text-white/60 space-y-1">
              {agent._why.map((reason, idx) => (
                <div key={idx} className="text-[#FF3CAC]">{reason}</div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Badges */}
        <div className="mb-4 flex justify-center gap-2 flex-wrap">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
            Doc {agent.docScore}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
            <Clock className="inline h-3 w-3 mr-1" />
            {agent.setupTimeMins}m
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
            {agent.tools[0]}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPreview?.(agent)}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] px-5 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <Eye className="h-4 w-4" />
            Preview
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onRecommend?.(agent)}
            className="flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm text-white/90 backdrop-blur-sm transition-all duration-300 hover:border-white/40"
          >
            <Download className="h-4 w-4" />
            Get JSON
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}