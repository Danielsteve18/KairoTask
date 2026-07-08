"use client";

import { useEffect, useMemo, useId } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { ActivityEntry } from "@/hooks/useActivityLog";

export function useGlobalActivity() {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const uid = useId();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ["global-activity"],
    queryFn: async () => {
      const { data: projects } = await supabase
        .from("projects")
        .select("id");

      if (!projects || projects.length === 0) return [];

      const projectIds = projects.map((p) => p.id);

      const { data, error } = await supabase
        .from("activity_log")
        .select(`
          id,
          project_id,
          task_id,
          user_id,
          action,
          metadata,
          created_at,
          profile:profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw new Error(error.message);

      const projectNames = new Map(
        projects.map((p) => [p.id, p.id])
      );

      if (data && data.length > 0) {
        const { data: projNames } = await supabase
          .from("projects")
          .select("id, name")
          .in("id", [...new Set(data.map((e) => e.project_id))]);

        if (projNames) {
          for (const p of projNames) {
            projectNames.set(p.id, (p as { id: string; name: string }).name);
          }
        }
      }

      return (data as unknown as (ActivityEntry & { project_name?: string })[] ?? []).map((entry) => ({
        ...entry,
        project_name: projectNames.get(entry.project_id) ?? "Unknown",
      }));
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`global-activity:${uid}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_log",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["global-activity"] });
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient, supabase, uid]);

  return { entries, isLoading };
}
