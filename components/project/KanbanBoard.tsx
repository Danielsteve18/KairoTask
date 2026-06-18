"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreHorizontal, Loader2, ArrowRight, X, Check } from "lucide-react";
import { TaskCard, TaskStatus } from "@/components/task/TaskCard";
import { CreateTaskModal } from "@/components/task/CreateTaskModal";
import { useTasks } from "@/hooks/useTasks";

const COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: "backlog",     label: "Backlog",     dotColor: "#475569" },
  { id: "in-progress", label: "En Progreso", dotColor: "#F59E0B" },
  { id: "review",      label: "Revisión",    dotColor: "#A855F7" },
  { id: "done",        label: "Completado",  dotColor: "#22C55E" },
];

interface PendingMove {
  taskId:    string;
  taskTitle: string;
  fromStatus: TaskStatus;
  toStatus:   TaskStatus;
}

interface KanbanBoardProps {
  projectId: string;
}

export function KanbanBoard({ projectId }: KanbanBoardProps) {
  const { tasks, isLoading, createTask, updateTaskStatus } = useTasks(projectId);
  const [modalOpen, setModalOpen]     = useState(false);
  const [modalStatus, setModalStatus] = useState<TaskStatus>("backlog");
  const [pendingMove, setPendingMove] = useState<PendingMove | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  const getColumnTasks = (colId: TaskStatus) =>
    tasks.filter((t) => t.status === colId);

  const openModalForColumn = (colId: TaskStatus) => {
    setModalStatus(colId);
    setModalOpen(true);
  };

  // ── Drag end: store pending move, do NOT update state yet ──────────────────
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const fromStatus = source.droppableId as TaskStatus;
    const toStatus   = destination.droppableId as TaskStatus;
    if (fromStatus === toStatus) return;   // same column, no confirmation needed

    const task = tasks.find((t) => t.id === draggableId);
    if (!task) return;

    // Show confirmation — card snaps back visually (state not updated yet)
    setPendingMove({
      taskId:     draggableId,
      taskTitle:  task.title,
      fromStatus,
      toStatus,
    });
  };

  const confirmMove = async () => {
    if (!pendingMove) return;
    setIsConfirming(true);
    try {
      await updateTaskStatus.mutateAsync({
        taskId: pendingMove.taskId,
        status: pendingMove.toStatus,
      });
    } finally {
      setIsConfirming(false);
      setPendingMove(null);
    }
  };

  const cancelMove = () => setPendingMove(null);

  const fromCol = COLUMNS.find((c) => c.id === pendingMove?.fromStatus);
  const toCol   = COLUMNS.find((c) => c.id === pendingMove?.toStatus);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#22C55E" }} />
        <span className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
          cargando tareas…
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 h-full overflow-x-auto pb-4 pr-2">
          {COLUMNS.map((col, colIndex) => {
            const colTasks = getColumnTasks(col.id);
            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: colIndex * 0.08 }}
                className="flex flex-col rounded-2xl border w-[300px] shrink-0"
                style={{
                  background:  "var(--dash-surface)",
                  borderColor: "var(--dash-border)",
                }}
              >
                {/* Column Header */}
                <div
                  className="px-4 py-3.5 border-b flex items-center justify-between"
                  style={{ borderColor: "var(--dash-border)" }}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: col.dotColor,
                        boxShadow: `0 0 8px ${col.dotColor}80`,
                      }}
                    />
                    <span className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
                      {col.label}
                    </span>
                    <span className="text-xs font-mono ml-1" style={{ color: "var(--dash-text-muted)" }}>
                      [{colTasks.length}]
                    </span>
                  </div>
                  <button
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
                    style={{ color: "var(--dash-text-muted)" }}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Droppable Task List */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[120px] transition-colors duration-200 rounded-b-2xl"
                      style={{
                        background: snapshot.isDraggingOver
                          ? "var(--dash-surface-hover)"
                          : undefined,
                      }}
                    >
                      <AnimatePresence>
                        {colTasks.length === 0 && !snapshot.isDraggingOver && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-12 gap-2 text-center"
                          >
                            <div
                              className="w-10 h-10 rounded-xl border-2 border-dashed flex items-center justify-center"
                              style={{ borderColor: "var(--dash-border)" }}
                            >
                              <Plus className="w-4 h-4" style={{ color: "var(--dash-text-muted)" }} />
                            </div>
                            <p className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
                              &gt; empty column
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {colTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              {...dragProvided.dragHandleProps}
                              style={{
                                ...dragProvided.draggableProps.style,
                                filter: dragSnapshot.isDragging
                                  ? "drop-shadow(0 0 12px rgba(34,197,94,0.4))"
                                  : undefined,
                                opacity: dragSnapshot.isDragging ? 0.95 : 1,
                              }}
                            >
                              <TaskCard
                                task={{
                                  id:          task.id,
                                  title:       task.title,
                                  description: task.description ?? undefined,
                                  priority:    task.priority,
                                  status:      task.status,
                                  tags:        task.tags,
                                  dueDate:     task.due_date
                                    ? new Date(task.due_date).toLocaleDateString("es", {
                                        month: "short",
                                        day:   "numeric",
                                      })
                                    : undefined,
                                }}
                                isDragging={dragSnapshot.isDragging}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {/* Add Task Button */}
                <div className="p-3 border-t" style={{ borderColor: "var(--dash-border)" }}>
                  <button
                    onClick={() => openModalForColumn(col.id)}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono border border-dashed border-transparent transition-all duration-200 hover:border-current"
                    style={{ color: "var(--dash-text-muted)" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Añadir tarea
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </DragDropContext>

      {/* ── Confirm Move Dialog (bottom-center) ────────────────────────────── */}
      <AnimatePresence>
        {pendingMove && fromCol && toCol && (
          <>
            {/* scrim */}
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              style={{ background: "rgba(2,6,10,0.55)", backdropFilter: "blur(2px)" }}
              onClick={cancelMove}
            />

            {/* Dialog wrapper — centered both axes */}
            <motion.div
              key="confirm-dialog"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
            <div
              className="pointer-events-auto w-full max-w-sm rounded-2xl border p-5"
              style={{
                background:  "var(--dash-surface)",
                borderColor: "rgba(34,197,94,0.2)",
                boxShadow:   "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(34,197,94,0.08)",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--dash-text-muted)" }}>
                    Confirmar movimiento
                  </p>
                  <p
                    className="text-sm font-semibold leading-snug line-clamp-2"
                    style={{ color: "var(--dash-text)" }}
                  >
                    &quot;{pendingMove.taskTitle}&quot;
                  </p>
                </div>
                <button
                  onClick={cancelMove}
                  className="w-7 h-7 rounded-lg flex items-center justify-center ml-3 shrink-0 hover:bg-white/5 transition-colors"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* From → To */}
              <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: "var(--dash-bg)" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: fromCol.dotColor, boxShadow: `0 0 6px ${fromCol.dotColor}` }}
                  />
                  <span className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
                    {fromCol.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--dash-text-muted)" }} />
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: toCol.dotColor, boxShadow: `0 0 6px ${toCol.dotColor}` }}
                  />
                  <span className="text-xs font-mono font-semibold" style={{ color: "var(--dash-text)" }}>
                    {toCol.label}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={cancelMove}
                  disabled={isConfirming}
                  className="flex-1 py-2 rounded-lg border text-sm font-mono transition-all hover:bg-white/5 disabled:opacity-50"
                  style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmMove}
                  disabled={isConfirming}
                  className="flex-1 py-2 rounded-lg text-sm font-mono font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                  style={{
                    background: "linear-gradient(135deg, #22C55E, #16A34A)",
                    color:      "#fff",
                    boxShadow:  "0 0 18px rgba(34,197,94,0.3)",
                  }}
                >
                  {isConfirming ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {isConfirming ? "Moviendo…" : "Confirmar"}
                </button>
              </div>
            </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={async (input) => {
          await createTask.mutateAsync(input);
        }}
        projectId={projectId}
        defaultStatus={modalStatus}
      />
    </div>
  );
}
