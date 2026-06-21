"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface TaskDependency {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  dependency_type: "blocks" | "requires";
  created_at: string;
}

export function useTaskDependencies(taskId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: dependencies = [], isLoading } = useQuery({
    queryKey: ["task-dependencies", taskId],
    queryFn: async () => {
      const [blocking, blockedBy] = await Promise.all([
        supabase
          .from("task_dependencies")
          .select("*, depends_on_task:task_id!depends_on_task_id(id, title, status)")
          .eq("task_id", taskId),
        supabase
          .from("task_dependencies")
          .select("*, task:task_id!task_id(id, title, status)")
          .eq("depends_on_task_id", taskId),
      ]);

      if (blocking.error) throw new Error(blocking.error.message);
      if (blockedBy.error) throw new Error(blockedBy.error.message);

      return {
        blocking: (blocking.data ?? []) as TaskDependency[],
        blockedBy: (blockedBy.data ?? []) as TaskDependency[],
      };
    },
    enabled: !!taskId,
  });

  const addDependency = useMutation({
    mutationFn: async ({
      dependsOnTaskId,
      type,
    }: {
      dependsOnTaskId: string;
      type: "blocks" | "requires";
    }) => {
      const { error } = await supabase.from("task_dependencies").insert([
        {
          task_id: taskId,
          depends_on_task_id: dependsOnTaskId,
          dependency_type: type,
        },
      ]);
      if (error) {
        if (error.code === "23505") throw new Error("Esta dependencia ya existe.");
        if ("constraint" in error && (error as { constraint: string }).constraint === "no_self_dependency") throw new Error("Una tarea no puede depender de sí misma.");
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-dependencies", taskId] });
    },
  });

  const removeDependency = useMutation({
    mutationFn: async (dependencyId: string) => {
      const { error } = await supabase
        .from("task_dependencies")
        .delete()
        .eq("id", dependencyId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-dependencies", taskId] });
    },
  });

  return { dependencies, isLoading, addDependency, removeDependency };
}
