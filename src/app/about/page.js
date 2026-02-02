"use client";

import React from "react";
import { motion } from "framer-motion";
import { Crown, MessageCircle, GraduationCap, Sparkles } from "lucide-react";
import { whatsappLink } from "@/utils/whatsapp";

// Sub-component defined locally for cleaner organization
function BrandStoryCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-sm border border-stone-100 flex flex-col h-full"
    >
      <div className="bg-pink-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
        <Crown className="w-8 h-8 text-pink-600" />
      </div>

      <h3 className="text-2xl font-bold text-stone-900 mb-4">
        7 Years of Making Pretty Girls Glow ✨
      </h3>

      <p className="text-stone-600 leading-relaxed mb-8 flex-grow">
        My name is <strong className="text-stone-900">Jennifer</strong>. For over 7 years, I’ve helped pretty girls look and feel their absolute best. I’m your
        go-to consultant for luxury hair, confidence, and curated beauty.
      </p>

      <a
        href={whatsappLink("Hi my name is ___, I want to ask you a question about luxury hair.")}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center text-sm font-semibold px-6 py-3 rounded-xl bg-pink-600 hover:bg-pink-700 text-white transition-all shadow-md shadow-pink-100 flex items-center justify-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Chat with Jennifer
      </a>
    </motion.div>
  );
}

// Mock components for StylistConsultCard and TrainingCard if they aren't imported
// Replace these with your actual imports if they are in separate files
import StylistConsultCard from "./StylistConsultCard";
import TrainingCard from "./TrainingCard";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#e6b7af] text-stone-900 selection:bg-pink-100">
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* Header Section */}
        <div className="mb-16 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-pink-600 font-bold tracking-widest uppercase text-xs mb-3 justify-center md:justify-start"
          >
            <Sparkles className="w-4 h-4" />
            Jennie's Hairs Collection
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-stone-950">
            About Jennie's Hairs Collection
          </h1>
          <p className="mt-4 text-stone-500 max-w-xl">
            Defining luxury through quality, expertise, and a passion for making every woman feel like royalty.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <BrandStoryCard />
          
          {/* Ensure these components are exported correctly from their files */}
          <StylistConsultCard />
          <TrainingCard />
        </div>

        {/* Footer Accent */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-20 text-center text-stone-400 text-sm font-medium italic"
        >
          Established 2019 — Serving Beauty Worldwide.
        </motion.div>
      </div>
    </div>
  );
}