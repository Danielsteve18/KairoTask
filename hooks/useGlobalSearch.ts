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

interface MemberSearchResult {
  id: string;
  full_name: string | null;
  email: string;
  type: "member";
}

export type SearchResult = ProjectSearchResult | TaskSearchResult | MemberSearchResult;

export function useGlobalSearch() {
  const supabase = useMemo(() => createClient(), []);

  const projectsQuery = useQuery({
    queryKey: ["global-search-projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("id, name, description, color")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []).map((p) => ({ ...p, type: "project" as const }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const tasksQuery = useQuery({
    queryKey: ["global-search-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, project_id, title, description")
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      const projectIds = [...new Set((data ?? []).map((t) => t.project_id))];
      const { data: projects } = await supabase
        .from("projects")
        .select("id, name")
        .in("id", projectIds);

      const projectMap = new Map((projects ?? []).map((p) => [p.id, p.name]));

      return (data ?? []).map((t) => ({
        ...t,
        project_name: projectMap.get(t.project_id) ?? "",
        type: "task" as const,
      }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const membersQuery = useQuery({
    queryKey: ["global-search-members"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email");

      if (error) throw error;
      return (data ?? []).map((m) => ({ ...m, type: "member" as const }));
    },
    staleTime: 1000 * 60 * 5,
  });

  const isLoading = projectsQuery.isLoading || tasksQuery.isLoading || membersQuery.isLoading;

  function search(query: string): SearchResult[] {
    if (!query.trim()) return [];

    const q = query.toLowerCase();
    const results: SearchResult[] = [];

    const projects = projectsQuery.data ?? [];
    const tasks = tasksQuery.data ?? [];
    const members = membersQuery.data ?? [];

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

    for (const m of members) {
      if (
        (m.full_name && m.full_name.toLowerCase().includes(q)) ||
        m.email.toLowerCase().includes(q)
      ) {
        results.push(m);
      }
    }

    return results.slice(0, 20);
  }

  return { search, isLoading };
}
