import { createClient } from "@/lib/supabase/client";

const AVATARS_BUCKET = "avatars";
const ATTACHMENTS_BUCKET = "task-attachments";

export async function uploadAvatar(
  file: File,
  userId: string,
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "png";
  const path = `${userId}.${ext}`;

  const supabase = createClient();
  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(path);

  return urlData.publicUrl;
}

export async function uploadAttachment(
  file: File,
  taskId: string,
  userId: string,
): Promise<string> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const uniqueName = `${Date.now()}-${file.name}`;
  const path = `${userId}/${taskId}/${uniqueName}`;

  const { error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .upload(path, file);

  if (error) throw error;

  return path;
}

export async function getAttachmentUrl(
  storagePath: string,
): Promise<string> {
  const supabase = createClient();

  const { data } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(storagePath, 3600);

  return data?.signedUrl ?? "";
}

export async function deleteStorageFile(
  bucket: "avatars" | "task-attachments",
  path: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
}
