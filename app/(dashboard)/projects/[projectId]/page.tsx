"use client";

import { KanbanBoard } from "@/components/project/KanbanBoard";
import { ArrowLeft, Settings, Users, Activity, GitBranch } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const MOCK_PROJECT_META = {
  alpha: { name: "KairoTask · Core", sprint: "Sprint 3", progress: 68, color: "#22C55E" },
  beta: { name: "KairoTask · Auth & Seguridad", sprint: "Sprint 2", progress: 92, color: "#A855F7" },
  gamma: { name: "KairoTask · Notificaciones", sprint: "Sprint 4", progress: 30, color: "#F59E0B" },
};

export default function ProjectPage({ params }: { params: { projectId: string } }) {
  const meta = MOCK_PROJECT_META[params.projectId as keyof typeof MOCK_PROJECT_META] ?? {
    name: `Proyecto ${params.projectId}`,
    sprint: "Sprint 1",
    progress: 0,
    color: "#22C55E",
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Project Top Bar */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3 text-xs font-mono text-[#475569] mb-4">
          <Link href="/projects" className="flex items-center gap-1.5 hover:text-[#94A3B8] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            proyectos
          </Link>
          <span className="text-[#22C55E]">/</span>
          <span className="text-[#F8FAFC]">{params.projectId}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-black text-[#F8FAFC] tracking-tight">
              {meta.name}
            </h1>
            <p className="text-xs font-mono mt-1 flex items-center gap-2">
              <GitBranch className="w-3 h-3 text-[#475569]" />
              <span className="text-[#475569]">{meta.sprint}</span>
              <span className="text-[#22C55E] ml-2">●</span>
              <span className="text-[#22C55E]">{meta.progress}% completado</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <motion.div className="h-1.5 w-32 rounded-full bg-white/5 overflow-hidden hidden md:block">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${meta.progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: meta.color, boxShadow: `0 0 10px ${meta.color}60` }}
              />
            </motion.div>
            <button className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#475569] hover:text-[#94A3B8] hover:bg-white/5 transition-colors">
              <Activity className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#475569] hover:text-[#94A3B8] hover:bg-white/5 transition-colors">
              <Users className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-[#475569] hover:text-[#94A3B8] hover:bg-white/5 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden p-6">
        <KanbanBoard />
      </div>
    </div>
  );
}
