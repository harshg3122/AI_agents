"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Agent } from "@/types/agent";
import { useToast } from "@/hooks/use-toast";

const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  consent: z
    .boolean()
    .refine((val) => val === true, "You must agree to proceed"),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadModalProps {
  agent: Agent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadModal({ agent, isOpen, onClose }: LeadModalProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    if (!agent) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          agentId: agent.id,
          query: "", // Could be passed from search context
        }),
      });

      if (response.ok) {
        toast({
          title: "Success!",
          description: "Your download will begin shortly.",
        });

        // Trigger download
        window.open(`/api/download?id=${agent.id}`, "_blank");

        reset();
        onClose();
      } else {
        throw new Error("Failed to submit");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!agent) return null;

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
            className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0B0B0F]/95 p-6 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Get {agent.name}
                </h2>
                <p className="text-sm text-white/70 mt-1">
                  Download the complete JSON configuration
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Full Name *
                </label>
                <input
                  {...register("name")}
                  type="text"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/8 focus:outline-none"
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Company *
                </label>
                <input
                  {...register("company")}
                  type="text"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/8 focus:outline-none"
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.company.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Email *
                </label>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/8 focus:outline-none"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Phone *
                </label>
                <input
                  {...register("phone")}
                  type="tel"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/40 focus:border-white/30 focus:bg-white/8 focus:outline-none"
                  placeholder="+1 (555) 000-0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-400">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 pt-2">
                <input
                  {...register("consent")}
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-[#FF3CAC] focus:ring-[#FF3CAC] focus:ring-offset-0"
                />
                <label className="text-xs text-white/70 leading-relaxed">
                  I agree to receive the configuration file and occasional
                  updates about AI agents. No spam, unsubscribe anytime.
                </label>
              </div>
              {errors.consent && (
                <p className="text-xs text-red-400 ml-7">
                  {errors.consent.message}
                </p>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-full border border-white/20 py-3 text-sm text-white/80 hover:bg-white/5"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF3CAC] via-[#784BA0] to-[#2B86C5] py-3 text-sm font-medium text-white shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {isSubmitting ? "Processing..." : "Download JSON"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
