"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Zap, Flame } from "lucide-react";
import { usePomodoroStore } from "@/store/usePomodoroStore";
import { usePomodoroSessions } from "@/hooks/usePomodoroSessions";

function StatCard({
  icon: Icon,
  label,
  value,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="rounded-xl border p-4"
      style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
          {label}
        </span>
      </div>
      <p className="text-2xl font-black tabular-nums" style={{ color: "var(--dash-text)" }}>
        {value}
      </p>
    </motion.div>
  );
}

export function PomodoroStats() {
  const totalFocusToday = usePomodoroStore((s) => s.totalFocusToday);
  const cycleCount = usePomodoroStore((s) => s.cycleCount);
  const { weekStats, completedSessions, isLoading } = usePomodoroSessions();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--dash-accent)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  const maxMinutes = Math.max(...weekStats.map((d) => d.total_minutes), 1);

  return (
    <div className="space-y-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--dash-text-muted)" }}>
        Estadísticas
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          icon={Clock}
          label="Hoy"
          value={`${totalFocusToday} min`}
          delay={0}
        />
        <StatCard
          icon={CheckCircle2}
          label="Completados"
          value={completedSessions}
          delay={0.05}
        />
        <StatCard
          icon={Zap}
          label="Ciclos hoy"
          value={cycleCount}
          delay={0.1}
        />
        <StatCard
          icon={Flame}
          label="Racha"
          value={`${cycleCount}`}
          delay={0.15}
        />
      </div>

      {/* Weekly chart */}
      <div className="rounded-xl border p-4" style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}>
        <h3 className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color: "var(--dash-text-muted)" }}>
          Últimos 7 días
        </h3>
        <div className="flex items-end gap-2 h-24">
          {weekStats.map((day, i) => (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-1.5">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${(day.total_minutes / maxMinutes) * 100}%` }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="w-full rounded-md"
                style={{
                  background: day.total_minutes > 0
                    ? "var(--dash-accent)"
                    : "var(--dash-border)",
                  opacity: day.total_minutes > 0 ? 1 : 0.3,
                  minHeight: day.total_minutes > 0 ? 4 : 2,
                }}
              />
              <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                {day.date.slice(0, 3)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
