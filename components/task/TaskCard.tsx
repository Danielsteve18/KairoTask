"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripVertical, Clock, CheckCircle2, AlertCircle, Zap, ChevronDown, User, Tag } from "lucide-react";

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
  high:     { label: "High",     color: "#F59E0B", bg: "#F59E0B18", border: "#F59E0B30" },
  medium:   { label: "Medium",   color: "#A855F7", bg: "#A855F718", border: "#A855F730" },
  low:      { label: "Low",      color: "#94A3B8", bg: "#94A3B818", border: "#94A3B830" },
};

export function TaskCard({ task, isDragging = false, onClick }: { task: TaskItem; isDragging?: boolean; onClick?: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_CONFIG[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="group rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing overflow-hidden"
      onClick={onClick}
      style={{
        background: isDragging ? "var(--dash-surface-hover)" : "var(--dash-bg)",
        borderColor: isDragging ? "rgba(34,197,94,0.4)" : "var(--dash-border)",
        transform: isDragging ? "scale(1.02)" : undefined,
      }}
    >
      {/* Accent top border */}
      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, ${priority.color}90, transparent)` }} />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-2 mb-3">
          <GripVertical className="w-4 h-4 mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--dash-text-muted)" }} />
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium leading-snug line-clamp-2" style={{ color: "var(--dash-text)" }}>
              {task.title}
            </h3>
          </div>
          {task.description && (
            <button onClick={() => setExpanded(!expanded)} className="shrink-0 transition-colors" style={{ color: "var(--dash-text-muted)" }}>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
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
              className="text-xs leading-relaxed mb-3 overflow-hidden"
              style={{ color: "var(--dash-text-muted)" }}
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
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border"
                style={{ color: "var(--dash-text-muted)", background: "var(--dash-surface-hover)", borderColor: "var(--dash-border)" }}
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
            style={{ color: priority.color, background: priority.bg, borderColor: priority.border }}
          >
            {task.priority === "critical" && <AlertCircle className="w-2.5 h-2.5" />}
            {task.priority === "high"     && <Zap          className="w-2.5 h-2.5" />}
            {task.priority === "medium"   && <Clock        className="w-2.5 h-2.5" />}
            {task.priority === "low"      && <CheckCircle2 className="w-2.5 h-2.5" />}
            {priority.label}
          </span>

          <div className="flex items-center gap-2">
            {task.dueDate && (
              <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: "var(--dash-text-muted)" }}>
                <Clock className="w-3 h-3" />{task.dueDate}
              </span>
            )}
            {task.assignee ? (
              <div
                className="w-6 h-6 rounded-full border flex items-center justify-center text-[9px] font-bold"
                style={{ borderColor: "var(--dash-border)", background: "var(--dash-surface)", color: "var(--dash-text-muted)" }}
                title={task.assignee}
              >
                {task.assignee}
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-dashed flex items-center justify-center" style={{ borderColor: "var(--dash-border)" }}>
                <User className="w-3 h-3" style={{ color: "var(--dash-text-muted)" }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
