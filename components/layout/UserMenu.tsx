"use client";

import { useState, useRef, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings, ChevronDown, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setUserName(data.user?.user_metadata?.full_name ?? null);
    });
  }, []);

  // Cerrar al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initials = userName
    ? userName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : userEmail?.[0]?.toUpperCase() ?? "U";

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors group"
        aria-label="Menú de usuario"
      >
        <div className="w-7 h-7 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center text-[#22C55E] text-xs font-bold shrink-0">
          {initials}
        </div>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#475569] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-60 rounded-xl border border-white/10 bg-[#09090B] shadow-2xl shadow-black/60 z-50 overflow-hidden"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-center justify-center text-[#22C55E] text-sm font-bold shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  {userName && (
                    <p className="text-sm font-semibold text-[#F8FAFC] truncate">
                      {userName}
                    </p>
                  )}
                  <p className="text-xs text-[#475569] truncate font-mono">
                    {userEmail ?? "Cargando..."}
                  </p>
                </div>
              </div>
              {/* Status */}
              <div className="mt-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
                <span className="text-[10px] font-mono text-[#22C55E] uppercase tracking-widest">
                  Online
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-1.5 space-y-0.5">
              <button
                onClick={() => { setOpen(false); router.push("/profile"); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-all text-left"
              >
                <User className="w-4 h-4" />
                Mi perfil
              </button>
              <button
                onClick={() => { setOpen(false); router.push("/settings"); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-white/5 hover:text-[#F8FAFC] transition-all text-left"
              >
                <Settings className="w-4 h-4" />
                Ajustes
              </button>
            </div>

            {/* Logout */}
            <div className="p-1.5 border-t border-white/10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-red-500/10 hover:text-red-400 transition-all text-left"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
