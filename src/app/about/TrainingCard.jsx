"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { whatsappLink } from "@/utils/whatsapp";

export function TrainingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
    >
      <GraduationCap className="w-10 h-10 text-pink-600 mb-4" />

      <h3 className="text-xl font-semibold mb-3">Learn the Art of Wig Styling</h3>

      <p className="text-sm leading-relaxed mb-6">
        For pretty girls who want to learn — I offer wig styling training and share free hair care tips with all my clients to help you maintain your investment.
      </p>

      <a
        href={whatsappLink("Hi my name is ___, I want to learn wig styling and hair care.")}
        className="inline-block text-sm font-medium px-5 py-2 rounded-full bg-pink-600 text-white"
      >
        Learn With Me
      </a>
    </motion.div>
  );
}

export default TrainingCard;
