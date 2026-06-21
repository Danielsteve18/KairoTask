"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface TaskAttachment {
  id: string;
  task_id: string;
  user_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
}

async function fetchAttachments(taskId: string): Promise<TaskAttachment[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("task_attachments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export function useTaskAttachments(taskId: string) {
  return useQuery({
    queryKey: ["task-attachments", taskId],
    queryFn: () => fetchAttachments(taskId),
    enabled: !!taskId,
  });
}

export function useCreateAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      fileName,
      fileSize,
      mimeType,
      storagePath,
    }: {
      taskId: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      storagePath: string;
    }) => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("task_attachments").insert({
        task_id: taskId,
        user_id: user.id,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        storage_path: storagePath,
      });

      if (error) throw error;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["task-attachments", variables.taskId] });
    },
  });
}

export function useDeleteAttachment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      attachmentId,
      storagePath,
    }: {
      attachmentId: string;
      storagePath: string;
    }) => {
      const supabase = createClient();

      const { error: storageError } = await supabase.storage
        .from("task-attachments")
        .remove([storagePath]);

      if (storageError) throw storageError;

      const { error } = await supabase
        .from("task_attachments")
        .delete()
        .eq("id", attachmentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task-attachments"] });
    },
  });
}
