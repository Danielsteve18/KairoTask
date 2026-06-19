"use client";

import { useRef, useEffect } from "react";
import { Bell, BellRing, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/useNotificationStore";
import {
  useNotifications,
  useUnreadCount,
  useMarkAsRead,
  useMarkAllAsRead,
  useRealtimeNotifications,
} from "@/hooks/useNotifications";
import { NotificationItem } from "./NotificationItem";

export function NotificationBell() {
  const { isOpen, toggle, close } = useNotificationStore();
  const { data: notifications = [] } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useRealtimeNotifications();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [close]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggle}
        className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150"
        style={{ color: "var(--dash-text-muted)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)";
          (e.currentTarget as HTMLElement).style.color = "var(--dash-text)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--dash-text-muted)";
        }}
        aria-label="Notificaciones"
      >
        {isOpen ? (
          <BellRing className="w-5 h-5" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 flex items-center justify-center rounded-full text-[10px] font-bold text-white"
            style={{ background: "#EF4444", minWidth: "18px", height: "18px", lineHeight: "18px" }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] rounded-xl border shadow-2xl z-50 flex flex-col overflow-hidden"
            style={{
              background: "var(--dash-surface)",
              borderColor: "var(--dash-border)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b shrink-0"
              style={{ borderColor: "var(--dash-border)" }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: "var(--dash-text)" }}
              >
                Notificaciones
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => markAllAsRead.mutate()}
                  className="flex items-center gap-1.5 text-xs font-medium transition-colors duration-150"
                  style={{ color: "var(--dash-accent)" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.8";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Marcar todas como leídas
                </button>
              )}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                  <Bell className="w-10 h-10 mb-3" style={{ color: "var(--dash-text-muted)" }} />
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--dash-text-muted)" }}
                  >
                    No hay notificaciones
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onMarkRead={(id) => markAsRead.mutate(id)}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
