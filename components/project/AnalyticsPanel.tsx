"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3, PieChart, TrendingUp, Loader2,
  AlertCircle, Zap, Clock, CheckCircle2, Circle,
} from "lucide-react";
import { useProjectStats } from "@/hooks/useBurndown";

interface AnalyticsPanelProps {
  projectId: string;
}

export function AnalyticsPanel({ projectId }: AnalyticsPanelProps) {
  const { stats, isLoading } = useProjectStats(projectId);
  const [tab, setTab] = useState<"overview" | "distribution">("overview");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center py-12 gap-2">
        <AlertCircle className="w-4 h-4" style={{ color: "#EF4444" }} />
        <span className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
          No se pudieron cargar las estadísticas.
        </span>
      </div>
    );
  }

  const BARS = [
    { label: "Backlog", value: stats.byStatus.backlog, color: "#475569" },
    { label: "En Progreso", value: stats.byStatus.inProgress, color: "#F59E0B" },
    { label: "Revisión", value: stats.byStatus.review, color: "#A855F7" },
    { label: "Completado", value: stats.byStatus.done, color: "#22C55E" },
  ];

  const maxBarValue = Math.max(...BARS.map((b) => b.value), 1);

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-0.5 rounded-lg border w-fit"
        style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
      >
        <button
          onClick={() => setTab("overview")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono transition-all"
          style={{
            background: tab === "overview" ? "var(--dash-surface)" : "transparent",
            color: tab === "overview" ? "var(--dash-text)" : "var(--dash-text-muted)",
          }}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Vista general
        </button>
        <button
          onClick={() => setTab("distribution")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-mono transition-all"
          style={{
            background: tab === "distribution" ? "var(--dash-surface)" : "transparent",
            color: tab === "distribution" ? "var(--dash-text)" : "var(--dash-text-muted)",
          }}
        >
          <PieChart className="w-3.5 h-3.5" />
          Distribución
        </button>
      </div>

      {tab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Completion rate */}
          <div
            className="p-5 rounded-xl border"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
                  Progreso general
                </span>
              </div>
              <span className="text-2xl font-black" style={{ color: "var(--dash-accent)" }}>
                {stats.completionRate}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "var(--dash-accent)", boxShadow: "0 0 12px rgba(34,197,94,0.4)" }}
              />
            </div>
            <p className="text-[10px] font-mono mt-2" style={{ color: "var(--dash-text-muted)" }}>
              {stats.byStatus.done} de {stats.total} tareas completadas
            </p>
          </div>

          {/* Status bars */}
          <div className="space-y-2">
            {BARS.map((bar) => (
              <div key={bar.label} className="flex items-center gap-3">
                <span className="text-[11px] font-mono w-24 shrink-0" style={{ color: "var(--dash-text)" }}>
                  {bar.label}
                </span>
                <div className="flex-1 h-5 rounded-lg overflow-hidden" style={{ background: "var(--dash-bg)" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(bar.value / maxBarValue) * 100}%` }}
                    transition={{ duration: 0.6, delay: BARS.indexOf(bar) * 0.1 }}
                    className="h-full rounded-lg flex items-center justify-end px-2"
                    style={{
                      background: bar.color,
                      opacity: 0.7,
                      minWidth: bar.value > 0 ? "20px" : "0",
                    }}
                  >
                    <span className="text-[9px] font-mono font-bold text-white">{bar.value}</span>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {tab === "distribution" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Priority distribution */}
          <div
            className="p-4 rounded-xl border"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: "var(--dash-text-muted)" }}>
              Por prioridad
            </p>
            <div className="space-y-2">
              {([
                { label: "Critical", value: stats.byPriority.critical, color: "#EF4444", icon: AlertCircle },
                { label: "High", value: stats.byPriority.high, color: "#F59E0B", icon: Zap },
                { label: "Medium", value: stats.byPriority.medium, color: "#A855F7", icon: Clock },
                { label: "Low", value: stats.byPriority.low, color: "#94A3B8", icon: Circle },
              ] as const).map((p) => {
                const pct = stats.total > 0 ? Math.round((p.value / stats.total) * 100) : 0;
                return (
                  <div key={p.label} className="flex items-center gap-2">
                    <p.icon className="w-3 h-3" style={{ color: p.color }} />
                    <span className="text-[11px] font-mono flex-1" style={{ color: "var(--dash-text)" }}>
                      {p.label}
                    </span>
                    <span className="text-[11px] font-mono" style={{ color: p.color }}>
                      {p.value} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status summary */}
          <div
            className="p-4 rounded-xl border"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <p className="text-[10px] font-mono uppercase tracking-wider mb-3" style={{ color: "var(--dash-text-muted)" }}>
              Resumen
            </p>
            <div className="space-y-3">
              <div>
                <p className="text-3xl font-black" style={{ color: "var(--dash-text)" }}>{stats.total}</p>
                <p className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>Tareas totales</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {BARS.map((b) => (
                  <div key={b.label}>
                    <p className="text-lg font-bold" style={{ color: b.color }}>{b.value}</p>
                    <p className="text-[9px] font-mono" style={{ color: "var(--dash-text-muted)" }}>{b.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
