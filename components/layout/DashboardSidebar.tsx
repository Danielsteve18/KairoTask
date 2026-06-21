"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  Activity,
  Users,
  Settings,
  TerminalSquare,
  ChevronLeft,
  ChevronRight,
  Command,
  LayoutDashboard,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Proyectos", icon: FolderKanban, href: "/projects" },
  { name: "Equipo", icon: Users, href: "/team" },
  { name: "Pomodoro", icon: Activity, href: "/metrics" },
  { name: "Consola", icon: TerminalSquare, href: "/console" },
  { name: "Ajustes", icon: Settings, href: "/settings" },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname() || "";

  const sidebarContent = (
    <>
      {/* Botón de colapsar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full border flex items-center justify-center hover:opacity-80 transition-opacity z-30"
        style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Header del Sidebar */}
      <div className="h-16 flex items-center px-4 overflow-hidden shrink-0 border-b" style={{ borderColor: "var(--dash-border)" }}>
        <Link href="/projects" className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
            style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.2)", color: "var(--dash-accent)" }}>
            <Command className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-sm tracking-widest uppercase truncate"
              style={{ color: "var(--dash-text)" }}
            >
              KairoTask
            </motion.span>
          )}
        </Link>
      </div>

      {/* Navegación */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-2 overflow-y-auto overflow-x-hidden">
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative border"
              style={{
                background: isActive ? "rgba(34,197,94,0.1)" : "transparent",
                borderColor: isActive ? "rgba(34,197,94,0.2)" : "transparent",
                color: isActive ? "var(--dash-accent)" : "var(--dash-text-muted)",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)";
                  (e.currentTarget as HTMLElement).style.color = "var(--dash-text)";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--dash-text-muted)";
                }
              }}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!isCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.name}
                </span>
              )}
              {isActive && !isCollapsed && (
                <motion.div
                  layoutId="sidebar-active"
                  className="w-1.5 h-1.5 rounded-full ml-auto"
                  style={{ background: "var(--dash-accent)", boxShadow: "0 0 8px rgba(34,197,94,0.8)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: isCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex h-screen flex-col relative z-20 shrink-0 border-r"
        style={{
          background: "var(--dash-sidebar-bg)",
          borderColor: "var(--dash-border)",
        }}
      >
        {sidebarContent}
      </motion.aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t px-2 py-1"
        style={{
          background: "var(--dash-sidebar-bg)",
          borderColor: "var(--dash-border)",
        }}
      >
        {sidebarItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all min-w-0"
              style={{
                color: isActive ? "var(--dash-accent)" : "var(--dash-text-muted)",
              }}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-mono font-medium truncate max-w-full">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
