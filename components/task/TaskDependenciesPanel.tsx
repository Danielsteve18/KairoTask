"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Unlink, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { useTaskDependencies } from "@/hooks/useTaskDependencies";
import { useTasks } from "@/hooks/useTasks";

interface DepEntry {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: "blocks" | "requires";
  depends_on_task?: { id: string; title: string; status: string };
  task?: { id: string; title: string; status: string };
}

interface TaskDependenciesPanelProps {
  taskId: string;
  projectId: string;
}

export function TaskDependenciesPanel({ taskId, projectId }: TaskDependenciesPanelProps) {
  const { dependencies, isLoading, addDependency, removeDependency } = useTaskDependencies(taskId);
  const { tasks } = useTasks(projectId);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedTask, setSelectedTask] = useState("");
  const [depType, setDepType] = useState<"blocks" | "requires">("blocks");

  const blocking = (dependencies as unknown as { blocking: DepEntry[] }).blocking ?? [];
  const blockedBy = (dependencies as unknown as { blockedBy: DepEntry[] }).blockedBy ?? [];

  const availableTasks = tasks.filter(
    (t) => t.id !== taskId &&
      !blocking.find((d) => d.depends_on_task_id === t.id) &&
      !blockedBy.find((d) => d.task_id === t.id)
  );

  const handleAdd = async () => {
    if (!selectedTask) return;
    try {
      await addDependency.mutateAsync({ dependsOnTaskId: selectedTask, type: depType });
      setSelectedTask("");
      setShowAdd(false);
    } catch (err) {
      console.error("Error al agregar dependencia:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1" style={{ color: "var(--dash-text-muted)" }}>
          <Link2 className="w-3 h-3" /> Dependencias
        </p>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-[10px] font-mono flex items-center gap-1 px-2 py-1 rounded-lg border transition-all hover:bg-white/5"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-accent)" }}
        >
          <Plus className="w-3 h-3" /> Añadir
        </button>
      </div>

      {/* Blocking (this task blocks others) */}
      {blocking.length > 0 && (
        <div>
          <p className="text-[10px] font-mono mb-1" style={{ color: "#F59E0B" }}>Bloquea a:</p>
          <div className="space-y-1">
            {blocking.map((dep: DepEntry) => (
              <div
                key={dep.id}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs"
                style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
              >
                <span className="truncate" style={{ color: "var(--dash-text)" }}>
                  {dep.depends_on_task?.title ?? "Tarea"}
                </span>
                <button
                  onClick={() => removeDependency.mutateAsync(dep.id)}
                  className="p-0.5 rounded hover:bg-red-400/10 shrink-0"
                  style={{ color: "#EF4444" }}
                >
                  <Unlink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blocked by (others block this task) */}
      {blockedBy.length > 0 && (
        <div>
          <p className="text-[10px] font-mono mb-1" style={{ color: "#EF4444" }}>Depende de:</p>
          <div className="space-y-1">
            {blockedBy.map((dep: DepEntry) => (
              <div
                key={dep.id}
                className="flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs"
                style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
              >
                <span className="truncate" style={{ color: "var(--dash-text)" }}>
                  {dep.task?.title ?? "Tarea"}
                </span>
                <button
                  onClick={() => removeDependency.mutateAsync(dep.id)}
                  className="p-0.5 rounded hover:bg-red-400/10 shrink-0"
                  style={{ color: "#EF4444" }}
                >
                  <Unlink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {blocking.length === 0 && blockedBy.length === 0 && !showAdd && (
        <p className="text-[10px] font-mono py-2 text-center" style={{ color: "var(--dash-text-muted)" }}>
          Sin dependencias
        </p>
      )}

      {/* Add form */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full px-2 py-1.5 rounded-lg border text-[11px] font-mono outline-none"
              style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
            >
              <option value="">Seleccionar tarea…</option>
              {availableTasks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDepType("blocks")}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-mono border"
                style={{
                  background: depType === "blocks" ? "#F59E0B18" : "var(--dash-bg)",
                  borderColor: depType === "blocks" ? "#F59E0B50" : "var(--dash-border)",
                  color: depType === "blocks" ? "#F59E0B" : "var(--dash-text-muted)",
                }}
              >
                Bloquea
              </button>
              <button
                type="button"
                onClick={() => setDepType("requires")}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-mono border"
                style={{
                  background: depType === "requires" ? "#EF444418" : "var(--dash-bg)",
                  borderColor: depType === "requires" ? "#EF444450" : "var(--dash-border)",
                  color: depType === "requires" ? "#EF4444" : "var(--dash-text-muted)",
                }}
              >
                Requiere
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 py-1.5 rounded-lg border text-[10px] font-mono"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAdd}
                disabled={!selectedTask || addDependency.isPending}
                className="flex-1 py-1.5 rounded-lg text-[10px] font-mono font-semibold disabled:opacity-50"
                style={{ background: "#22C55E", color: "#020617" }}
              >
                {addDependency.isPending ? "…" : "Añadir"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
