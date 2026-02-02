"use client";

import { motion } from "framer-motion";
import { Scissors } from "lucide-react";
import { whatsappLink } from "@/utils/whatsapp";

export function StylistConsultCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg"
    >
      <Scissors className="w-10 h-10 text-pink-600 mb-4" />

      <h3 className="text-xl font-semibold mb-3">Professional Wig Styling & Care</h3>

      <p className="text-sm leading-relaxed mb-6">
        I’m a professional stylist. You can consult me on how to style your wig,
        revamp an old one, care for luxury hair, or book an appointment for a
        styling job.
      </p>

      <a
        href={whatsappLink("Hi my name is ___, I want to consult you about styling or revamping my wig.")}
        className="inline-block text-sm font-medium px-5 py-2 rounded-full bg-pink-600 text-white"
      >
        Book a Consultation
      </a>
    </motion.div>
  );
}

export default StylistConsultCard;
