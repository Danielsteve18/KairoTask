"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

interface Webhook {
  id: string;
  project_id: string;
  name: string;
  url: string;
  events: string[];
  is_active: boolean;
  secret: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  project?: { name: string; color: string };
}

export function useWebhooks() {
  const supabase = createClient();
  return useQuery({
    queryKey: ["webhooks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_webhooks")
        .select("*, project:projects(name,color)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Webhook[];
    },
  });
}

export function useCreateWebhook() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (wh: {
      project_id: string;
      name: string;
      url: string;
      events: string[];
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No autenticado");
      const { data, error } = await supabase
        .from("project_webhooks")
        .insert({ ...wh, created_by: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks"] }),
  });
}

export function useDeleteWebhook() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_webhooks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks"] }),
  });
}

export function useToggleWebhook() {
  const supabase = createClient();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("project_webhooks")
        .update({ is_active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["webhooks"] }),
  });
}
