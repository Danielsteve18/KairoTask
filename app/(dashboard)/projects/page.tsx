"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
  Plus,
  FolderKanban,
  Users,
  ChevronRight,
  Clock,
  Zap,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";

const MOCK_PROJECTS = [
  {
    id: "alpha",
    name: "KairoTask · Core",
    description: "Módulo principal de gestión ágil y tableros Kanban.",
    progress: 68,
    energy: 90,
    status: "active",
    members: ["DM", "LF", "DC"],
    tasks: { total: 47, done: 32 },
    sprint: "Sprint 3",
    color: "#22C55E",
  },
  {
    id: "beta",
    name: "KairoTask · Auth & Seguridad",
    description: "Sistema completo de autenticación con Supabase y RLS.",
    progress: 92,
    energy: 60,
    status: "review",
    members: ["DM", "LF"],
    tasks: { total: 21, done: 19 },
    sprint: "Sprint 2",
    color: "#A855F7",
  },
  {
    id: "gamma",
    name: "KairoTask · Notificaciones",
    description: "Pipeline de notificaciones en tiempo real via BillionMail.",
    progress: 30,
    energy: 45,
    status: "pending",
    members: ["DC"],
    tasks: { total: 18, done: 5 },
    sprint: "Sprint 4",
    color: "#F59E0B",
  },
];

const STATUS_CONFIG = {
  active: { label: "Activo", icon: Zap, color: "text-[#22C55E] bg-[#22C55E]/10 border-[#22C55E]/20" },
  review: { label: "En revisión", icon: AlertCircle, color: "text-[#A855F7] bg-[#A855F7]/10 border-[#A855F7]/20" },
  pending: { label: "Pendiente", icon: Clock, color: "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20" },
  done: { label: "Completado", icon: CheckCircle2, color: "text-[#94A3B8] bg-white/5 border-white/10" },
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
  return (
    <div className="p-6 md:p-8 min-h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs font-mono text-[#475569] mb-1 uppercase tracking-widest">
            <span className="text-[#22C55E]">$</span> ls ~/projects
          </p>
          <h1 className="text-3xl font-black tracking-tight text-[#F8FAFC]">
            Mis Proyectos
          </h1>
          <p className="text-sm text-[#475569] mt-1">
            {MOCK_PROJECTS.length} proyectos activos en este workspace
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#22C55E] text-black text-sm font-bold hover:bg-[#16A34A] active:scale-[0.97] transition-all duration-200 shadow-[0_0_20px_rgba(34,197,94,0.25)]">
          <Plus className="w-4 h-4" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Proyectos", value: "3", icon: FolderKanban, color: "#22C55E" },
          { label: "Tareas totales", value: "86", icon: Circle, color: "#A855F7" },
          { label: "Completadas", value: "56", icon: CheckCircle2, color: "#22C55E" },
          { label: "Miembros", value: "3", icon: Users, color: "#F59E0B" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/10 bg-white/[0.03] p-4 flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}
            >
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black text-[#F8FAFC]">{stat.value}</p>
              <p className="text-xs text-[#475569] font-mono">{stat.label}</p>
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
        {MOCK_PROJECTS.map((project) => {
          const status = STATUS_CONFIG[project.status as keyof typeof STATUS_CONFIG];
          const StatusIcon = status.icon;

          return (
            <motion.div key={project.id} variants={cardVariants}>
              <Link href={`/projects/${project.id}`} className="block group">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/20 transition-all duration-300 p-6 h-full cursor-pointer">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        background: `${project.color}15`,
                        borderColor: `${project.color}30`,
                      }}
                    >
                      <FolderKanban className="w-5 h-5" style={{ color: project.color }} />
                    </div>
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${status.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {status.label}
                    </div>
                  </div>

                  <h2 className="font-bold text-[#F8FAFC] text-base mb-1 group-hover:text-white transition-colors">
                    {project.name}
                  </h2>
                  <p className="text-xs text-[#475569] leading-relaxed mb-5">
                    {project.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] text-[#475569] font-mono uppercase tracking-wider">
                        Progreso
                      </span>
                      <span
                        className="text-xs font-bold font-mono"
                        style={{ color: project.color }}
                      >
                        {project.progress}%
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                        className="h-full rounded-full"
                        style={{
                          background: project.color,
                          boxShadow: `0 0 12px ${project.color}60`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    {/* Avatares del equipo */}
                    <div className="flex -space-x-2">
                      {project.members.map((initials) => (
                        <div
                          key={initials}
                          className="w-7 h-7 rounded-full border-2 border-black bg-[#1E293B] flex items-center justify-center text-[10px] font-bold text-[#94A3B8]"
                        >
                          {initials}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[#475569] text-xs group-hover:text-[#22C55E] transition-colors duration-200">
                      <span className="font-mono">{project.tasks.done}/{project.tasks.total} tareas</span>
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
          <button className="w-full h-full min-h-[240px] rounded-2xl border border-dashed border-white/10 bg-transparent hover:bg-white/[0.02] hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 group cursor-pointer">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#22C55E]/10 group-hover:border-[#22C55E]/30 transition-all duration-300">
              <Plus className="w-5 h-5 text-[#475569] group-hover:text-[#22C55E] transition-colors" />
            </div>
            <p className="text-sm font-medium text-[#475569] group-hover:text-[#F8FAFC] transition-colors">
              Crear nuevo proyecto
            </p>
            <p className="text-xs font-mono text-[#2D3748] group-hover:text-[#475569] transition-colors">
              &gt; init project
            </p>
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
