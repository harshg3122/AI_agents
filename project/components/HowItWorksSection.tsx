"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Target, Download } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: 'Tell',
    description: 'Describe your business challenges and current tools in natural language or use our guided wizard.'
  },
  {
    icon: Target,
    title: 'Match',
    description: 'Our AI analyzes 159 curated agents and shows you ranked matches with detailed reasoning.'
  },
  {
    icon: Download,
    title: 'Download JSON',
    description: 'Get the complete configuration file and step-by-step setup instructions for your chosen agent.'
  }
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20">
      <div className="flex flex-col items-center text-center gap-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-lg text-white/70">
            Get from problem to solution in three simple steps
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative flex flex-col items-center text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:border-white/20 transition-all duration-300"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] text-sm font-bold text-white">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4">
                  <Icon className="h-8 w-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-white/70 leading-relaxed">{step.description}</p>

                {/* Connector line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}