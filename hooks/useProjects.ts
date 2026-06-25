import { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "review" | "pending" | "done";
  progress: number;
  color: string;
  owner_id: string;
  created_at: string;
  tasks: { total: number; done: number };
  memberCount: number;
}

export interface CurrentUser {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export function useProjects() {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setCurrentUser({
          id: data.user.id,
          email: data.user.email ?? "",
          full_name: data.user.user_metadata?.full_name ?? null,
          avatar_url: data.user.user_metadata?.avatar_url ?? null,
        });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email ?? "",
          full_name: session.user.user_metadata?.full_name ?? null,
          avatar_url: session.user.user_metadata?.avatar_url ?? null,
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Fetch Projects
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      const projectIds = (data as Project[]).map((p) => p.id);
      if (projectIds.length === 0) return [];

      const [taskCounts, memberCounts] = await Promise.all([
        supabase
          .from("tasks")
          .select("project_id, status")
          .in("project_id", projectIds),
        supabase
          .from("project_members")
          .select("project_id")
          .in("project_id", projectIds),
      ]);

      const taskMap = new Map<string, { total: number; done: number }>();
      for (const t of taskCounts.data ?? []) {
        const curr = taskMap.get(t.project_id) ?? { total: 0, done: 0 };
        curr.total++;
        if (t.status === "done") curr.done++;
        taskMap.set(t.project_id, curr);
      }

      const memberMap = new Map<string, number>();
      for (const m of memberCounts.data ?? []) {
        memberMap.set(m.project_id, (memberMap.get(m.project_id) ?? 0) + 1);
      }

      return (data as Project[]).map((p) => ({
        ...p,
        tasks: taskMap.get(p.id) ?? { total: 0, done: 0 },
        memberCount: memberMap.get(p.id) ?? 1,
      }));
    },
  });

  // Delete Project
  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", projectId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  // Create Project
  const createProject = useMutation({
    mutationFn: async (newProject: { name: string; description?: string; color: string; owner_id: string }) => {
      const { data, error } = await supabase
        .from("projects")
        .insert([newProject])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return {
    projects,
    isLoading,
    error,
    createProject,
    deleteProject,
    currentUser,
  };
}
