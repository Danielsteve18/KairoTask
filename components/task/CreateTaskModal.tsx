"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Terminal,
  AlertCircle,
  Zap,
  Clock,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import type { TaskStatus, Priority } from "@/components/task/TaskCard";
import type { CreateTaskInput } from "@/hooks/useTasks";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateTaskInput) => Promise<void>;
  projectId: string;
  defaultStatus?: TaskStatus;
}

const PRIORITIES: { value: Priority; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "critical", label: "Critical", icon: <AlertCircle className="w-3.5 h-3.5" />, color: "#EF4444" },
  { value: "high",     label: "High",     icon: <Zap          className="w-3.5 h-3.5" />, color: "#F59E0B" },
  { value: "medium",   label: "Medium",   icon: <Clock        className="w-3.5 h-3.5" />, color: "#A855F7" },
  { value: "low",      label: "Low",      icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "#94A3B8" },
];

const STATUSES: { value: TaskStatus; label: string; dotColor: string }[] = [
  { value: "backlog",     label: "Backlog",     dotColor: "#475569" },
  { value: "in-progress", label: "En Progreso", dotColor: "#F59E0B" },
  { value: "review",      label: "Revisión",    dotColor: "#A855F7" },
  { value: "done",        label: "Completado",  dotColor: "#22C55E" },
];

export function CreateTaskModal({
  isOpen,
  onClose,
  onSubmit,
  projectId,
  defaultStatus = "backlog",
}: CreateTaskModalProps) {
  const [title, setTitle]           = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority]     = useState<Priority>("medium");
  const [status, setStatus]         = useState<TaskStatus>(defaultStatus);
  const [tagsInput, setTagsInput]   = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus(defaultStatus);
      setTagsInput("");
      setError(null);
      setIsSubmitting(false);
      setTimeout(() => titleRef.current?.focus(), 80);
    }
  }, [isOpen, defaultStatus]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("El título es obligatorio."); return; }

    setIsSubmitting(true);
    setError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onSubmit({
        project_id:  projectId,
        title:       title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        tags,
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(2,6,10,0.75)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-lg rounded-2xl border overflow-hidden"
              style={{
                background:   "var(--dash-surface)",
                borderColor:  "var(--dash-border)",
                boxShadow:    "0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08)",
              }}
            >
              {/* Title bar */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "var(--dash-border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4" style={{ color: "#22C55E" }} />
                  <span className="text-sm font-mono font-semibold" style={{ color: "var(--dash-text)" }}>
                    nueva_tarea<span className="text-[#22C55E]">.create()</span>
                  </span>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                    Título <span style={{ color: "#22C55E" }}>*</span>
                  </label>
                  <input
                    ref={titleRef}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="ej. Implementar endpoint de webhooks…"
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium outline-none transition-all"
                    style={{
                      background:   "var(--dash-bg)",
                      borderColor:  error && !title ? "#EF4444" : "var(--dash-border)",
                      color:        "var(--dash-text)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = error && !title ? "#EF4444" : "var(--dash-border)")}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Contexto adicional o criterios de aceptación…"
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all resize-none"
                    style={{
                      background:  "var(--dash-bg)",
                      borderColor: "var(--dash-border)",
                      color:       "var(--dash-text)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--dash-border)")}
                  />
                </div>

                {/* Priority + Status row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Priority */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                      Prioridad
                    </label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setPriority(p.value)}
                          className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-[11px] font-mono font-semibold transition-all"
                          style={{
                            color:       priority === p.value ? p.color : "var(--dash-text-muted)",
                            background:  priority === p.value ? `${p.color}18` : "var(--dash-bg)",
                            borderColor: priority === p.value ? `${p.color}50` : "var(--dash-border)",
                          }}
                        >
                          {p.icon}
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status / Column */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                      Columna
                    </label>
                    <div className="flex flex-col gap-1.5">
                      {STATUSES.map((s) => (
                        <button
                          key={s.value}
                          type="button"
                          onClick={() => setStatus(s.value)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-mono transition-all"
                          style={{
                            color:       status === s.value ? "var(--dash-text)" : "var(--dash-text-muted)",
                            background:  status === s.value ? "var(--dash-surface-hover)" : "var(--dash-bg)",
                            borderColor: status === s.value ? s.dotColor + "60" : "var(--dash-border)",
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              background: s.dotColor,
                              boxShadow:  status === s.value ? `0 0 6px ${s.dotColor}` : "none",
                            }}
                          />
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                    Tags <span className="normal-case tracking-normal">(separados por coma)</span>
                  </label>
                  <input
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="frontend, supabase, auth…"
                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all font-mono"
                    style={{
                      background:  "var(--dash-bg)",
                      borderColor: "var(--dash-border)",
                      color:       "var(--dash-text)",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--dash-border)")}
                  />
                </div>

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs font-mono flex items-center gap-1.5"
                      style={{ color: "#EF4444" }}
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg border text-sm font-mono transition-all hover:bg-white/5"
                    style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg text-sm font-mono font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                    style={{
                      background:  "linear-gradient(135deg, #22C55E, #16A34A)",
                      color:       "#fff",
                      boxShadow:   "0 0 20px rgba(34,197,94,0.3)",
                    }}
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Terminal className="w-4 h-4" />
                    )}
                    {isSubmitting ? "Creando…" : "Crear tarea"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
