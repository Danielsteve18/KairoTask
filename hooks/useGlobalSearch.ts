import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { useMemo } from "react";

interface ProjectSearchResult {
  id: string;
  name: string;
  description: string | null;
  color: string;
  type: "project";
}

interface TaskSearchResult {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  project_name: string;
  type: "task";
}

export type SearchResult = ProjectSearchResult | TaskSearchResult;

export function useGlobalSearch() {
  const supabase = useMemo(() => createClient(), []);

  const projectsQuery = useQuery({
    queryKey: ["global-search-projects"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, color")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, type: "project" as const }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const tasksQuery = useQuery({
    queryKey: ["global-search-tasks"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: projects } = await supabase
        .from("projects")
        .select("id, name")
        .eq("owner_id", user.id);

      const projectIds = (projects ?? []).map((p) => p.id);
      if (projectIds.length === 0) return [];

      const { data, error } = await supabase
        .from("tasks")
        .select("id, project_id, title, description")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const projectMap = new Map((projects ?? []).map((p) => [p.id, p.name]));

      return (data ?? []).map((t) => ({
        ...t,
        project_name: projectMap.get(t.project_id) ?? "",
        type: "task" as const,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = projectsQuery.isLoading || tasksQuery.isLoading;

  function search(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    const projects = projectsQuery.data ?? [];
    const tasks = tasksQuery.data ?? [];

    for (const p of projects) {
      if (
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      ) {
        results.push(p);
      }
    }

    for (const t of tasks) {
      if (
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
      ) {
        results.push(t);
      }
    }

    return results.slice(0, 20);
  }

  return { search, isLoading };
}
