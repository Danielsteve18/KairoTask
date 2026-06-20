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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {team.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: idx * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 relative flex flex-col p-6 items-center text-center"
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
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 flex flex-col gap-4 lg:pt-0"
          >
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden">
              <div className="flex items-center gap-1.5 px-5 pt-4 pb-3">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                <div className="flex items-center gap-1.5 ml-3">
                  <Terminal className="w-3 h-3 text-zinc-500" />
                  <span className="text-zinc-500 text-[10px] font-mono">team.ascii</span>
                </div>
              </div>

              <div className="relative border-y border-zinc-800/40 overflow-hidden" style={{ height: "216px" }}>
                <MatrixRain className="absolute inset-0" />

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  <motion.svg
                    viewBox="0 0 100 240"
                    className="w-20 h-48 md:w-24 md:h-56 text-green-500"
                    preserveAspectRatio="xMidYMid meet"
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <g fill="currentColor">
                      <ellipse cx="50" cy="26" rx="15" ry="16" />
                      <path d="M 29 40 C 28 6, 72 6, 71 40" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.5" />
                      <path d="M 30 54 L 70 54 C 74 100, 72 140, 72 155 L 28 155 C 28 140, 26 100, 30 54 Z" />
                      <path d="M 30 60 L 16 100" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                      <path d="M 70 60 L 84 100" stroke="currentColor" strokeWidth="9" strokeLinecap="round" />
                      <path d="M 33 155 L 24 222" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                      <path d="M 67 155 L 76 222" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                    </g>
                  </motion.svg>
                </div>
              </div>

              <div className="flex items-center justify-between px-5 pb-4 pt-3 font-mono text-[10px] text-green-400/60">
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-2xl border border-border bg-card p-6 flex items-center gap-5 shadow-sm"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
