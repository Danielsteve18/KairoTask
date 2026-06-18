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
  LogOut,
  Command,
} from "lucide-react";
import { motion } from "framer-motion";

const sidebarItems = [
  { name: "Proyectos", icon: FolderKanban, href: "/projects" },
  { name: "Equipo", icon: Users, href: "/team" },
  { name: "Métricas", icon: Activity, href: "/metrics" },
  { name: "Consola", icon: TerminalSquare, href: "/console" },
  { name: "Ajustes", icon: Settings, href: "/settings" },
];

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname() || "";

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen bg-[#09090B] border-r border-white/10 flex flex-col relative z-20 shrink-0"
    >
      {/* Botón de colapsar */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 w-6 h-6 rounded-full bg-black border border-white/10 text-white flex items-center justify-center hover:bg-white/10 transition-colors z-30"
        aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Header del Sidebar */}
      <div className="h-16 flex items-center px-4 border-b border-white/10 overflow-hidden shrink-0">
        <Link href="/projects" className="flex items-center gap-3 w-full">
          <div className="w-8 h-8 rounded-lg bg-[#22C55E]/10 flex items-center justify-center text-[#22C55E] shrink-0 border border-[#22C55E]/20">
            <Command className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-sm tracking-widest text-[#F8FAFC] uppercase truncate"
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
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative
                ${isActive 
                  ? "bg-[#22C55E]/10 text-[#22C55E] border border-[#22C55E]/20" 
                  : "text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] border border-transparent"
                }
              `}
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
                  className="w-1.5 h-1.5 rounded-full bg-[#22C55E] ml-auto shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer del Sidebar */}
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          className={`
            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
            text-[#94A3B8] hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20
            ${isCollapsed ? "justify-center" : ""}
          `}
          title={isCollapsed ? "Cerrar sesión" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span className="text-sm font-medium">Cerrar sesión</span>}
        </button>
      </div>
    </motion.aside>
  );
}
