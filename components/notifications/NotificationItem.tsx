"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Bell, MessageCircle, AtSign, Clock } from "lucide-react";
import type { Notification } from "@/hooks/useNotifications";

const typeIcons: Record<Notification["type"], typeof Bell> = {
  task_assigned: Bell,
  comment: MessageCircle,
  mention: AtSign,
  deadline: Clock,
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} d`;
}

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const router = useRouter();
  const Icon = typeIcons[notification.type] ?? Bell;

  const handleClick = () => {
    if (!notification.is_read) {
      onMarkRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      onClick={handleClick}
      className="w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-150 border-b last:border-b-0"
      style={{
        background: notification.is_read
          ? "transparent"
          : "rgba(34,197,94,0.06)",
        borderColor: "var(--dash-border)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = notification.is_read
          ? "transparent"
          : "rgba(34,197,94,0.06)";
      }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
        style={{
          background: "rgba(34,197,94,0.1)",
          color: "var(--dash-accent)",
        }}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate"
          style={{ color: "var(--dash-text)" }}
        >
          {notification.title}
        </p>
        {notification.message && (
          <p
            className="text-xs mt-0.5 line-clamp-2"
            style={{ color: "var(--dash-text-muted)" }}
          >
            {notification.message}
          </p>
        )}
      </div>
      <span
        className="text-[10px] whitespace-nowrap mt-0.5"
        style={{ color: "var(--dash-text-muted)" }}
      >
        {relativeTime(notification.created_at)}
      </span>
    </motion.button>
  );
}
