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
  // Estos campos vienen mockeados para la UI por ahora, ya que no tenemos tablas de tareas y miembros aún
  tasks: { total: number; done: number };
  members: string[];
}

export function useProjects() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // Fetch Projects
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);

      // Mapeamos para añadir los campos mockeados necesarios por la UI temporalmente
      return (data as Project[]).map((p) => ({
        ...p,
        tasks: { total: 0, done: 0 },
        members: ["U"],
      }));
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
  };
}
