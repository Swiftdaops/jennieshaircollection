"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const messages = [
  "Move Freely. Shine Softly.",
  "Designed for Elegant Queens",
  "For Princesses Who Lead",
  "Luxury You Can Feel",
  "Confidence, Woven In",
  "Because Royalty Deserves Better",
  "Grace in Every Strand",
  "High-Heat Resistant — Styled Without Fear",
  "10× Style Memory, Because Beauty Remembers",
  "Styles That Stay, Confidence That Lasts",
  "Pre-Treated for Scalp & Skin Comfort",
  "ReXI™ Lab-Made Hair",
  "Hair That Moves Like Royalty",
  "Instant Glam, Effortlessly You",
  "Crafted for Queens. Styled for Power.",
];

export default function LuxuryMessageCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500); // slower rotation

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full " style={{ backgroundColor: "#cea88d" }}>
      <div className="mx-auto max-w-6xl overflow-hidden flex items-center h-12">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full mx-3 text-center text-sm sm:text-base font-medium tracking-wide text-black"
          >
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

    </div>
  );
}
