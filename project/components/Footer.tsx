"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12">
      <Container>
        <div className="flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-[#FF3CAC] to-[#2B86C5]">
              <span className="text-sm font-bold text-white">A•G</span>
            </div>
            <span className="text-lg font-semibold text-white">AI Agents</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-6 text-sm text-white/70"
          >
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center text-sm text-white/50"
          >
            <p>Built by <span className="text-[#FF3CAC] font-medium">GrowthInfi</span></p>
            <p className="mt-1">© 2025 AI Agents. All rights reserved.</p>
          </motion.div>
        </div>
      </Container>
    </footer>
  );
}