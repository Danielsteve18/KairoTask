"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Trash2, Loader2 } from "lucide-react";
import { useTaskComments } from "@/hooks/useTaskComments";

interface CommentsSectionProps {
  taskId: string;
}

export function CommentsSection({ taskId }: CommentsSectionProps) {
  const [newComment, setNewComment] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { comments, isLoading, addComment, deleteComment } = useTaskComments(taskId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = newComment.trim();
    if (!text) return;
    setNewComment("");
    try {
      await addComment.mutateAsync(text);
    } catch {
      setNewComment(text);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-3.5 h-3.5" style={{ color: "var(--dash-text-muted)" }} />
        <span className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
          Comentarios
        </span>
        <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
          [{comments.length}]
        </span>
      </div>

      {/* Comment list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        <AnimatePresence initial={false}>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-[11px] font-mono text-center py-4" style={{ color: "var(--dash-text-muted)" }}>
              Sin comentarios aún
            </p>
          ) : (
            comments.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="flex gap-2.5 px-3 py-2 rounded-lg"
                style={{ background: "var(--dash-bg)" }}
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
                  style={{ background: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                >
                  {(c.profile?.full_name?.[0] || c.profile?.email?.[0] || "?").toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold font-mono truncate" style={{ color: "var(--dash-text)" }}>
                      {c.profile?.full_name || c.profile?.email || "Anónimo"}
                    </span>
                    <span className="text-[9px] font-mono shrink-0" style={{ color: "var(--dash-text-muted)" }}>
                      {formatTime(c.created_at)}
                    </span>
                  </div>
                  <p className="text-[11px] mt-0.5 whitespace-pre-wrap break-words" style={{ color: "var(--dash-text-secondary)" }}>
                    {c.content}
                  </p>
                </div>
                <button
                  onClick={() => deleteComment.mutate(c.id)}
                  className="w-5 h-5 rounded flex items-center justify-center shrink-0 opacity-0 hover:opacity-100 transition-opacity hover:bg-red-400/10"
                  style={{ color: "#EF4444" }}
                  title="Eliminar"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <textarea
          ref={inputRef}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escribe un comentario…"
          rows={1}
          className="flex-1 px-3 py-2 rounded-lg border text-[11px] font-mono outline-none transition-all resize-none"
          style={{
            background: "var(--dash-bg)",
            borderColor: "var(--dash-border)",
            color: "var(--dash-text)",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#22C55E")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--dash-border)")}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
        />
        <button
          type="submit"
          disabled={!newComment.trim() || addComment.isPending}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-40 shrink-0"
          style={{
            background: "linear-gradient(135deg, #22C55E, #16A34A)",
            color: "#fff",
          }}
        >
          {addComment.isPending ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </button>
      </form>
    </div>
  );
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}
