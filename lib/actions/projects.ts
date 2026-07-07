"use server";

import { createClient } from "@/lib/supabase/server";

export async function createProjectAction(data: {
  name: string;
  description?: string;
  color: string;
}) {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Debes iniciar sesión para crear un proyecto.");
  }

  const { data: project, error } = await supabase
    .from("projects")
    .insert([{
      name: data.name,
      description: data.description || null,
      color: data.color,
      owner_id: user.id,
    }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return project;
}
