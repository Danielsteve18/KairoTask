"use client";

import { useEffect, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export function useTaskComments(taskId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);
  const uid = useRef(Math.random().toString(36).slice(2, 8)).current;

  const {
    data: comments = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["task-comments", taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("task_comments")
        .select(`
          id,
          task_id,
          user_id,
          content,
          created_at,
          profile:profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq("task_id", taskId)
        .order("created_at", { ascending: true });

      if (error) throw new Error(error.message);
      return data as unknown as Comment[];
    },
    enabled: !!taskId,
  });

  useEffect(() => {
    if (!taskId) return;

    const channel = supabase
      .channel(`task-comments:${taskId}:${uid}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "task_comments",
          filter: `task_id=eq.${taskId}`,
        },
        (_payload: RealtimePostgresChangesPayload<{ id: string }>) => {
          queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
        },
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR") {
          console.error("Error en Realtime comments");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [taskId, queryClient]);

  const addComment = useMutation({
    mutationFn: async (content: string) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");

      const { data, error } = await supabase
        .from("task_comments")
        .insert([{ task_id: taskId, user_id: user.id, content }])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from("task_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-comments", taskId] });
    },
  });

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
  };
}
