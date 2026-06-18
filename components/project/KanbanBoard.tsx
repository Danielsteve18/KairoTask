"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MoreHorizontal } from "lucide-react";
import { TaskCard, TaskItem, TaskStatus } from "@/components/task/TaskCard";

const COLUMNS: { id: TaskStatus; label: string; dotColor: string }[] = [
  { id: "backlog",      label: "Backlog",     dotColor: "#475569" },
  { id: "in-progress",  label: "En Progreso", dotColor: "#F59E0B" },
  { id: "review",       label: "Revisión",    dotColor: "#A855F7" },
  { id: "done",         label: "Completado",  dotColor: "#22C55E" },
];

const INITIAL_TASKS: TaskItem[] = [
  { id: "t1", title: "Diseñar esquema de base de datos para proyectos y tareas", description: "Crear las tablas `projects`, `tasks`, `members` y las políticas RLS en Supabase.", priority: "critical", assignee: "DM", tags: ["supabase", "db"], dueDate: "Jun 20", status: "backlog" },
  { id: "t2", title: "Implementar lógica de Drag & Drop en el Kanban", priority: "high", assignee: "DM", tags: ["frontend", "dnd"], dueDate: "Jun 22", status: "in-progress" },
  { id: "t3", title: "Configurar Real-time con Supabase channels", description: "Subscribirse a los canales de cambios de la tabla `tasks` para sincronización en tiempo real.", priority: "high", assignee: "LF", tags: ["realtime", "supabase"], status: "in-progress" },
  { id: "t4", title: "Añadir autenticación con Google OAuth", priority: "medium", assignee: "LF", dueDate: "Jun 25", status: "review" },
  { id: "t5", title: "Crear endpoint de notificaciones con BillionMail", priority: "low", assignee: "DC", tags: ["backend", "email"], status: "backlog" },
  { id: "t6", title: "Configurar pipeline E2E de Playwright en CI", priority: "medium", assignee: "DC", tags: ["qa", "ci/cd"], status: "done" },
  { id: "t7", title: "Sistema de autenticación con Supabase", priority: "critical", assignee: "DM", tags: ["auth"], status: "done" },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const getColumnTasks = (colId: TaskStatus) => tasks.filter((t) => t.status === colId);

  const onDragStart = (start: { draggableId: string }) => setDraggingId(start.draggableId);

  const onDragEnd = (result: DropResult) => {
    setDraggingId(null);
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    const newStatus = destination.droppableId as TaskStatus;
    setTasks((prev) => prev.map((t) => t.id === draggableId ? { ...t, status: newStatus } : t));
  };

  return (
    <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
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
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              {/* Column Header */}
              <div className="px-4 py-3.5 border-b flex items-center justify-between" style={{ borderColor: "var(--dash-border)" }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.dotColor, boxShadow: `0 0 8px ${col.dotColor}80` }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>{col.label}</span>
                  <span className="text-xs font-mono ml-1" style={{ color: "var(--dash-text-muted)" }}>[{colTasks.length}]</span>
                </div>
                <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ color: "var(--dash-text-muted)" }}>
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Droppable Task List */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[120px] transition-colors duration-200 rounded-xl"
                    style={{ background: snapshot.isDraggingOver ? "var(--dash-surface-hover)" : undefined }}
                  >
                    <AnimatePresence>
                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-12 gap-2 text-center"
                        >
                          <div className="w-10 h-10 rounded-xl border-2 border-dashed flex items-center justify-center" style={{ borderColor: "var(--dash-border)" }}>
                            <Plus className="w-4 h-4" style={{ color: "var(--dash-text-muted)" }} />
                          </div>
                          <p className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>&gt; empty column</p>
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
                              filter: dragSnapshot.isDragging ? "drop-shadow(0 0 12px rgba(34,197,94,0.4))" : undefined,
                              opacity: dragSnapshot.isDragging ? 0.95 : 1,
                            }}
                          >
                            <TaskCard task={task} isDragging={dragSnapshot.isDragging} />
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
  );
}
