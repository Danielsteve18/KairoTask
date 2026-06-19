import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

export interface ProjectMember {
  id: string;
  project_id: string;
  user_id: string;
  role: "owner" | "collaborator" | "viewer";
  created_at: string;
  profile: Profile;
  project?: {
    id: string;
    name: string;
    color: string;
  };
}

export function useProjectMembers(projectId?: string) {
  const queryClient = useQueryClient();
  const supabase = createClient();

  // ── Fetch Members of a Single Project ───────────────────────────────────────
  const {
    data: members = [],
    isLoading: isLoadingMembers,
    error: membersError,
  } = useQuery({
    queryKey: ["project-members", projectId],
    queryFn: async () => {
      if (!projectId) return [];
      const { data, error } = await supabase
        .from("project_members")
        .select(`
          id,
          project_id,
          user_id,
          role,
          created_at,
          profile:profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq("project_id", projectId);

      if (error) throw new Error(error.message);
      return data as unknown as ProjectMember[];
    },
    enabled: !!projectId,
  });

  // ── Fetch Workspace Team Directory (all members in user's projects) ────────
  const {
    data: teamMembers = [],
    isLoading: isLoadingTeam,
    error: teamError,
  } = useQuery({
    queryKey: ["workspace-team"],
    queryFn: async () => {
      // 1. Obtener proyectos a los que el usuario tiene acceso (filtrados por RLS)
      const { data: projects, error: projErr } = await supabase
        .from("projects")
        .select("id, name, color, owner_id");

      if (projErr) throw new Error(projErr.message);
      if (!projects || projects.length === 0) return [];

      const projectIds = projects.map((p) => p.id);

      // 2. Obtener miembros de todos esos proyectos
      const { data: mData, error: memErr } = await supabase
        .from("project_members")
        .select(`
          id,
          project_id,
          user_id,
          role,
          created_at,
          profile:profiles (
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .in("project_id", projectIds);

      if (memErr) throw new Error(memErr.message);

      // Mapear miembros con la meta de los proyectos
      const projectMap = new Map(projects.map((p) => [p.id, p]));
      const allMembers: ProjectMember[] = (mData as unknown as ProjectMember[] || []).map((m) => ({
        ...m,
        project: projectMap.get(m.project_id)
          ? {
              id: m.project_id,
              name: projectMap.get(m.project_id)!.name,
              color: projectMap.get(m.project_id)!.color,
            }
          : undefined,
      }));

      // Añadir dueños de proyectos que no están explícitamente en project_members
      const memberUserIds = new Set((mData || []).map(m => m.user_id));
      const ownerIds = [...new Set(projects.map(p => p.owner_id))].filter(
        oid => !memberUserIds.has(oid)
      );

      if (ownerIds.length > 0) {
        const { data: ownerProfiles } = await supabase
          .from("profiles")
          .select("id, email, full_name, avatar_url")
          .in("id", ownerIds);

        const profileMap = new Map((ownerProfiles || []).map(p => [p.id, p]));

        for (const project of projects) {
          if (!memberUserIds.has(project.owner_id)) {
            const profile = profileMap.get(project.owner_id);
            allMembers.push({
              id: `owner-${project.owner_id}-${project.id}`,
              project_id: project.id,
              user_id: project.owner_id,
              role: "owner",
              created_at: "",
              profile: profile ?? { id: project.owner_id, email: "", full_name: "Dueño", avatar_url: null },
              project: { id: project.id, name: project.name, color: project.color },
            });
          }
        }
      }

      return allMembers;
    },
  });

  // ── Invite/Add Member to Project ───────────────────────────────────────────
  const addMember = useMutation({
    mutationFn: async ({ email, role = "collaborator" }: { email: string; role?: "collaborator" | "viewer" }) => {
      if (!projectId) throw new Error("ID de proyecto no especificado");

      const cleanEmail = email.trim().toLowerCase();

      // 1. Buscar si el perfil del usuario existe en KairoTask
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", cleanEmail)
        .maybeSingle();

      if (profileErr) throw new Error(profileErr.message);
      if (!profile) {
        throw new Error(`El usuario con email "${cleanEmail}" no está registrado en KairoTask.`);
      }

      // 2. Insertar en project_members
      const { data, error } = await supabase
        .from("project_members")
        .insert([
          {
            project_id: projectId,
            user_id: profile.id,
            role,
          },
        ])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          throw new Error("El usuario ya es miembro de este proyecto.");
        }
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-team"] });
    },
  });

  // ── Update Member Role ─────────────────────────────────────────────────────
  const updateMemberRole = useMutation({
    mutationFn: async ({ memberId, role }: { memberId: string; role: "collaborator" | "viewer" }) => {
      const { data, error } = await supabase
        .from("project_members")
        .update({ role })
        .eq("id", memberId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-team"] });
    },
  });

  // ── Remove Member from Project ─────────────────────────────────────────────
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const { error } = await supabase
        .from("project_members")
        .delete()
        .eq("id", memberId);

      if (error) throw new Error(error.message);
      return memberId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-members", projectId] });
      queryClient.invalidateQueries({ queryKey: ["workspace-team"] });
    },
  });

  return {
    members,
    isLoadingMembers,
    membersError,
    teamMembers,
    isLoadingTeam,
    teamError,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
