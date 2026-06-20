"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, UserCheck, Terminal, Cpu } from "lucide-react";
import { MatrixRain } from "@/components/ascii/MatrixRain";

const team = [
  {
    name: "Daniel Steve Montaño",
    role: "Full-stack & Arquitectura",
    init: "DS",
    photo: "/team/daniel.png",
    gradient: "from-blue-500 to-indigo-600",
    accent: "text-blue-500",
  },
  {
    name: "Luisa Fernanda Lucio",
    role: "Desarrollo / QA",
    init: "LF",
    photo: "/team/luisa.png",
    gradient: "from-violet-500 to-purple-600",
    accent: "text-violet-500",
  },
  {
    name: "Didier Andres Congo",
    role: "QA & Automatización",
    init: "DA",
    photo: "/team/didier.png",
    gradient: "from-emerald-500 to-teal-600",
    accent: "text-emerald-500",
  },
];

export const TeamSection = () => {
  return (
    <section className="py-24 md:py-36 relative overflow-hidden bg-background border-t border-border">
      <div
        className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <h2
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05] mb-4"
            style={{ textWrap: "balance" } as React.CSSProperties}
          >
            Las mentes detrás
            <br />
            <span className="text-foreground/35">del proyecto.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
            Equipo de la Universidad Del Pacífico construyendo el futuro de la gestión ágil.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
          {team.map((member, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col p-6 items-center text-center lg:row-span-2"
            >
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 bg-gradient-to-br ${member.gradient} pointer-events-none`} />

              <div
                className={`relative w-20 h-20 rounded-xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-xl font-black mb-4 shadow-md overflow-hidden`}
              >
                <span className="absolute inset-0 flex items-center justify-center select-none">
                  {member.init}
                </span>
                <Image
                  src={member.photo}
                  alt={`Foto de ${member.name}`}
                  fill
                  className="object-cover object-top"
                  sizes="80px"
                />
              </div>

              <h3 className="font-bold text-foreground text-sm leading-tight mb-1">
                {member.name}
              </h3>
              <p className={`font-medium text-[11px] ${member.accent} mb-1`}>
                {member.role}
              </p>

              <div className="flex gap-3 mt-auto pt-4 border-t border-border/40 w-full justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                <a href="#" className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="GitHub">
                  <Github className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
                <a href="#" className="p-2 rounded-lg hover:bg-secondary transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
                </a>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-2 lg:row-span-3"
          >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden h-full flex flex-col">
              <div className="flex items-center gap-1.5 px-5 pt-4 pb-3 shrink-0">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                <div className="flex items-center gap-1.5 ml-3">
                  <Terminal className="w-3 h-3 text-zinc-500" />
                  <span className="text-zinc-500 text-[10px] font-mono">team.ascii</span>
                </div>
              </div>

              <div className="relative border-y border-zinc-800/40 overflow-hidden flex-1 min-h-[300px]">
                <MatrixRain className="absolute inset-0" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <motion.svg
                    viewBox="0 0 120 135"
                    className="w-28 h-32 md:w-32 md:h-[148px] text-green-500"
                    preserveAspectRatio="xMidYMid meet"
                    animate={{ opacity: [0.12, 0.22, 0.12] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <defs>
                      <filter id="screenGlow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>
                    <g fill="currentColor" opacity="0.18">
                      <rect x="8" y="2" width="104" height="80" rx="5" />
                      <path d="M 52 82 L 68 82 L 65 92 L 55 92 Z" />
                      <rect x="44" y="92" width="32" height="6" rx="2" />
                      <rect x="22" y="105" width="76" height="22" rx="4" />
                    </g>
                    <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
                      <rect x="8" y="2" width="104" height="80" rx="5" />
                      <rect x="16" y="9" width="88" height="62" rx="3" filter="url(#screenGlow)" strokeWidth="2" opacity="0.6" />
                      <line x1="30" y1="113" x2="62" y2="113" />
                      <line x1="30" y1="118" x2="66" y2="118" />
                      <line x1="30" y1="123" x2="58" y2="123" />
                      <circle cx="88" cy="6" r="1.5" fill="currentColor" opacity="0.5" />
                    </g>
                  </motion.svg>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 pb-4 pt-3 shrink-0 font-mono text-[10px] text-green-400/60">
                <div className="flex items-center gap-2">
                  <Cpu className="w-3 h-3 text-green-500/60" />
                  <span>kairo.team — matrix v2.1</span>
                </div>
                <div className="flex items-center gap-3">
                  <span>members: 3</span>
                  <span>commits: 400+</span>
                  <span className="animate-pulse">●</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-3 lg:row-start-3 flex flex-col sm:flex-row gap-2"
          >
            <div className="flex-1 rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 shadow-md">
                <UserCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Asesor de Proyecto
                </p>
                <h4 className="font-bold text-foreground text-lg">Daniel Bustos</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Universidad Del Pacífico</p>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 shadow-sm shrink-0">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-md">
                <span className="text-xl">🎓</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                  Universidad del Pacífico
                </p>
                <p className="text-xs text-muted-foreground">
                  Formando profesionales que transforman el mundo.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
