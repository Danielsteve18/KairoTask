"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Loader2, Rocket, Calendar, CheckCircle2,
  Target, MoreHorizontal, Play, Pause, AlertCircle,
} from "lucide-react";
import { useSprints, useSprintTasks } from "@/hooks/useSprints";
import { useTasks } from "@/hooks/useTasks";
import type { Sprint } from "@/hooks/useSprints";

interface SprintPanelProps {
  projectId: string;
}

const SPRINT_STATUS_CONFIG = {
  planning: { label: "Planificación", color: "#F59E0B", icon: Target },
  active: { label: "Activo", color: "#22C55E", icon: Play },
  completed: { label: "Completado", color: "#A855F7", icon: CheckCircle2 },
  cancelled: { label: "Cancelado", color: "#EF4444", icon: X },
};

export function SprintPanel({ projectId }: SprintPanelProps) {
  const { sprints, isLoading, createSprint, updateSprint, deleteSprint } = useSprints(projectId);
  const { tasks } = useTasks(projectId);
  const [showCreate, setShowCreate] = useState(false);
  const [expandedSprint, setExpandedSprint] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", goal: "", start_date: "", end_date: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const activeSprint = sprints.find((s) => s.status === "active");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.start_date || !form.end_date) {
      setFormError("Nombre, fecha inicio y fecha fin son obligatorios.");
      return;
    }
    if (new Date(form.end_date) < new Date(form.start_date)) {
      setFormError("La fecha fin debe ser posterior a la fecha inicio.");
      return;
    }
    setIsCreating(true);
    setFormError(null);
    try {
      await createSprint.mutateAsync({
        project_id: projectId,
        name: form.name.trim(),
        goal: form.goal.trim() || undefined,
        start_date: form.start_date,
        end_date: form.end_date,
      });
      setForm({ name: "", goal: "", start_date: "", end_date: "" });
      setShowCreate(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al crear sprint.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleStartSprint = async (sprint: Sprint) => {
    const oldActiveId = activeSprint?.id;
    try {
      if (oldActiveId && oldActiveId !== sprint.id) {
        await updateSprint.mutateAsync({ id: oldActiveId, status: "completed" });
      }
      await updateSprint.mutateAsync({ id: sprint.id, status: "active" });
    } catch (err) {
      if (oldActiveId && oldActiveId !== sprint.id) {
        await updateSprint.mutateAsync({ id: oldActiveId, status: "active" }).catch(() => {});
      }
      console.error("Error al iniciar sprint:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active sprint banner */}
      {activeSprint && (
        <div
          className="p-4 rounded-xl border"
          style={{
            background: "rgba(34,197,94,0.08)",
            borderColor: "rgba(34,197,94,0.2)",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4" style={{ color: "#22C55E" }} />
              <span className="text-sm font-semibold" style={{ color: "#22C55E" }}>
                Sprint activo: {activeSprint.name}
              </span>
            </div>
          </div>
          {activeSprint.goal && (
            <p className="text-xs font-mono mt-1" style={{ color: "var(--dash-text-muted)" }}>
              Meta: {activeSprint.goal}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
            <Calendar className="w-3 h-3" />
            {new Date(activeSprint.start_date).toLocaleDateString("es")} → {new Date(activeSprint.end_date).toLocaleDateString("es")}
          </div>
        </div>
      )}

      {/* Sprint list */}
      <div className="space-y-2">
        {sprints.length === 0 && (
          <p className="text-xs font-mono text-center py-8" style={{ color: "var(--dash-text-muted)" }}>
            No hay sprints. Crea tu primer sprint.
          </p>
        )}
        {sprints.map((sprint) => {
          const cfg = SPRINT_STATUS_CONFIG[sprint.status];
          const Icon = cfg.icon;
          const isExpanded = expandedSprint === sprint.id;
          return (
            <div key={sprint.id}>
              <button
                onClick={() => setExpandedSprint(isExpanded ? null : sprint.id)}
                className="w-full flex items-center justify-between p-3 rounded-lg border text-left transition-all hover:bg-white/5"
                style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${cfg.color}18` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: cfg.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "var(--dash-text)" }}>
                      {sprint.name}
                    </p>
                    <p className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                      {new Date(sprint.start_date).toLocaleDateString("es")} → {new Date(sprint.end_date).toLocaleDateString("es")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {sprint.status === "planning" && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStartSprint(sprint); }}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold"
                      style={{ background: "#22C55E", color: "#020617" }}
                      title="Iniciar sprint"
                    >
                      Iniciar
                    </button>
                  )}
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border"
                    style={{ color: cfg.color, borderColor: `${cfg.color}40`, background: `${cfg.color}15` }}
                  >
                    {cfg.label}
                  </span>
                </div>
              </button>

              <AnimatePresence>
                {isExpanded && <SprintDetail sprint={sprint} projectId={projectId} />}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Create button */}
      {!showCreate && (
        <button
          onClick={() => setShowCreate(true)}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed text-xs font-mono transition-all hover:border-[#22C55E40]"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
        >
          <Plus className="w-3.5 h-3.5" />
          Nuevo sprint
        </button>
      )}

      {/* Create form */}
      <AnimatePresence>
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="space-y-3 overflow-hidden"
          >
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Nombre *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Sprint 1"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Meta
              </label>
              <input
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                placeholder="Completar módulo de autenticación"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                  Inicio *
                </label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)", colorScheme: "dark" }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                  Fin *
                </label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)", colorScheme: "dark" }}
                />
              </div>
            </div>

            {formError && (
              <p className="text-[11px] font-mono flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-3 h-3" /> {formError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 rounded-lg border text-xs font-mono"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 py-2 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1"
                style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff" }}
              >
                {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                Crear sprint
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function SprintDetail({ sprint, projectId }: { sprint: Sprint; projectId: string }) {
  const { taskIds, addTaskToSprint, removeTaskFromSprint } = useSprintTasks(sprint.id);
  const { tasks } = useTasks(projectId);
  const [selectedTask, setSelectedTask] = useState("");

  const availableTasks = tasks.filter((t) => !taskIds.includes(t.id));
  const sprintTasks = tasks.filter((t) => taskIds.includes(t.id));

  const handleAddTask = async () => {
    if (!selectedTask) return;
    try {
      await addTaskToSprint.mutateAsync(selectedTask);
      setSelectedTask("");
    } catch (err) {
      console.error("Error al agregar tarea al sprint:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="pl-11 pr-3 pb-3 overflow-hidden"
    >
      {sprint.goal && (
        <p className="text-xs font-mono mb-3 p-2 rounded-lg" style={{ background: "var(--dash-bg)", color: "var(--dash-text-muted)" }}>
          <Target className="w-3 h-3 inline mr-1" />
          {sprint.goal}
        </p>
      )}

      {/* Tasks in sprint */}
      <div className="space-y-1 mb-3">
        <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
          Tareas ({sprintTasks.length})
        </p>
        {sprintTasks.length === 0 ? (
          <p className="text-[10px] font-mono py-2" style={{ color: "var(--dash-text-muted)" }}>
            No hay tareas asignadas a este sprint.
          </p>
        ) : (
          sprintTasks.map((t) => (
            <div
              key={t.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs"
              style={{ background: "var(--dash-bg)" }}
            >
              <span className="truncate flex-1" style={{ color: "var(--dash-text)" }}>{t.title}</span>
              <button
                onClick={() => removeTaskFromSprint.mutateAsync(t.id)}
                className="shrink-0 p-1 rounded hover:bg-red-400/10 transition-colors"
                style={{ color: "#EF4444" }}
                title="Remover del sprint"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add task */}
      {availableTasks.length > 0 && (
        <div className="flex gap-2">
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="flex-1 px-2 py-1.5 rounded-lg border text-[11px] font-mono outline-none"
            style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          >
            <option value="">Seleccionar tarea…</option>
            {availableTasks.map((t) => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>
          <button
            onClick={handleAddTask}
            disabled={!selectedTask || addTaskToSprint.isPending}
            className="px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold disabled:opacity-50"
            style={{ background: "#22C55E", color: "#020617" }}
          >
            {addTaskToSprint.isPending ? "…" : "+"}
          </button>
        </div>
      )}
    </motion.div>
  );
}
