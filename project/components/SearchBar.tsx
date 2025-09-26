"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Zap } from 'lucide-react';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { useRouter, useSearchParams } from 'next/navigation';
import { searchAgents } from '@/lib/search';
import { getPopularFacets } from '@/lib/facets';

interface SearchBarProps {
  centered?: boolean;
  onSearch?: (query: string, results: any) => void;
  onSuggestions?: (suggestions: string[]) => void;
}

const placeholderSuggestions = [
  "e.g., 'B2B SaaS — manual onboarding, slow support replies'",
  "e.g., 'D2C skincare brand — slow lead response, manual support'",
  "e.g., 'Consulting firm — scattered documents, hard to find info'",
  "e.g., 'E-commerce store — inventory chaos, manual reorders'"
];

export function SearchBar({ centered = false, onSearch, onSuggestions }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [isAiMode, setIsAiMode] = useState(true);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [selectedPainPoints, setSelectedPainPoints] = useState<string[]>([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebouncedValue(query, 300);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get popular facets for chips
  const popularFacets = getPopularFacets();
  const searchChips = [
    ...popularFacets.categories.slice(0, 6),
    ...popularFacets.tools.slice(0, 4)
  ];

  // Guided mode options
  const industries = ['E-commerce', 'SaaS', 'B2B', 'Healthcare', 'Education', 'Consulting', 'Agencies', 'Fintech'];
  const commonTools = ['Gmail', 'Slack', 'HubSpot', 'Notion', 'Shopify', 'WhatsApp', 'Airtable', 'Zendesk'];
  const painPoints = ['Slow responses', 'Manual processes', 'Poor organization', 'Lead management', 'Customer support', 'Content creation'];
  // Cycle through placeholder suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderSuggestions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Initialize from URL params
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  // Handle debounced search
  useEffect(() => {
    if (debouncedQuery.length > 2) {
      setIsSearching(true);
      if (onSearch) {
        // Perform search and pass results
        searchAgents(debouncedQuery, { 
          ai: isAiMode,
          model: 'gemini'
        }).then(({ results, suggestions }) => {
          onSearch(debouncedQuery, results);
          if (onSuggestions && suggestions) {
            onSuggestions(suggestions);
          }
        }).finally(() => {
          setIsSearching(false);
        });
      } else {
        // Navigate to results
        router.push(`/?q=${encodeURIComponent(debouncedQuery)}`);
        setIsSearching(false);
      }
    } else {
      setIsSearching(false);
    }
  }, [debouncedQuery, onSearch, onSuggestions, router, isAiMode]);

  const handleChipClick = useCallback((chip: string) => {
    const newQuery = query.trim() ? `${query} ${chip}` : chip;
    setQuery(newQuery);
  }, [query]);

  const handleGuidedSearch = useCallback(() => {
    const parts = [];
    if (selectedIndustry) parts.push(selectedIndustry);
    if (selectedPainPoints.length > 0) parts.push(`— ${selectedPainPoints.join(', ')}`);
    if (selectedTools.length > 0) parts.push(`using ${selectedTools.join(', ')}`);
    
    const guidedQuery = parts.join(' ');
    setQuery(guidedQuery);
    setIsGuidedMode(false);
    
    // Reset selections
    setSelectedIndustry('');
    setSelectedTools([]);
    setSelectedPainPoints([]);
  }, [selectedIndustry, selectedPainPoints, selectedTools]);
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      if (onSearch) {
        searchAgents(query, { 
          ai: isAiMode,
          model: 'gemini'
        }).then(({ results, suggestions }) => {
          onSearch(query, results);
          if (onSuggestions && suggestions) {
            onSuggestions(suggestions);
          }
        }).finally(() => {
          setIsSearching(false);
        });
      } else {
        router.push(`/?q=${encodeURIComponent(query)}`);
        setIsSearching(false);
      }
    }
  }, [query, onSearch, onSuggestions, router, isAiMode]);

  const toggleSelection = (items: string[], item: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (items.includes(item)) {
      setter(items.filter(i => i !== item));
    } else {
      setter([...items, item]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`w-full ${centered ? 'mx-auto' : ''}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:border-white/20 focus-within:border-white/30 focus-within:bg-white/8">
          <div className="relative flex items-center">
            <Search className="absolute left-5 h-5 w-5 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-2xl bg-transparent py-4 pl-12 pr-5 text-base outline-none placeholder:text-white/40 focus:placeholder:text-white/20"
              placeholder={placeholderSuggestions[placeholderIndex]}
            />
            {query && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSearching}
                className="absolute right-3 rounded-xl bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] p-2 text-white shadow-lg"
              >
                <Search className={`h-4 w-4 ${isSearching ? 'animate-spin' : ''}`} />
              </motion.button>
            )}
          </div>
          
          {/* Search chips and guided mode toggle */}
          <div className="flex flex-wrap items-center justify-center gap-2 px-5 pb-4">
            <AnimatePresence mode="wait">
              {searchChips.map((chip, index) => (
                <motion.button
                  key={chip}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/80 transition-all hover:border-white/30 hover:text-white"
                >
                  {chip}
                </motion.button>
              ))}
            </AnimatePresence>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsAiMode(!isAiMode)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                isAiMode 
                  ? 'border-[#2B86C5] bg-[#2B86C5]/10 text-[#2B86C5]' 
                  : 'border-white/10 text-white/80 hover:border-white/30'
              }`}
            >
              <Zap className="h-3 w-3" />
              AI mode
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setIsGuidedMode(!isGuidedMode)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                isGuidedMode 
                  ? 'border-[#FF3CAC] bg-[#FF3CAC]/10 text-[#FF3CAC]' 
                  : 'border-white/10 text-white/80 hover:border-white/30'
              }`}
            >
              <Sparkles className="h-3 w-3" />
              Guided mode
            </motion.button>
          </div>
        </div>
      </form>

      {/* Guided mode panel */}
      <AnimatePresence>
        {isGuidedMode && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <div className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-center">Tell us about your business</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    What industry are you in?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry) => (
                      <button
                        key={industry}
                        type="button"
                        onClick={() => setSelectedIndustry(selectedIndustry === industry ? '' : industry)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                          selectedIndustry === industry
                            ? 'border-[#FF3CAC] bg-[#FF3CAC]/10 text-[#FF3CAC]'
                            : 'border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    What tools do you currently use?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonTools.map((tool) => (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleSelection(selectedTools, tool, setSelectedTools)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                          selectedTools.includes(tool)
                            ? 'border-[#784BA0] bg-[#784BA0]/10 text-[#784BA0]'
                            : 'border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {tool}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    What are your main pain points?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {painPoints.map((painPoint) => (
                      <button
                        key={painPoint}
                        type="button"
                        onClick={() => toggleSelection(selectedPainPoints, painPoint, setSelectedPainPoints)}
                        className={`rounded-full border px-3 py-1.5 text-sm transition-all ${
                          selectedPainPoints.includes(painPoint)
                            ? 'border-[#2B86C5] bg-[#2B86C5]/10 text-[#2B86C5]'
                            : 'border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5'
                        }`}
                      >
                        {painPoint}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsGuidedMode(false)}
                    className="rounded-full border border-white/20 px-6 py-2 text-sm text-white/80 hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleGuidedSearch}
                    disabled={!selectedIndustry && selectedPainPoints.length === 0}
                    className="rounded-full bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] px-6 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Find My Agents
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}