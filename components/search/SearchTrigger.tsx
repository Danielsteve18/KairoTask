"use client";

import { useSearchStore } from "@/store/useSearchStore";

export function SearchTrigger() {
  const open = useSearchStore((s) => s.open);

  const isMac =
    typeof navigator !== "undefined" && navigator.platform.includes("Mac");

  return (
    <button
      onClick={open}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all hover:opacity-80 mx-3"
      style={{
        borderColor: "var(--dash-border)",
        color: "var(--dash-text-muted)",
        background: "var(--dash-bg)",
      }}
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Buscar</span>
      <kbd className="hidden md:inline-flex text-[9px] px-1 py-0.5 rounded border" style={{ borderColor: "var(--dash-border)" }}>
        {isMac ? "⌘K" : "Ctrl+K"}
      </kbd>
    </button>
  );
}
