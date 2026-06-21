"use client";

import { useEffect, useMemo, useId } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface Sprint {
  id: string;
  project_id: string;
  name: string;
  goal: string | null;
  start_date: string;
  end_date: string;
  status: "planning" | "active" | "completed" | "cancelled";
  created_by: string;
  created_at: string;
}

export interface CreateSprintInput {
  project_id: string;
  name: string;
  goal?: string;
  start_date: string;
  end_date: string;
}

export function useSprints(projectId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const uid = useId();

  const { data: sprints = [], isLoading, error } = useQuery({
    queryKey: ["sprints", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprints")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as Sprint[];
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`sprints:${projectId}:${uid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sprints",
          filter: `project_id=eq.${projectId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [projectId, queryClient]);

  const createSprint = useMutation({
    mutationFn: async (input: CreateSprintInput) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("sprints")
        .insert([{ ...input, created_by: user.id }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Sprint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
    },
  });

  const updateSprint = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Sprint> & { id: string }) => {
      const { data, error } = await supabase
        .from("sprints")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Sprint;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
    },
  });

  const deleteSprint = useMutation({
    mutationFn: async (sprintId: string) => {
      const { error } = await supabase
        .from("sprints")
        .delete()
        .eq("id", sprintId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprints", projectId] });
    },
  });

  return { sprints, isLoading, error, createSprint, updateSprint, deleteSprint };
}

export function useSprintTasks(sprintId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: taskIds = [], isLoading } = useQuery({
    queryKey: ["sprint-tasks", sprintId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sprint_tasks")
        .select("task_id")
        .eq("sprint_id", sprintId);

      if (error) throw new Error(error.message);
      return (data ?? []).map((r) => r.task_id) as string[];
    },
    enabled: !!sprintId,
  });

  const addTaskToSprint = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("sprint_tasks")
        .insert([{ sprint_id: sprintId, task_id: taskId }]);
      if (error) {
        if (error.code === "23505") throw new Error("La tarea ya está en este sprint.");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", sprintId] });
    },
  });

  const removeTaskFromSprint = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("sprint_tasks")
        .delete()
        .eq("sprint_id", sprintId)
        .eq("task_id", taskId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sprint-tasks", sprintId] });
    },
  });

  return { taskIds, isLoading, addTaskToSprint, removeTaskFromSprint };
}
