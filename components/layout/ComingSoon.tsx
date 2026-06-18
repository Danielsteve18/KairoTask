"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

interface ComingSoonProps {
  title: string;
  command: string;
  description: string;
}

export function ComingSoon({ title, command, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[60vh] gap-6 p-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-16 h-16 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center"
      >
        <Terminal className="w-7 h-7 text-[#22C55E]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <p className="text-xs font-mono text-[#475569] mb-2 uppercase tracking-widest">
          <span className="text-[#22C55E]">$</span> kairo {command} --status
        </p>
        <h1 className="text-3xl font-black text-[#F8FAFC] mb-2">{title}</h1>
        <p className="text-sm text-[#475569] max-w-xs leading-relaxed">{description}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="px-4 py-2 rounded-full border border-[#22C55E]/20 bg-[#22C55E]/5 text-xs font-mono text-[#22C55E] flex items-center gap-2"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
        En construcción · Sprint próximo
      </motion.div>
    </div>
  );
}
