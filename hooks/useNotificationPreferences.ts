import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  task_assignment: boolean;
  mentions: boolean;
}

const PREF_KEY = ["notification_preferences"] as const;

async function fetchPreferences(): Promise<NotificationPreferences> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notification_preferences")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error && error.code !== "PGRST116") throw error;

  return {
    email: data?.email ?? true,
    push: data?.push ?? false,
    task_assignment: data?.task_assignment ?? true,
    mentions: data?.mentions ?? true,
  };
}

async function upsertPreferences(prefs: NotificationPreferences): Promise<void> {
  const supabase = createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("notification_preferences")
    .upsert(
      { user_id: user.user.id, ...prefs, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );

  if (error) throw error;
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: PREF_KEY,
    queryFn: fetchPreferences,
    staleTime: Infinity,
  });
}

export function useSavePreferences() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: upsertPreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PREF_KEY });
    },
  });
}
