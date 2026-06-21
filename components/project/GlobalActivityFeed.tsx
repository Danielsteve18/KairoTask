"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, Loader2, FolderKanban } from "lucide-react";
import { useGlobalActivity } from "@/hooks/useGlobalActivity";
import { formatActivity, type ActivityEntry } from "@/hooks/useActivityLog";

export function GlobalActivityFeed() {
  const { entries, isLoading } = useGlobalActivity();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 gap-3">
        <Clock className="w-8 h-8" style={{ color: "var(--dash-text-muted)" }} />
        <p className="text-xs font-mono text-center" style={{ color: "var(--dash-text-muted)" }}>
          No hay actividad en tu workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence initial={false}>
        {entries.map((entry: ActivityEntry, i: number) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5"
              style={{ background: "var(--dash-border)", color: "var(--dash-text-muted)" }}
            >
              {(entry.profile?.full_name?.[0] || entry.profile?.email?.[0] || "?").toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs leading-snug" style={{ color: "var(--dash-text)" }}>
                {formatActivity(entry)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                {entry.project_name && (
                  <span className="text-[10px] font-mono flex items-center gap-1" style={{ color: "var(--dash-accent)" }}>
                    <FolderKanban className="w-2.5 h-2.5" />
                    {entry.project_name}
                  </span>
                )}
                <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                  {relativeTime(entry.created_at)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}
