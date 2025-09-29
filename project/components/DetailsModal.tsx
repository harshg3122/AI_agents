"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Clock,
  Star,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { Agent } from "@/types/agent";

interface DetailsModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
  onGetConfig: (agent: Agent) => void;
}

export function DetailsModal({
  agent,
  isOpen,
  onClose,
  onGetConfig,
}: DetailsModalProps) {
  if (!agent) return null;

  const sampleConfig = `{
  "name": ${JSON.stringify(agent.name)},
  "version": "1.0.0",
  "description": ${JSON.stringify(agent.oneLiner)},
  "category": ${JSON.stringify(agent.categories[0] || "")},
  "triggers": [
    {
      "type": "webhook",
      "endpoint": "https://your-domain.com/webhook/trigger"
    }
  ],
  "actions": [
    {
      "name": "process_request",
      "type": "function",
      "config": {
        "tools": ${JSON.stringify(agent.tools.slice(0, 2))},
        "timeout": 30000
      }
    }
  ],
  "integrations": {${agent.tools
    .map(
      (tool) => `
    ${JSON.stringify(tool.toLowerCase())}: {
      "required": true,
      "config_keys": ["api_key", "webhook_url"]
    }`
    )
    .join(",")}
  }
}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-3xl border border-white/20 bg-[#0B0B0F]/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-[#0B0B0F]/80 p-6 backdrop-blur-sm">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-bold text-white">
                      {agent.name}
                    </h2>
                    <div className="flex items-center gap-1 rounded-full bg-gradient-to-r from-[#FF3CAC] to-[#784BA0] px-3 py-1 text-sm font-medium">
                      <Star className="h-4 w-4" />
                      {agent.docScore}
                    </div>
                  </div>
                  <p className="mt-2 text-white/70">{agent.oneLiner}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {agent.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Description
                  </h3>
                  <p className="text-white/80 leading-relaxed">
                    {agent.description}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Prerequisites
                  </h3>
                  <ul className="space-y-2">
                    {agent.prerequisites.map((prereq, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-white/80"
                      >
                        <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Required Tools
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {agent.tools.map((tool) => (
                      <div
                        key={tool}
                        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3"
                      >
                        <div className="h-8 w-8 rounded bg-gradient-to-br from-white/20 to-white/5" />
                        <span className="text-sm font-medium text-white">
                          {tool}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Industries
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {agent.industries.map((industry) => (
                      <span
                        key={industry}
                        className="rounded-full bg-white/10 px-3 py-1 text-sm"
                      >
                        {industry}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      Agent Stats
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Documentation Score</span>
                      <span className="font-medium text-white">
                        {agent.docScore}/100
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Setup Time</span>
                      <span className="flex items-center gap-1 font-medium text-white">
                        <Clock className="h-4 w-4" />
                        {agent.setupTimeMins} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Integrations</span>
                      <span className="font-medium text-white">
                        {agent.tools.length} tools
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Configuration Preview
                  </h3>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4 font-mono text-xs">
                    <pre className="text-white/80 overflow-x-auto whitespace-pre-wrap">
                      {sampleConfig}
                    </pre>
                  </div>
                  <p className="mt-2 text-xs text-white/50">
                    * This is a preview. Full configuration available after
                    download.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 border-t border-white/10 bg-[#0B0B0F]/90 p-6 backdrop-blur-sm">
              <div className="flex justify-center gap-4">
                <button
                  onClick={onClose}
                  className="rounded-full border border-white/20 px-6 py-3 text-white/80 hover:bg-white/5"
                >
                  Close
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onGetConfig(agent)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] px-8 py-3 font-medium text-white shadow-lg hover:shadow-xl"
                >
                  <Download className="h-5 w-5" />
                  Get Full Configuration
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
