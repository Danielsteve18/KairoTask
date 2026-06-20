"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, UserCheck, Terminal } from "lucide-react";
import { AsciiAnimation } from "@/components/ascii/AsciiAnimation";
import { skullFrames } from "@/lib/ascii/frames";

const team = [
  {
    name: "Daniel Steve Montaño",
    role: "Full-stack & Arquitectura",
    init: "DS",
    photo: "/team/daniel.png",
    gradient: "from-blue-500 to-indigo-600",
    accent: "text-blue-500",
    mascotLabel: "~snake.exe",
  },
  {
    name: "Luisa Fernanda Lucio",
    role: "Desarrollo / QA",
    init: "LF",
    photo: "/team/luisa.png",
    gradient: "from-violet-500 to-purple-600",
    accent: "text-violet-500",
    mascotLabel: "~bug-hunter.sh",
  },
  {
    name: "Didier Andres Congo",
    role: "QA & Automatización",
    init: "DA",
    photo: "/team/didier.png",
    gradient: "from-emerald-500 to-teal-600",
    accent: "text-emerald-500",
    mascotLabel: "~autobot.ts",
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

      {/* Fondo animado ASCII sutil */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03] dark:opacity-[0.06] select-none">
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 scale-150">
          <AsciiAnimation
            frames={skullFrames}
            fps={6}
            className="text-foreground leading-none"
          />
        </div>
      </div>

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

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-2">
                  <a href="#" className="p-1 rounded-lg hover:bg-secondary transition-colors" aria-label="GitHub">
                    <Github className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                  <a href="#" className="p-1 rounded-lg hover:bg-secondary transition-colors" aria-label="LinkedIn">
                    <Linkedin className="w-3.5 h-3.5 text-muted-foreground" />
                  </a>
                </div>

                <div className="pt-2 flex flex-col items-center justify-center w-full border-t border-border/40">
                  <span className={`text-[9px] font-mono mb-1 opacity-50 ${member.accent}`}>
                    {member.mascotLabel}
                  </span>
                  <div className="opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <AsciiAnimation
                      frames={skullFrames.slice(0, 6)}
                      fps={4}
                      className={`text-[6px] leading-tight ${member.accent}`}
                    />
                  </div>
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
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 overflow-hidden">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500/80" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
                <span className="w-2 h-2 rounded-full bg-green-500/80" />
                <div className="flex items-center gap-1.5 ml-3">
                  <Terminal className="w-3 h-3 text-zinc-500" />
                  <span className="text-zinc-500 text-[10px] font-mono">team.ascii</span>
                </div>
              </div>
              <div className="flex justify-center">
                <AsciiAnimation
                  frames={skullFrames}
                  fps={10}
                  className="text-green-400/70 text-[6px] leading-tight overflow-hidden select-none"
                />
              </div>
              <div className="mt-3 font-mono text-[10px] text-green-400/50 space-y-0.5">
                <div>{"> Universidad Del Pacífico — 2025"}</div>
                <div>{"> members: 3 | commits: 400+ | ☕ ∞"}</div>
                <span className="inline-block w-2 h-3 bg-green-400/50 animate-pulse" />
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
