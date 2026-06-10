"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Kanban, Timer, Terminal, Zap, Bell, Database } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

// ─── Mini Terminal ASCII animator ───────────────────────────────────────────
const lines = [
  "> init kairo --mode zen",
  "> syncing team... [====] 100%",
  "> kanban: 12 tasks loaded",
  "> pomodoro: 25:00 ▶",
  "> energy: ██████░░ 74%",
  "> [OK] zero distractions",
];

function TerminalTicker() {
  const [visible, setVisible] = useState<string[]>([]);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      const line = lines[i];
      if (line !== undefined) { setVisible((p) => [...p, line]); }
      i++;
      if (i >= lines.length) clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="font-mono text-[11px] leading-relaxed select-none">
      {visible.filter((l): l is string => typeof l === "string").map((l, i) => (
        <div key={i} className="flex gap-2">
          <span className="text-green-400">{l.startsWith(">") ? "" : "  "}</span>
          <span className={l.startsWith(">") ? "text-green-400" : "text-emerald-300/70"}>{l}</span>
        </div>
      ))}
      <span className="inline-block w-2 h-3 bg-green-400 animate-pulse ml-1" />
    </div>
  );
}

// ─── 3D Tilt Card ────────────────────────────────────────────────────────────
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.02)`;
  };
  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)";
  };
  return (
    <div
      ref={ref}
      className={className}
      style={{ transition: "transform 0.15s ease-out", transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

// ─── Kanban preview ──────────────────────────────────────────────────────────
const cols = [
  { label: "Backlog", color: "bg-zinc-400 dark:bg-zinc-600", items: ["Rediseño hero", "Auth flow"] },
  { label: "En progreso", color: "bg-blue-500", items: ["Kanban live", "Pomodoro"] },
  { label: "Listo", color: "bg-green-500", items: ["Supabase RT", "PWA"] },
];

function KanbanPreview() {
  return (
    <div className="flex gap-2 mt-auto w-full">
      {cols.map((col) => (
        <div key={col.label} className="flex-1 rounded-xl bg-black/5 dark:bg-white/5 p-2 border border-black/10 dark:border-white/10">
          <div className="flex items-center gap-1.5 mb-2">
            <span className={`w-2 h-2 rounded-full ${col.color}`} />
            <span className="text-[9px] font-bold uppercase tracking-wider text-foreground/50">{col.label}</span>
          </div>
          {col.items.map((item) => (
            <div key={item} className="mb-1 rounded-md bg-background border border-border px-2 py-1 text-[10px] font-medium text-foreground/70 shadow-sm">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Energy bars ─────────────────────────────────────────────────────────────
const energyDays = [
  { day: "L", pct: 40 },
  { day: "M", pct: 72 },
  { day: "X", pct: 55 },
  { day: "J", pct: 91 },
  { day: "V", pct: 65 },
];

// ─── Main component ───────────────────────────────────────────────────────────
export const BentoFeatures = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const ySpring = useSpring(y, { stiffness: 80, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 md:py-36 bg-background overflow-hidden"
    >
      {/* Subtle ambient gradient behind the grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,hsl(var(--primary)/0.06),transparent)] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-2xl"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.05] mb-4"
            style={{ textWrap: "balance" } as React.CSSProperties}>
            Todo lo que necesitas.<br />
            <span className="text-foreground/40">Nada que te distraiga.</span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
            KairoTask combina gestión ágil, control de energía y colaboración en tiempo real en una sola interfaz dev-centric.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[minmax(180px,auto)]">

          {/* 1 ── Kanban Large (spans 7 / 2 rows) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7 row-span-2"
          >
            <TiltCard className="h-full rounded-2xl border border-border bg-card overflow-hidden p-6 md:p-8 flex flex-col shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                    <Kanban className="w-3 h-3" /> Gestión Ágil
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Tableros Kanban interactivos</h3>
                  <p className="text-muted-foreground text-sm mt-1 max-w-xs leading-relaxed">
                    Sprints personalizables, drag & drop, y métricas en tiempo real para tu equipo.
                  </p>
                </div>
              </div>
              <KanbanPreview />
            </TiltCard>
          </motion.div>

          {/* 2 ── Modo Zen Terminal (5 cols / 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 row-span-1"
          >
            <div className="h-full rounded-2xl overflow-hidden border border-zinc-800 dark:border-zinc-700 bg-zinc-950 p-5 flex flex-col shadow-sm">
              {/* Terminal chrome */}
              <div className="flex items-center gap-1.5 mb-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="ml-2 text-zinc-500 text-[10px] font-mono">kairo — zen mode</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Terminal className="w-4 h-4 text-green-400 shrink-0" />
                <h3 className="text-sm font-bold text-white">Modo Zen & ASCII</h3>
              </div>
              <TerminalTicker />
            </div>
          </motion.div>

          {/* 3 ── Pomodoro (5 cols / 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-5 row-span-1"
          >
            <TiltCard className="h-full rounded-2xl border border-border bg-card p-5 flex items-center gap-6 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              {/* Animated ring */}
              <div className="relative shrink-0 w-20 h-20">
                <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="34" strokeWidth="6" stroke="currentColor" className="text-muted/40" fill="none" />
                  <motion.circle
                    cx="40" cy="40" r="34" strokeWidth="6" fill="none"
                    stroke="#f97316"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 34 * 0.3 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-foreground">25:00</span>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-[10px] font-semibold mb-2">
                  <Timer className="w-2.5 h-2.5" /> Pomodoro
                </div>
                <h3 className="text-lg font-bold text-foreground">Control del tiempo</h3>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed max-w-[160px]">
                  Sprints de trabajo que previenen la fatiga mental.
                </p>
              </div>
            </TiltCard>
          </motion.div>

          {/* 4 ── Energía (4 cols / 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-4 row-span-1"
          >
            <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-yellow-400/15 p-2 rounded-xl">
                  <Zap className="w-4 h-4 text-yellow-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Métricas de energía</h3>
                  <p className="text-[10px] text-muted-foreground">Anti-burnout integrado</p>
                </div>
              </div>
              <div className="flex-1 relative mt-4 min-h-[80px]">
                <div className="absolute inset-x-0 bottom-6 top-2">
                  <svg viewBox="0 0 200 60" preserveAspectRatio="none" className="w-full h-full overflow-visible drop-shadow-md">
                    <motion.path
                      d="M 0 50 C 25 50, 25 20, 50 20 C 75 20, 75 40, 100 40 C 125 40, 125 0, 150 0 C 175 0, 175 25, 200 25"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                    />
                  </svg>
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
                  {energyDays.map(({ day }) => (
                    <span key={day} className="text-[9px] font-mono text-muted-foreground font-bold">{day}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* 5 ── Realtime (4 cols / 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-4 row-span-1"
          >
            <TiltCard className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-500/10 p-2 rounded-xl">
                  <Database className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Colaboración real</h3>
                  <p className="text-[10px] text-muted-foreground">Supabase Realtime</p>
                </div>
              </div>
              {/* Live avatars */}
              <p className="text-[10px] text-muted-foreground mt-auto mb-3">3 miembros activos ahora</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[
                    { src: "/team/daniel.png", alt: "Daniel" },
                    { src: "/team/luisa.png", alt: "Luisa" },
                    { src: "/team/didier.png", alt: "Didier" }
                  ].map((user, idx) => (
                    <div key={user.alt} className="w-8 h-8 rounded-full border-2 border-background overflow-hidden relative bg-blue-500 shadow-sm" style={{ zIndex: 10 - idx }}>
                      <Image
                        src={user.src}
                        alt={user.alt}
                        fill
                        className="object-cover object-top"
                        sizes="32px"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-green-500">live</span>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* 6 ── Notificaciones (4 cols / 1 row) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-4 row-span-1"
          >
            <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col shadow-sm overflow-hidden relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-rose-500/10 p-2 rounded-xl">
                  <Bell className="w-4 h-4 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Alertas críticas</h3>
                  <p className="text-[10px] text-muted-foreground">BillionMail integrado</p>
                </div>
              </div>
              {/* Toast preview */}
              <div className="mt-auto space-y-2">
                {["Deadline: Sprint 4 mañana", "Daniel actualizó #15"].map((msg, i) => (
                  <motion.div
                    key={msg}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.15 }}
                    className="flex items-center gap-2 rounded-lg bg-rose-500/8 dark:bg-rose-500/10 border border-rose-500/20 px-3 py-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                    <span className="text-[10px] text-foreground/80 font-medium">{msg}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Parallax decorative element */}
      <motion.div
        style={{ y: ySpring }}
        className="absolute right-0 top-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl pointer-events-none"
      />
    </section>
  );
};
