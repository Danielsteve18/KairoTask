import React from 'react';
import { Github, Linkedin } from 'lucide-react';
import Link from 'next/link';

export const LiquidDock = () => {
  return (
    <div className="flex items-center gap-4 p-2 rounded-2xl relative group pointer-events-auto">
      {/* Liquid / Glass Background */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-white/5 backdrop-blur-xl
        shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(255,255,255,0.9),inset_-3px_-3px_0.5px_-3px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]
        before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/20 before:to-transparent
        transition-all duration-300 group-hover:bg-white/10"
      />
      
      {/* Github Button */}
      <Link href="https://github.com" target="_blank" className="relative p-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        <Github size={24} className="text-zinc-300 hover:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </Link>

      {/* Divider */}
      <div className="w-[1px] h-8 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

      {/* LinkedIn Button */}
      <Link href="https://linkedin.com" target="_blank" className="relative p-3 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
        <Linkedin size={24} className="text-zinc-300 hover:text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
      </Link>
    </div>
  );
};
