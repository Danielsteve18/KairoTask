"use client";

import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface ProjectInvitation {
  id: string;
  project_id: string;
  invited_email: string;
  invited_by: string;
  role: "collaborator" | "viewer";
  token: string;
  status: "pending" | "accepted" | "declined" | "expired";
  message: string | null;
  expires_at: string;
  created_at: string;
}

export function useInvitations(projectId: string) {
  const queryClient = useQueryClient();
  const supabase = useMemo(() => createClient(), []);

  const { data: invitations = [], isLoading } = useQuery({
    queryKey: ["invitations", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_invitations")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data as ProjectInvitation[];
    },
    enabled: !!projectId,
  });

  const createInvitation = useMutation({
    mutationFn: async ({
      email,
      role = "collaborator",
      message,
    }: {
      email: string;
      role?: "collaborator" | "viewer";
      message?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      const token = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from("project_invitations")
        .insert([{
          project_id: projectId,
          invited_email: email.trim().toLowerCase(),
          invited_by: user.id,
          role,
          token,
          message: message || null,
          expires_at: expiresAt,
        }])
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          const pending = invitations.find(
            (i) => i.invited_email === email.trim().toLowerCase() && i.status === "pending"
          );
          if (pending) throw new Error("Ya hay una invitación pendiente para este email.");
        }
        throw new Error(error.message);
      }

      return { invitation: data as ProjectInvitation, token };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", projectId] });
    },
  });

  const cancelInvitation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase
        .from("project_invitations")
        .update({ status: "expired" })
        .eq("id", invitationId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations", projectId] });
    },
  });

  return { invitations, isLoading, createInvitation, cancelInvitation };
}

export function usePendingInvitations() {
  const supabase = useMemo(() => createClient(), []);

  const acceptInvitation = useMutation({
    mutationFn: async ({ token }: { token: string }) => {
      const supabase = createClient();

      const { data: invitation, error: fetchError } = await supabase
        .from("project_invitations")
        .select("*")
        .eq("token", token)
        .eq("status", "pending")
        .single();

      if (fetchError || !invitation) throw new Error("Invitación no encontrada o ya expiró.");

      if (new Date(invitation.expires_at) < new Date()) {
        await supabase
          .from("project_invitations")
          .update({ status: "expired" })
          .eq("id", invitation.id);
        throw new Error("La invitación ha expirado.");
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Debes iniciar sesión para aceptar la invitación.");

      if (user.email !== invitation.invited_email) {
        throw new Error(`Esta invitación es para ${invitation.invited_email}. Usa esa cuenta.`);
      }

      const { error: memberError } = await supabase
        .from("project_members")
        .insert([{
          project_id: invitation.project_id,
          user_id: user.id,
          role: invitation.role,
        }]);

      if (memberError) {
        if (memberError.code === "23505") throw new Error("Ya eres miembro de este proyecto.");
        throw new Error(memberError.message);
      }

      const { error: updateError } = await supabase
        .from("project_invitations")
        .update({ status: "accepted" })
        .eq("id", invitation.id);

      if (updateError) throw new Error(updateError.message);

      return invitation;
    },
  });

  return { acceptInvitation };
}
