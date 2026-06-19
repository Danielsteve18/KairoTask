"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Terminal, AlertCircle, Zap, Clock, CheckCircle2,
  Loader2, User, Trash2, Save, Calendar, GitBranch,
} from "lucide-react";
import type { TaskStatus, Priority } from "@/components/task/TaskCard";
import type { Task, UpdateTaskInput } from "@/hooks/useTasks";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { CommentsSection } from "@/components/task/CommentsSection";

interface TaskDetailModalProps {
  task: Task;
  projectId: string;
  onClose: () => void;
  onUpdate: (input: UpdateTaskInput) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
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

const STATUS_DOT: Record<string, string> = {
  backlog: "#475569", "in-progress": "#F59E0B", review: "#A855F7", done: "#22C55E",
};

export function TaskDetailModal({
  task,
  projectId,
  onClose,
  onUpdate,
  onDelete,
}: TaskDetailModalProps) {
  const [title, setTitle]           = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [priority, setPriority]     = useState<Priority>(task.priority);
  const [status, setStatus]         = useState<TaskStatus>(task.status);
  const [tagsInput, setTagsInput]   = useState(task.tags.join(", "));
  const [dueDate, setDueDate]       = useState(task.due_date ?? "");
  const [assigneeId, setAssigneeId] = useState(task.assignee_id ?? "");
  const [isSaving, setIsSaving]     = useState(false);
  const [saveError, setSaveError]   = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting]       = useState(false);
  const [relativeCreated, setRelativeCreated] = useState("");
  const [relativeUpdated, setRelativeUpdated] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);

  const { members } = useProjectMembers(projectId);

  const hasChanges =
    title !== task.title ||
    description !== (task.description ?? "") ||
    priority !== task.priority ||
    status !== task.status ||
    tagsInput !== task.tags.join(", ") ||
    dueDate !== (task.due_date ?? "") ||
    assigneeId !== (task.assignee_id ?? "");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    setTimeout(() => titleRef.current?.focus(), 80);
  }, []);

  useEffect(() => {
    function format(dateStr: string) {
      const diff = Date.now() - new Date(dateStr).getTime();
      const m = Math.floor(diff / 60000);
      if (m < 1)  return "ahora";
      if (m < 60) return `hace ${m}m`;
      const h = Math.floor(m / 60);
      if (h < 24) return `hace ${h}h`;
      const d = Math.floor(h / 24);
      return `hace ${d}d`;
    }
    setRelativeCreated(format(task.created_at));
    setRelativeUpdated(format(task.updated_at));
  }, [task.created_at, task.updated_at]);

  const handleSave = async () => {
    if (!title.trim()) { setSaveError("El título es obligatorio."); return; }
    setIsSaving(true);
    setSaveError(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      await onUpdate({
        id: task.id,
        title: title.trim(),
        description: description.trim() || null,
        priority,
        status,
        tags,
        due_date: dueDate || null,
        assignee_id: assigneeId || null,
      });
      onClose();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error al guardar.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
      onClose();
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Error al eliminar.");
    } finally {
      setIsDeleting(false);
    }
  };

  const priorityCfg = PRIORITIES.find((p) => p.value === priority);
  const accentColor = priorityCfg?.color ?? "#22C55E";

  return (
    <AnimatePresence>
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
            <div className="flex items-center gap-2.5 min-w-0">
              <Terminal className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span className="text-sm font-mono font-semibold truncate" style={{ color: "var(--dash-text)" }}>
                tarea<span className="ml-1" style={{ color: accentColor }}>.edit()</span>
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5 shrink-0"
              style={{ color: "var(--dash-text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Título <span style={{ color: accentColor }}>*</span>
              </label>
              <input
                ref={titleRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Implementar endpoint de webhooks…"
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm font-medium outline-none transition-all"
                style={{
                  background:   "var(--dash-bg)",
                  borderColor:  "var(--dash-border)",
                  color:        "var(--dash-text)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--dash-border)")}
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
                onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
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

            {/* Assignee */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Asignar a
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--dash-text-muted)" }} />
                <select
                  value={assigneeId}
                  onChange={(e) => setAssigneeId(e.target.value)}
                  className="w-full rounded-lg border text-sm outline-none transition-all pl-9 pr-4 py-2.5 appearance-none cursor-pointer font-mono"
                  style={{
                    background:  "var(--dash-bg)",
                    borderColor: "var(--dash-border)",
                    color:       assigneeId ? "var(--dash-text)" : "var(--dash-text-muted)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--dash-border)")}
                >
                  <option value="">Sin asignar</option>
                  {members.map((m) => (
                    <option key={m.user_id} value={m.user_id}>
                      {m.profile?.full_name || m.profile?.email || "Miembro"}
                    </option>
                  ))}
                </select>
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
                onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--dash-border)")}
              />
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Fecha límite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all font-mono"
                style={{
                  background:   "var(--dash-bg)",
                  borderColor:  "var(--dash-border)",
                  color:        "var(--dash-text)",
                  colorScheme:  "dark",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "var(--dash-border)")}
              />
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 pt-2 pb-1 text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Creada {relativeCreated}
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Actualizada {relativeUpdated}
              </span>
            </div>

            {/* Status dot indicator */}
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-mono"
              style={{ background: "var(--dash-bg)" }}
            >
              <span className="w-2 h-2 rounded-full" style={{
                background: STATUS_DOT[status] ?? "#475569",
                boxShadow: `0 0 6px ${STATUS_DOT[status] ?? "#475569"}`,
              }} />
              <span style={{ color: "var(--dash-text-muted)" }}>
                Estado actual: <span style={{ color: "var(--dash-text)" }}>{STATUSES.find(s => s.value === status)?.label ?? status}</span>
              </span>
            </div>

            {/* Error */}
            <AnimatePresence>
              {saveError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs font-mono flex items-center gap-1.5"
                  style={{ color: "#EF4444" }}
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {saveError}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Comments */}
            <CommentsSection taskId={task.id} />

            {/* Divider */}
            <div className="border-t" style={{ borderColor: "var(--dash-border)" }} />

            {/* Actions row */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border text-sm font-mono transition-all hover:bg-white/5"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
              >
                Cancelar
              </button>

              <div className="flex-1" />

              {/* Delete */}
              {!confirmDelete && (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all hover:bg-red-400/10"
                  style={{ color: "#EF4444" }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar
                </button>
              )}

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || !hasChanges || !title.trim()}
                className="px-5 py-2 rounded-lg text-sm font-mono font-semibold flex items-center gap-2 transition-all disabled:opacity-50"
                style={{
                  background:  `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                  color:       "#fff",
                  boxShadow:   `0 0 20px ${accentColor}40`,
                }}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? "Guardando…" : "Guardar"}
              </button>
            </div>

            {/* Confirm Delete */}
            <AnimatePresence>
              {confirmDelete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <p className="text-xs font-mono" style={{ color: "#EF4444" }}>
                    ¿Estás seguro? Esta acción no se puede deshacer.
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="flex-1 py-2 rounded-lg border text-xs font-mono transition-all hover:bg-white/5"
                      style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 py-2 rounded-lg text-xs font-mono font-semibold transition-all disabled:opacity-50"
                      style={{ background: "#EF4444", color: "#fff" }}
                    >
                      {isDeleting ? "Eliminando…" : "Eliminar"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
