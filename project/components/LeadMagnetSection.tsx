"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { useToast } from './ui/toast';

export function LeadMagnetSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      addToast({
        type: 'success',
        title: 'Success!',
        description: 'Check your email for your personalized agent shortlist.'
      });
      
      setEmail('');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#FF3CAC]/10 via-[#784BA0]/10 to-[#2B86C5]/10 backdrop-blur-md"
      >
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF3CAC]/5 via-[#784BA0]/5 to-[#2B86C5]/5" />
        
        <div className="relative z-10 flex flex-col items-center text-center gap-6 p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Get a tailored shortlist in 30 seconds
            </h2>
            <p className="text-lg text-white/80">
              Enter your email and get a curated list of the 5 best agents for your specific business needs.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
          >
            <div className="relative flex-1">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-xl border border-white/20 bg-white/10 pl-12 pr-4 py-3 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-white/15 focus:outline-none backdrop-blur-md"
                required
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] px-6 py-3 font-medium text-white shadow-lg hover:shadow-xl disabled:opacity-50 sm:w-auto w-full"
            >
              {isSubmitting ? 'Sending...' : 'Get Shortlist'}
              {!isSubmitting && <ArrowRight className="h-4 w-4" />}
            </motion.button>
          </motion.form>

          <p className="text-xs text-white/60 max-w-md">
            No spam, ever. Just the best AI agents for your specific needs, 
            delivered to your inbox within minutes.
          </p>
        </div>
      </motion.div>
    </section>
  );
}