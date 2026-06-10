"use client";

import { motion } from "framer-motion";
import { Database, Globe, Layout, MonitorPlay, Zap, Layers } from "lucide-react";

const technologies = [
  { name: "Next.js 16", icon: Globe, color: "text-zinc-100" },
  { name: "Supabase", icon: Database, color: "text-green-500" },
  { name: "Tailwind CSS", icon: Layout, color: "text-cyan-400" },
  { name: "Playwright", icon: MonitorPlay, color: "text-rose-500" },
  { name: "GSAP & Framer", icon: Zap, color: "text-yellow-400" },
  { name: "Zustand", icon: Layers, color: "text-amber-600" },
];

export const TechStack = () => {
  // Duplicate for seamless marquee
  const items = [...technologies, ...technologies, ...technologies, ...technologies];

  return (
    <section className="py-24 overflow-hidden border-y border-border bg-card/20 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
      

      <div className="relative flex overflow-hidden w-full group">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />
        
        <motion.div 
          className="flex gap-12 sm:gap-24 items-center whitespace-nowrap px-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
        >
          {items.map((tech, i) => (
            <div key={i} className="flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity cursor-default grayscale hover:grayscale-0">
              <tech.icon className={`w-8 h-8 ${tech.color}`} />
              <span className="text-2xl font-bold tracking-tight text-foreground">{tech.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
