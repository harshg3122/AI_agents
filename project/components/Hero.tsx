"use client"

import { motion } from 'framer-motion';
import { SearchBar } from './SearchBar';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-28">
      {/* Animated network background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="network-animation">
          {/* Animated nodes */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="network-node"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
          
          {/* Animated connections */}
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={`line-${i}`}
              className="network-line"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 6}s`
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/60 via-[#0B0B0F]/40 to-[#0B0B0F]/80" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-wide max-w-5xl"
        >
          Find the{' '}
          <span className="bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] bg-clip-text text-transparent">
            right AI agent
          </span>
          <br />
          for your business — in one search.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-lg sm:text-xl text-white/70 leading-relaxed"
        >
          Describe your business & pain points. We&apos;ll shortlist the exact agents with ready JSON.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 w-full max-w-2xl"
        >
          <SearchBar centered />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-4 text-sm text-white/50"
        >
          159 curated agents • doc-score ≥ 75 • JSON configs included
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/agents'}
            className="rounded-full border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 hover:border-white/40 hover:bg-white/5 transition-all"
          >
            Display all (159)
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}