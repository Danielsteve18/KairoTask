import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { TaskStatus, Priority } from "@/components/task/TaskCard";

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: Priority;
  assignee_id: string | null;
  due_date: string | null;
  tags: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: Priority;
  assignee_id?: string | null;
  tags?: string[];
}

export interface CreateTaskInput {
  project_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags?: string[];
  due_date?: string | null;
  assignee_id?: string | null;
}

export function useTasks(projectId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // ── Fetch all tasks for a project ──────────────────────────────────────────
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data as Task[];
    },
    enabled: !!projectId,
  });

  // ── Create Task ─────────────────────────────────────────────────────────────
  const createTask = useMutation({
    mutationFn: async (input: CreateTaskInput) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("tasks")
        .insert([{ ...input, created_by: user.id }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // ── Update Task Status (for Drag & Drop) ───────────────────────────────────
  const updateTaskStatus = useMutation({
    mutationFn: async ({
      taskId,
      status,
    }: {
      taskId: string;
      status: TaskStatus;
    }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", taskId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Task;
    },
    onMutate: async ({ taskId, status }) => {
      // Optimistic update: immediately reflect the new status in the cache
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]);

      queryClient.setQueryData<Task[]>(["tasks", projectId], (old) =>
        old ? old.map((t) => (t.id === taskId ? { ...t, status } : t)) : []
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      // Rollback on failure
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", projectId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // ── Update Task (full edit) ─────────────────────────────────────────────────
  const updateTask = useMutation({
    mutationFn: async (input: UpdateTaskInput) => {
      const { id, ...updates } = input;
      const { data, error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Task;
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]);

      queryClient.setQueryData<Task[]>(["tasks", projectId], (old) =>
        old ? old.map((t) => (t.id === input.id ? { ...t, ...input } : t)) : []
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", projectId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  // ── Delete Task ──────────────────────────────────────────────────────────────
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) throw new Error(error.message);
      return taskId;
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ["tasks", projectId] });
      const previousTasks = queryClient.getQueryData<Task[]>(["tasks", projectId]);

      queryClient.setQueryData<Task[]>(["tasks", projectId], (old) =>
        old ? old.filter((t) => t.id !== taskId) : []
      );

      return { previousTasks };
    },
    onError: (_err, _vars, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks", projectId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });

  return {
    tasks: tasks ?? [],
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
  };
}
