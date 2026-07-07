"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Paperclip, FileText, Image, File, Trash2, Upload,
  Loader2, Download,
} from "lucide-react";
import {
  useTaskAttachments,
  useCreateAttachment,
  useDeleteAttachment,
  type TaskAttachment,
} from "@/hooks/useTaskAttachments";
import { createClient } from "@/lib/supabase/client";
import { uploadAttachment, getAttachmentUrl } from "@/lib/supabase/storage";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <Image className="w-4 h-4" />;
  if (mime.includes("pdf")) return <FileText className="w-4 h-4" />;
  return <File className="w-4 h-4" />;
}

function AttachmentRow({ attachment }: { attachment: TaskAttachment }) {
  const deleteAtt = useDeleteAttachment();
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const url = await getAttachmentUrl(attachment.storage_path);
      if (url) window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteAtt.mutateAsync({
        attachmentId: attachment.id,
        storagePath: attachment.storage_path,
        taskId: attachment.task_id,
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-white/[0.03]">
      <div className="shrink-0" style={{ color: "var(--dash-text-muted)" }}>
        {fileIcon(attachment.mime_type)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate" style={{ color: "var(--dash-text)" }}>
          {attachment.file_name}
        </p>
        <p className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
          {formatSize(attachment.file_size)}
        </p>
      </div>
      <div className="flex gap-1">
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="p-1.5 rounded-md transition-colors hover:bg-white/5 disabled:opacity-50"
          style={{ color: "var(--dash-text-muted)" }}
          aria-label="Descargar"
        >
          {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 rounded-md transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          style={{ color: "var(--dash-text-muted)" }}
          aria-label="Eliminar"
        >
          {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

interface TaskAttachmentsProps {
  taskId: string;
}

export function TaskAttachments({ taskId }: TaskAttachmentsProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: attachments, isLoading } = useTaskAttachments(taskId);
  const createAtt = useCreateAttachment();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      const storagePath = await uploadAttachment(file, taskId, user?.id ?? "unknown");
      await createAtt.mutateAsync({
        taskId,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        storagePath,
      });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="w-4 h-4" style={{ color: "var(--dash-text-muted)" }} />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
            Adjuntos {attachments ? `(${attachments.length})` : ""}
          </span>
        </div>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={handleUpload}
        />
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 disabled:opacity-50"
          style={{ background: "rgba(34,197,94,0.1)", color: "var(--dash-accent)" }}
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          {uploading ? "Subiendo..." : "Subir archivo"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
        </div>
      )}

      {!isLoading && attachments && attachments.length === 0 && (
        <p className="text-xs text-center py-4" style={{ color: "var(--dash-text-muted)" }}>
          No hay archivos adjuntos
        </p>
      )}

      {attachments && attachments.length > 0 && (
        <div className="space-y-1">
          {attachments.map((att) => (
            <AttachmentRow key={att.id} attachment={att} />
          ))}
        </div>
      )}
    </div>
  );
}
