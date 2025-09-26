"use client"

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from './Container';

export function Header() {
  const handleGetAgentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const searchSection = document.querySelector('[data-search-section]');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 border-b border-white/5 bg-[#0B0B0F]/80 backdrop-blur-md"
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF3CAC] to-[#2B86C5]">
              <span className="text-sm font-bold text-white">A•G</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-white/80 hover:text-white transition-colors">
              Agents
            </Link>
            <Link href="#how-it-works" className="text-sm text-white/80 hover:text-white transition-colors">
              How it works
            </Link>
            <Link href="#about" className="text-sm text-white/80 hover:text-white transition-colors">
              About
            </Link>
          </nav>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGetAgentClick}
            className="rounded-full bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] px-4 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl"
          >
            Get my agent
          </motion.button>
        </div>
      </Container>
    </motion.header>
  );
}