"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useSprints } from "@/hooks/useSprints";
import { useTasks } from "@/hooks/useTasks";

interface GanttChartProps {
  projectId: string;
}

function daysBetween(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(d: Date): string {
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function GanttChart({ projectId }: GanttChartProps) {
  const { sprints, isLoading: sprintsLoading } = useSprints(projectId);
  const { tasks, isLoading: tasksLoading } = useTasks(projectId);
  const [scrollOffset, setScrollOffset] = useState(0);

  const isLoading = sprintsLoading || tasksLoading;

  const activeSprint = sprints.find((s) => s.status === "active");

  const tasksWithDates = useMemo(
    () =>
      tasks.filter((t) => t.due_date).sort(
        (a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime()
      ),
    [tasks]
  );

  const timelineStart = useMemo(() => {
    if (activeSprint) return new Date(activeSprint.start_date);
    if (tasksWithDates.length > 0) return new Date(tasksWithDates[0].due_date!);
    return new Date();
  }, [activeSprint, tasksWithDates]);

  const timelineEnd = useMemo(() => {
    if (activeSprint) return new Date(activeSprint.end_date);
    if (tasksWithDates.length > 0)
      return new Date(tasksWithDates[tasksWithDates.length - 1].due_date!);
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d;
  }, [activeSprint, tasksWithDates]);

  const totalDays = daysBetween(timelineStart, timelineEnd) + 1;
  const dayWidth = 24;
  const headerHeight = 40;
  const rowHeight = 32;

  const visibleDays = 28;
  const maxOffset = Math.max(0, totalDays - visibleDays);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  if (tasksWithDates.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-2">
        <p className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
          No hay tareas con fecha para mostrar en el Gantt.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold" style={{ color: "var(--dash-text)" }}>
            Timeline
          </span>
          {activeSprint && (
            <span
              className="text-[10px] font-mono px-2 py-0.5 rounded-full"
              style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}
            >
              {activeSprint.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setScrollOffset(Math.max(0, scrollOffset - 7))}
            disabled={scrollOffset === 0}
            className="w-6 h-6 rounded flex items-center justify-center border disabled:opacity-30"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            <ChevronLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => setScrollOffset(Math.min(maxOffset, scrollOffset + 7))}
            disabled={scrollOffset >= maxOffset}
            className="w-6 h-6 rounded flex items-center justify-center border disabled:opacity-30"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Gantt area */}
      <div className="overflow-x-auto -mx-2 md:mx-0 pb-2">
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
      >
        {/* Header row with task names */}
        <div className="flex" style={{ height: headerHeight }}>
          {/* Task name column */}
          <div
            className="shrink-0 border-r px-2 md:px-3 flex items-center text-[10px] font-mono font-semibold uppercase tracking-wider"
            style={{ width: "clamp(80px, 20vw, 200px)", borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            Tarea
          </div>
          {/* Timeline header */}
          <div className="flex overflow-hidden" style={{ width: visibleDays * dayWidth }}>
            {Array.from({ length: visibleDays }).map((_, i) => {
              const d = new Date(timelineStart);
              d.setDate(d.getDate() + i + scrollOffset);
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              return (
                <div
                  key={i}
                  className="shrink-0 flex items-center justify-center text-[9px] font-mono border-r"
                  style={{
                    width: dayWidth,
                    background: isWeekend ? "rgba(255,255,255,0.03)" : undefined,
                    borderColor: "var(--dash-border)",
                    color: "var(--dash-text-muted)",
                  }}
                >
                  {formatDate(d)}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y" style={{ borderColor: "var(--dash-border)" }}>
          {tasksWithDates.map((task, idx) => {
            const start = new Date(task.created_at);
            const end = new Date(task.due_date!);
            const startDay = daysBetween(timelineStart, start);
            const duration = Math.max(1, daysBetween(start, end) + 1);

            const visibleStart = Math.max(0, startDay - scrollOffset);
            const visibleEnd = Math.min(visibleDays, startDay + duration - scrollOffset);
            const barWidth = Math.max(4, (visibleEnd - visibleStart) * dayWidth);
            const barLeft = visibleStart * dayWidth;

            if (visibleStart >= visibleDays || visibleEnd <= 0) return null;

            return (
              <div key={task.id} className="flex" style={{ height: rowHeight }}>
                <div
                  className="shrink-0 border-r px-2 md:px-3 flex items-center truncate"
                  style={{ width: "clamp(80px, 20vw, 200px)", borderColor: "var(--dash-border)" }}
                >
                  <span className="text-[11px] truncate" style={{ color: "var(--dash-text)" }}>
                    {task.title}
                  </span>
                </div>
                <div className="relative" style={{ width: visibleDays * dayWidth }}>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 h-3 rounded-sm transition-all"
                    style={{
                      left: barLeft,
                      width: barWidth,
                      background: task.status === "done"
                        ? "#22C55E"
                        : task.status === "in-progress"
                        ? "#F59E0B"
                        : "#A855F7",
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
