"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  FolderKanban,
  Users,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  Loader2,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";

const STATUS_CONFIG = {
  active:  { label: "Activo",      icon: Zap,          color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.2)"   },
  review:  { label: "En revisión", icon: AlertCircle,  color: "#A855F7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)"  },
  pending: { label: "Pendiente",   icon: Clock,        color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  done:    { label: "Completado",  icon: CheckCircle2, color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
};

type StatusKey = keyof typeof STATUS_CONFIG | "all";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants: Variants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen]         = useState(false);
  const [search, setSearch]                   = useState("");
  const [statusFilter, setStatusFilter]       = useState<StatusKey>("all");
  const [viewMode, setViewMode]               = useState<"grid" | "list">("grid");
  const { projects, isLoading, error }        = useProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--dash-accent)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="w-8 h-8 text-red-500" />
        <p className="text-red-400 font-mono text-sm">Error: {error.message}</p>
      </div>
    );
  }

  // ── Filters ─────────────────────────────────────────────────────────────────
  const filtered = (projects ?? []).filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // ── Stats ────────────────────────────────────────────────────────────────────
  const activeCount = (projects ?? []).filter((p) => p.status === "active").length;
  const totalTasks  = (projects ?? []).reduce((a, p) => a + (p.tasks?.total || 0), 0);
  const doneTasks   = (projects ?? []).reduce((a, p) => a + (p.tasks?.done  || 0), 0);

  const FILTER_PILLS: { key: StatusKey; label: string }[] = [
    { key: "all",     label: "Todos" },
    { key: "active",  label: "Activos" },
    { key: "review",  label: "En revisión" },
    { key: "pending", label: "Pendientes" },
    { key: "done",    label: "Completados" },
  ];

  return (
    <div className="p-6 md:p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
            <span style={{ color: "var(--dash-accent)" }}>$</span> ls ~/projects
          </p>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
            Mis Proyectos
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
            {(projects ?? []).length} proyectos en este workspace
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold active:scale-[0.97] transition-all duration-200"
          style={{ background: "var(--dash-accent)", color: "#020617", boxShadow: "0 0 20px rgba(34,197,94,0.25)" }}
        >
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Proyectos Activos", value: activeCount, icon: FolderKanban, color: "#22C55E" },
          { label: "Tareas totales",    value: totalTasks,  icon: AlertCircle,  color: "#A855F7" },
          { label: "Completadas",       value: doneTasks,   icon: CheckCircle2, color: "#22C55E" },
          { label: "Miembros",          value: 1,           icon: Users,        color: "#F59E0B" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 flex items-center gap-4 border"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: "var(--dash-text)" }}>{stat.value}</p>
              <p className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar: Search + Filter + View Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div
          className="relative flex items-center w-full sm:w-72"
        >
          <Search
            className="absolute left-3 w-3.5 h-3.5 pointer-events-none"
            style={{ color: "var(--dash-text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar proyecto…"
            className="w-full pl-9 pr-3.5 py-2 rounded-lg border text-sm font-mono outline-none transition-all"
            style={{
              background:  "var(--dash-surface)",
              borderColor: "var(--dash-border)",
              color:       "var(--dash-text)",
            }}
            onFocus={(e)  => (e.currentTarget.style.borderColor = "#22C55E")}
            onBlur={(e)   => (e.currentTarget.style.borderColor = "var(--dash-border)")}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {FILTER_PILLS.map((pill) => {
              const active = statusFilter === pill.key;
              const cfg    = pill.key !== "all" ? STATUS_CONFIG[pill.key as keyof typeof STATUS_CONFIG] : null;
              return (
                <button
                  key={pill.key}
                  onClick={() => setStatusFilter(pill.key)}
                  className="px-3 py-1.5 rounded-full text-[11px] font-mono font-semibold border transition-all duration-200"
                  style={{
                    background:  active ? (cfg ? cfg.bg  : "rgba(34,197,94,0.12)") : "var(--dash-surface)",
                    borderColor: active ? (cfg ? cfg.border : "rgba(34,197,94,0.3)") : "var(--dash-border)",
                    color:       active ? (cfg ? cfg.color : "#22C55E") : "var(--dash-text-muted)",
                  }}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* View Toggle */}
          <div
            className="flex items-center rounded-lg border p-0.5 gap-0.5 ml-1"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className="w-7 h-7 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: viewMode === mode ? "var(--dash-surface-hover)" : "transparent",
                  color:      viewMode === mode ? "var(--dash-text)" : "var(--dash-text-muted)",
                }}
              >
                {mode === "grid" ? <LayoutGrid className="w-3.5 h-3.5" /> : <List className="w-3.5 h-3.5" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Empty state */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 && (projects ?? []).length > 0 && (
          <motion.div
            key="empty-filter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 gap-3"
          >
            <Search className="w-8 h-8" style={{ color: "var(--dash-text-muted)" }} />
            <p className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
              Ningún proyecto coincide con los filtros aplicados.
            </p>
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="text-xs font-mono underline"
              style={{ color: "var(--dash-accent)" }}
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GRID VIEW ───────────────────────────────────────────────────────── */}
      {viewMode === "grid" && filtered.length > 0 && (
        <motion.div
          key="grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((project) => {
            const status     = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
            const StatusIcon = status.icon;
            return (
              <motion.div key={project.id} variants={cardVariants}>
                <Link href={`/projects/${project.id}`} className="block group">
                  <div
                    className="rounded-2xl border p-6 h-full cursor-pointer transition-all duration-300 flex flex-col"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--dash-surface)"; }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                        style={{ background: `${project.color}15`, borderColor: `${project.color}30` }}
                      >
                        <FolderKanban className="w-5 h-5" style={{ color: project.color }} />
                      </div>
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium"
                        style={{ color: status.color, background: status.bg, borderColor: status.border }}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </div>
                    </div>

                    <h2 className="font-bold text-base mb-1" style={{ color: "var(--dash-text)" }}>{project.name}</h2>
                    <p className="text-xs leading-relaxed mb-5 flex-1" style={{ color: "var(--dash-text-muted)" }}>
                      {project.description || "Sin descripción"}
                    </p>

                    <div className="mb-5 mt-auto">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>Progreso</span>
                        <span className="text-xs font-bold font-mono" style={{ color: project.color }}>{project.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full" style={{ background: "var(--dash-border)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                          className="h-full rounded-full"
                          style={{ background: project.color, boxShadow: `0 0 12px ${project.color}60` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.members?.map((initials) => (
                          <div
                            key={initials}
                            className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                            style={{ borderColor: "var(--dash-bg)", background: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                          >
                            {initials}
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "var(--dash-text-muted)" }}>
                        <span className="font-mono">{project.tasks?.done || 0}/{project.tasks?.total || 0} tareas</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* New Project Card */}
          <motion.div variants={cardVariants}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full h-full min-h-[240px] rounded-2xl border-2 border-dashed bg-transparent transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer hover:border-[#22C55E30]"
              style={{ borderColor: "var(--dash-border)" }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-[#22C55E10]"
                style={{ background: "var(--dash-surface)", border: `1px solid var(--dash-border)` }}
              >
                <Plus className="w-5 h-5 group-hover:text-[#22C55E] transition-colors" style={{ color: "var(--dash-text-muted)" }} />
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--dash-text-muted)" }}>Crear nuevo proyecto</p>
              <p className="text-xs font-mono" style={{ color: "var(--dash-border)" }}>&gt; init project</p>
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* ── LIST VIEW ───────────────────────────────────────────────────────── */}
      {viewMode === "list" && filtered.length > 0 && (
        <motion.div
          key="list"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-2"
        >
          {/* List Header */}
          <div
            className="grid grid-cols-[1fr_120px_120px_100px_40px] items-center px-4 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest"
            style={{ color: "var(--dash-text-muted)" }}
          >
            <span>Proyecto</span>
            <span>Estado</span>
            <span>Progreso</span>
            <span>Tareas</span>
            <span />
          </div>

          {filtered.map((project) => {
            const status     = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
            const StatusIcon = status.icon;
            return (
              <motion.div key={project.id} variants={cardVariants}>
                <Link href={`/projects/${project.id}`}>
                  <div
                    className="grid grid-cols-[1fr_120px_120px_100px_40px] items-center px-4 py-3.5 rounded-xl border transition-all duration-200"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--dash-surface)"; }}
                  >
                    {/* Name */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                        style={{ background: `${project.color}15`, borderColor: `${project.color}30` }}
                      >
                        <FolderKanban className="w-4 h-4" style={{ color: project.color }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: "var(--dash-text)" }}>{project.name}</p>
                        <p className="text-[11px] font-mono truncate" style={{ color: "var(--dash-text-muted)" }}>
                          {project.description || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div
                      className="flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-full border text-[11px] font-mono"
                      style={{ color: status.color, background: status.bg, borderColor: status.border }}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--dash-border)" }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          transition={{ duration: 0.7, ease: "easeOut" }}
                          className="h-full rounded-full"
                          style={{ background: project.color }}
                        />
                      </div>
                      <span className="text-[11px] font-mono shrink-0" style={{ color: project.color }}>
                        {project.progress}%
                      </span>
                    </div>

                    {/* Tasks */}
                    <span className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
                      {project.tasks?.done || 0}/{project.tasks?.total || 0}
                    </span>

                    {/* Arrow */}
                    <ChevronRight className="w-4 h-4 justify-self-end" style={{ color: "var(--dash-text-muted)" }} />
                  </div>
                </Link>
              </motion.div>
            );
          })}

          {/* List - Add new */}
          <motion.div variants={cardVariants}>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full px-4 py-3.5 rounded-xl border-2 border-dashed flex items-center gap-3 transition-colors duration-200 hover:border-[#22C55E30]"
              style={{ borderColor: "var(--dash-border)" }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--dash-surface)" }}>
                <Plus className="w-4 h-4" style={{ color: "var(--dash-text-muted)" }} />
              </div>
              <span className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>Crear nuevo proyecto</span>
            </button>
          </motion.div>
        </motion.div>
      )}

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
