"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface ActivityEntry {
  id: string;
  project_id: string;
  task_id: string | null;
  user_id: string;
  action: string;
  metadata: Record<string, unknown>;
  created_at: string;
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

const ACTION_LABELS: Record<string, string> = {
  task_created: "creó la tarea",
  task_moved: "movió la tarea",
};

export function formatActivity(entry: ActivityEntry): string {
  const name = entry.profile?.full_name || entry.profile?.email || "Alguien";
  const label = ACTION_LABELS[entry.action] ?? entry.action;
  const title = (entry.metadata?.title as string) ?? "";

  if (entry.action === "task_moved") {
    const from = (entry.metadata?.from_status as string) ?? "";
    const to = (entry.metadata?.to_status as string) ?? "";
    return `${name} ${label} "${title}" de ${from} a ${to}`;
  }

  if (entry.action === "task_created") {
    return `${name} ${label} "${title}"`;
  }

  return `${name} ${label}`;
}

export function useActivityLog(projectId: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const {
    data: entries = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activity-log", projectId],
    queryFn: async () => {
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
        .eq("project_id", projectId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw new Error(error.message);
      return data as unknown as ActivityEntry[];
    },
    enabled: !!projectId,
  });

  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel(`activity-log:${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "activity_log",
          filter: `project_id=eq.${projectId}`,
        },
        (_payload: RealtimePostgresChangesPayload<{ id: string }>) => {
          queryClient.invalidateQueries({ queryKey: ["activity-log", projectId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, queryClient, supabase]);

  return {
    entries,
    isLoading,
    error,
  };
}
