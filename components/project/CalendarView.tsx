"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft, ChevronRight, Calendar as CalendarIcon,
  Clock, AlertCircle, Zap, Loader2,
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import Link from "next/link";

interface CalendarViewProps {
  projectId: string;
}

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

const PRIORITY_COLORS = {
  critical: "#EF4444",
  high: "#F59E0B",
  medium: "#A855F7",
  low: "#94A3B8",
};

export function CalendarView({ projectId }: CalendarViewProps) {
  const { tasks, isLoading } = useTasks(projectId);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const tasksWithDueDate = useMemo(
    () => tasks.filter((t) => t.due_date),
    [tasks]
  );

  const getTasksForDate = (dateStr: string) =>
    tasksWithDueDate.filter((t) => {
      const d = new Date(t.due_date!).toLocaleDateString("es-CR");
      const ds = new Date(dateStr).toLocaleDateString("es-CR");
      return d === ds;
    });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const today = new Date().toLocaleDateString("es-CR");

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar grid */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center border hover:bg-white/5 transition-all"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-base font-bold" style={{ color: "var(--dash-text)" }}>
            {MONTHS[month]} {year}
          </h2>
          <button
            onClick={nextMonth}
            className="w-7 h-7 rounded-lg flex items-center justify-center border hover:bg-white/5 transition-all"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-[10px] font-mono text-center py-2" style={{ color: "var(--dash-text-muted)" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const dateStr = date.toLocaleDateString("es-CR");
            const dayTasks = getTasksForDate(date.toISOString());
            const isToday = dateStr === today;
            const isSelected = selectedDate === dateStr;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                className="min-h-[80px] p-1.5 rounded-lg border text-left transition-all"
                style={{
                  background: isSelected
                    ? "rgba(34,197,94,0.12)"
                    : isToday
                    ? "rgba(34,197,94,0.06)"
                    : "var(--dash-surface)",
                  borderColor: isSelected
                    ? "rgba(34,197,94,0.4)"
                    : isToday
                    ? "rgba(34,197,94,0.2)"
                    : "var(--dash-border)",
                }}
              >
                <span
                  className="text-[10px] font-mono font-semibold"
                  style={{
                    color: isToday ? "var(--dash-accent)" : "var(--dash-text-muted)",
                  }}
                >
                  {day}
                </span>
                <div className="mt-1 space-y-0.5">
                  {dayTasks.slice(0, 3).map((t) => (
                    <div
                      key={t.id}
                      className="text-[8px] font-mono leading-tight truncate rounded px-0.5"
                      style={{
                        color: PRIORITY_COLORS[t.priority] ?? "#94A3B8",
                        background: `${PRIORITY_COLORS[t.priority] ?? "#94A3B8"}15`,
                      }}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[8px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                      +{dayTasks.length - 3} más
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected date tasks */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full md:w-72 shrink-0"
          >
            <div
              className="rounded-xl border p-4"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CalendarIcon className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
                <span className="text-sm font-semibold" style={{ color: "var(--dash-text)" }}>
                  {new Date(selectedDate).toLocaleDateString("es", {
                    weekday: "long", day: "numeric", month: "long",
                  })}
                </span>
              </div>

              {(() => {
                const dayTasks = getTasksForDate(selectedDate);
                if (dayTasks.length === 0) {
                  return (
                    <p className="text-xs font-mono py-4 text-center" style={{ color: "var(--dash-text-muted)" }}>
                      Sin tareas para este día
                    </p>
                  );
                }
                return (
                  <div className="space-y-2">
                    {dayTasks.map((t) => (
                      <Link
                        key={t.id}
                        href={`/projects/${projectId}`}
                        className="block p-2.5 rounded-lg border transition-all hover:bg-white/5"
                        style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
                      >
                        <p className="text-xs font-medium line-clamp-2" style={{ color: "var(--dash-text)" }}>
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span
                            className="text-[10px] font-mono flex items-center gap-1"
                            style={{ color: PRIORITY_COLORS[t.priority] ?? "#94A3B8" }}
                          >
                            <Zap className="w-2.5 h-2.5" />
                            {t.priority}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                            {t.status}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
