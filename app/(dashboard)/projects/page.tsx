"use client";

import { useState } from "react";
import { motion, type Variants } from "framer-motion";
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
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { CreateProjectModal } from "@/components/project/CreateProjectModal";

const STATUS_CONFIG = {
  active:  { label: "Activo",       icon: Zap,          color: "#22C55E", bg: "rgba(34,197,94,0.1)",   border: "rgba(34,197,94,0.2)"   },
  review:  { label: "En revisión",  icon: AlertCircle,  color: "#A855F7", bg: "rgba(168,85,247,0.1)",  border: "rgba(168,85,247,0.2)"  },
  pending: { label: "Pendiente",    icon: Clock,        color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.2)"  },
  done:    { label: "Completado",   icon: CheckCircle2, color: "#94A3B8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.2)" },
};

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function ProjectsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, isLoading, error } = useProjects();

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
        <p className="text-red-400 font-mono text-sm">Error cargando proyectos: {error.message}</p>
      </div>
    );
  }

  const activeProjectsCount = projects?.filter(p => p.status === 'active').length || 0;
  const totalTasks = projects?.reduce((acc, p) => acc + (p.tasks?.total || 0), 0) || 0;
  const doneTasks = projects?.reduce((acc, p) => acc + (p.tasks?.done || 0), 0) || 0;
  const totalMembers = 1; // Temporariamente 1 por ser el owner

  return (
    <div className="p-6 md:p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
            <span style={{ color: "var(--dash-accent)" }}>$</span> ls ~/projects
          </p>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
            Mis Proyectos
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
            {projects?.length || 0} proyectos en total en este workspace
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Proyectos Activos", value: activeProjectsCount, icon: FolderKanban, color: "#22C55E" },
          { label: "Tareas totales",    value: totalTasks,          icon: AlertCircle,  color: "#A855F7" },
          { label: "Completadas",       value: doneTasks,           icon: CheckCircle2, color: "#22C55E" },
          { label: "Miembros",          value: totalMembers,        icon: Users,        color: "#F59E0B" },
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

      {/* Project Cards Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
      >
        {projects?.map((project) => {
          const status = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active;
          const StatusIcon = status.icon;

          return (
            <motion.div key={project.id} variants={cardVariants}>
              <Link href={`/projects/${project.id}`} className="block group">
                <div
                  className="rounded-2xl border p-6 h-full cursor-pointer transition-all duration-300 flex flex-col"
                  style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--dash-surface)";
                  }}
                >
                  {/* Card Header */}
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

                  <h2 className="font-bold text-base mb-1 transition-colors" style={{ color: "var(--dash-text)" }}>
                    {project.name}
                  </h2>
                  <p className="text-xs leading-relaxed mb-5 flex-1" style={{ color: "var(--dash-text-muted)" }}>
                    {project.description || "Sin descripción"}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-5 mt-auto">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                        Progreso
                      </span>
                      <span className="text-xs font-bold font-mono" style={{ color: project.color }}>
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full" style={{ background: "var(--dash-border)" }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{ background: project.color, boxShadow: `0 0 12px ${project.color}60` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
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

                    <div className="flex items-center gap-1 text-xs transition-colors duration-200" style={{ color: "var(--dash-text-muted)" }}>
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
            className="w-full h-full min-h-[240px] rounded-2xl border-2 border-dashed bg-transparent transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer"
            style={{ borderColor: "var(--dash-border)" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
              style={{ background: "var(--dash-surface)", border: `1px solid var(--dash-border)` }}
            >
              <Plus className="w-5 h-5" style={{ color: "var(--dash-text-muted)" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--dash-text-muted)" }}>Crear nuevo proyecto</p>
            <p className="text-xs font-mono" style={{ color: "var(--dash-border)" }}>&gt; init project</p>
          </button>
        </motion.div>
      </motion.div>

      <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
