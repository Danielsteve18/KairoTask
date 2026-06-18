"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GripVertical,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  ChevronDown,
  Plus,
  User,
  Tag,
} from "lucide-react";

export type Priority = "critical" | "high" | "medium" | "low";
export type TaskStatus = "backlog" | "in-progress" | "review" | "done";

export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  assignee?: string;
  tags?: string[];
  dueDate?: string;
  status: TaskStatus;
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  critical: { label: "Critical", color: "#EF4444", bg: "#EF444418", border: "#EF444430" },
  high: { label: "High", color: "#F59E0B", bg: "#F59E0B18", border: "#F59E0B30" },
  medium: { label: "Medium", color: "#A855F7", bg: "#A855F718", border: "#A855F730" },
  low: { label: "Low", color: "#94A3B8", bg: "#94A3B818", border: "#94A3B830" },
};

export function TaskCard({ task, isDragging = false }: { task: TaskItem; isDragging?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        group rounded-xl border bg-white/[0.03] transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden
        ${isDragging
          ? "border-[#22C55E]/40 bg-white/[0.08] scale-[1.02]"
          : "border-white/10 hover:bg-white/[0.06] hover:border-white/20"
        }
      `}
    >
      {/* Accent top border */}
      <div
        className="h-[2px] w-full"
        style={{ background: `linear-gradient(90deg, ${priority.color}90, transparent)` }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <GripVertical className="w-4 h-4 text-[#2D3748] mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-[#F8FAFC] leading-snug line-clamp-2">
              {task.title}
            </h3>
          </div>
          {task.description && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="shrink-0 text-[#475569] hover:text-[#94A3B8] transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            </button>
          )}
        </div>

        {/* Description expandible */}
        <AnimatePresence>
          {expanded && task.description && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs text-[#475569] leading-relaxed mb-3 overflow-hidden"
            >
              {task.description}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/5 text-[#475569] border border-white/10"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          {/* Priority badge */}
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
            style={{ color: priority.color, background: priority.bg, borderColor: priority.border }}
          >
            {task.priority === "critical" && <AlertCircle className="w-2.5 h-2.5" />}
            {task.priority === "high" && <Zap className="w-2.5 h-2.5" />}
            {task.priority === "medium" && <Clock className="w-2.5 h-2.5" />}
            {task.priority === "low" && <CheckCircle2 className="w-2.5 h-2.5" />}
            {priority.label}
          </span>

          <div className="flex items-center gap-2">
            {/* Due date */}
            {task.dueDate && (
              <span className="text-[10px] font-mono text-[#2D3748] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {task.dueDate}
              </span>
            )}
            {/* Assignee */}
            {task.assignee && (
              <div className="w-6 h-6 rounded-full bg-[#1E293B] border border-white/10 flex items-center justify-center text-[9px] font-bold text-[#94A3B8]" title={task.assignee}>
                {task.assignee}
              </div>
            )}
            {!task.assignee && (
              <div className="w-6 h-6 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center">
                <User className="w-3 h-3 text-[#2D3748]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
