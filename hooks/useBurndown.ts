"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface BurndownPoint {
  date: string;
  ideal: number;
  actual: number;
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function eachDay(start: Date, end: Date): Date[] {
  const days: Date[] = [];
  const current = new Date(start);
  while (current <= end) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

function normalizeDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function useBurndown(sprintId: string) {
  const supabase = useMemo(() => createClient(), []);

  const { data: sprint } = useQuery({
    queryKey: ["sprint", sprintId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprints")
        .select("*")
        .eq("id", sprintId)
        .single();

      if (error) throw new Error(error.message);
      return data as { id: string; name: string; start_date: string; end_date: string; status: string };
    },
    enabled: !!sprintId,
  });

  const { data: burndownData = [], isLoading } = useQuery({
    queryKey: ["burndown", sprintId],
    queryFn: async () => {
      if (!sprint) return [];

      const { data: taskIds } = await supabase
        .from("sprint_tasks")
        .select("task_id")
        .eq("sprint_id", sprintId);

      if (!taskIds || taskIds.length === 0) return [];

      const ids = taskIds.map((t: { task_id: string }) => t.task_id);

      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("id, status, created_at, updated_at")
        .in("id", ids);

      if (error) throw new Error(error.message);
      if (!tasks || tasks.length === 0) return [];

      const total = tasks.length;
      const start = normalizeDate(new Date(sprint.start_date));
      const end = normalizeDate(new Date(sprint.end_date));
      const days = eachDay(start, end);
      const totalDays = days.length;

      return days.map((day, i) => {
        const dayStr = toDateStr(day);
        const doneByDay = tasks.filter((t: { status: string; updated_at: string }) => {
          if (t.status !== "done") return false;
          const updated = normalizeDate(new Date(t.updated_at));
          return updated <= day;
        }).length;

        return {
          date: dayStr,
          ideal: Math.round(total * (1 - i / Math.max(totalDays - 1, 1))),
          actual: total - doneByDay,
        };
      });
    },
    enabled: !!sprint && !!sprintId,
  });

  return { burndownData, isLoading };
}

export function useProjectStats(projectId: string) {
  const supabase = useMemo(() => createClient(), []);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["project-stats", projectId],
    queryFn: async () => {
      const { data: tasks, error } = await supabase
        .from("tasks")
        .select("status, priority, assignee_id")
        .eq("project_id", projectId);

      if (error) throw new Error(error.message);
      const t = tasks ?? [];

      type TaskRow = { status: string; priority: string; assignee_id: string | null };
      const tasksTyped = t as TaskRow[];
      return {
        total: tasksTyped.length,
        byStatus: {
          backlog: tasksTyped.filter((x) => x.status === "backlog").length,
          inProgress: tasksTyped.filter((x) => x.status === "in-progress").length,
          review: tasksTyped.filter((x) => x.status === "review").length,
          done: tasksTyped.filter((x) => x.status === "done").length,
        },
        byPriority: {
          critical: tasksTyped.filter((x) => x.priority === "critical").length,
          high: tasksTyped.filter((x) => x.priority === "high").length,
          medium: tasksTyped.filter((x) => x.priority === "medium").length,
          low: tasksTyped.filter((x) => x.priority === "low").length,
        },
        completionRate: tasksTyped.length > 0
          ? Math.round((tasksTyped.filter((x) => x.status === "done").length / tasksTyped.length) * 100)
          : 0,
      };
    },
    enabled: !!projectId,
  });

  return { stats, isLoading };
}
