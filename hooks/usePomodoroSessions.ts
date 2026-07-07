import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { usePomodoroStore } from "@/store/usePomodoroStore";
import { useState, useEffect } from "react";

interface PomodoroSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_minutes: number;
  type: "focus" | "break" | "long_break";
  completed: boolean;
}

async function fetchTodaySessions(userId: string): Promise<PomodoroSession[]> {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("*")
    .eq("user_id", userId)
    .gte("started_at", today.toISOString())
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

async function fetchWeekStats(userId: string): Promise<{ date: string; total_minutes: number }[]> {
  const supabase = createClient();
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 6);
  weekAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("pomodoro_sessions")
    .select("started_at, duration_minutes")
    .eq("user_id", userId)
    .eq("type", "focus")
    .eq("completed", true)
    .gte("started_at", weekAgo.toISOString());

  if (error) throw error;

  const dayMap = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayMap.set(d.toLocaleDateString("es-CO", { weekday: "short" }), 0);
  }

  for (const row of data ?? []) {
    const day = new Date(row.started_at).toLocaleDateString("es-CO", { weekday: "short" });
    dayMap.set(day, (dayMap.get(day) ?? 0) + row.duration_minutes);
  }

  return Array.from(dayMap.entries()).map(([date, total_minutes]) => ({
    date,
    total_minutes,
  }));
}

export function usePomodoroSessions() {
  const setTotalFocusToday = usePomodoroStore((s) => s.setTotalFocusToday);
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  const todayQuery = useQuery({
    queryKey: ["pomodoro-sessions", "today", userId],
    queryFn: () => fetchTodaySessions(userId!),
    enabled: !!userId,
  });

  const weekQuery = useQuery({
    queryKey: ["pomodoro-sessions", "week", userId],
    queryFn: () => fetchWeekStats(userId!),
    enabled: !!userId,
  });

  useEffect(() => {
    if (todayQuery.data) {
      const total = todayQuery.data
        .filter((s) => s.type === "focus" && s.completed)
        .reduce((acc, s) => acc + s.duration_minutes, 0);
      setTotalFocusToday(total);
    }
  }, [todayQuery.data, setTotalFocusToday]);

  const saveSession = useMutation({
    mutationFn: async (session: {
      duration_minutes: number;
      type: "focus" | "break" | "long_break";
      completed: boolean;
    }) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .insert({ ...session, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pomodoro-sessions"] });
    },
  });

  const completedSessions = todayQuery.data?.filter((s) => s.completed).length ?? 0;

  return {
    todaySessions: todayQuery.data ?? [],
    weekStats: weekQuery.data ?? [],
    completedSessions,
    isLoading: todayQuery.isLoading || weekQuery.isLoading,
    saveSession,
    refetch: () => {
      todayQuery.refetch();
      weekQuery.refetch();
    },
  };
}
