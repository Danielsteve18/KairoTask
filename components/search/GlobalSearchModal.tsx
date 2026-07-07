"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FolderKanban, FileText, ArrowRight } from "lucide-react";
import { useSearchStore } from "@/store/useSearchStore";
import { useGlobalSearch, type SearchResult } from "@/hooks/useGlobalSearch";

const TYPE_CONFIG = {
  project: { icon: FolderKanban, label: "Proyecto", color: "var(--dash-accent)" },
  task: { icon: FileText, label: "Tarea", color: "#3B82F6" },
} as const;

export function GlobalSearchModal() {
  const { isOpen, query, close, setQuery, open } = useSearchStore();
  const { search, isLoading } = useGlobalSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const grouped = {
    project: results.filter((r) => r.type === "project"),
    task: results.filter((r) => r.type === "task"),
  };

  const flatResults = [
    ...grouped.project.map((r, i) => ({ ...r, _section: "project" as const, _index: i })),
    ...grouped.task.map((r, i) => ({ ...r, _section: "task" as const, _index: i })),
  ];

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setResults(search(query));
      setSelectedIndex(0);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, search]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) close(); else open();
      }
      if (e.key === "Escape" && isOpen) close();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, close, open]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const navigate = useCallback((result: SearchResult) => {
    close();
    if (result.type === "project") {
      router.push(`/projects/${result.id}`);
    } else if (result.type === "task") {
      router.push(`/projects/${result.project_id}`);
    }
  }, [close, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && flatResults[selectedIndex]) {
      e.preventDefault();
      navigate(flatResults[selectedIndex]);
    }
  };

  const sectionLabels: Record<string, { label: string; count: number }> = {
    project: { label: "Proyectos", count: grouped.project.length },
    task: { label: "Tareas", count: grouped.task.length },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]"
          onClick={close}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden"
            style={{
              background: "var(--dash-surface)",
              borderColor: "var(--dash-border)",
            }}
          >
            {/* Input */}
            <div
              className="flex items-center gap-3 px-5 border-b"
              style={{ borderColor: "var(--dash-border)" }}
            >
              <Search className="w-5 h-5 shrink-0" style={{ color: "var(--dash-text-muted)" }} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar proyectos, tareas, miembros..."
                className="flex-1 h-14 bg-transparent text-base outline-none placeholder:text-sm"
                style={{ color: "var(--dash-text)" }}
              />
              {isLoading && (
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin shrink-0"
                  style={{ borderColor: "var(--dash-accent)", borderTopColor: "transparent" }} />
              )}
              <kbd
                className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono border shrink-0"
                style={{
                  color: "var(--dash-text-muted)",
                  borderColor: "var(--dash-border)",
                  background: "var(--dash-bg)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto p-2">
              {query.trim() && flatResults.length === 0 && !isLoading && (
                <div className="flex flex-col items-center py-12 gap-2">
                  <Search className="w-8 h-8" style={{ color: "var(--dash-text-muted)" }} />
                  <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
                    Sin resultados para <strong>&quot;{query}&quot;</strong>
                  </p>
                </div>
              )}

              {!query.trim() && (
                <div className="flex flex-col items-center py-12 gap-2">
                  <kbd
                    className="px-3 py-1.5 rounded-lg text-xs font-mono border"
                    style={{
                      color: "var(--dash-text-muted)",
                      borderColor: "var(--dash-border)",
                      background: "var(--dash-bg)",
                    }}
                  >
                    {navigator.platform.includes("Mac") ? "⌘" : "Ctrl"} + K
                  </kbd>
                  <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
                    Escribe para buscar en tu workspace
                  </p>
                </div>
              )}

              {query.trim() && flatResults.length > 0 && (
                <div className="space-y-3">
                  {(["project", "task"] as const).map((section) => {
                    const items = section === "project" ? grouped.project
                      : grouped.task;
                    if (items.length === 0) return null;
                    const config = TYPE_CONFIG[section];

                    return (
                      <div key={section}>
                        <div className="flex items-center gap-2 px-3 py-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                            {sectionLabels[section].label}
                          </span>
                          <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                            {items.length}
                          </span>
                        </div>
                        {items.map((item, idx) => {
                          const globalIndex = flatResults.findIndex(
                            (r) => r._section === section && r._index === idx
                          );
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <button
                              key={`${section}-${item.id}`}
                              onClick={() => navigate(item)}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100"
                              style={{
                                background: isSelected ? "var(--dash-surface-hover)" : "transparent",
                                color: "var(--dash-text)",
                              }}
                            >
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
                                style={{
                                  background: `${config.color}15`,
                                  borderColor: `${config.color}25`,
                                  color: config.color,
                                }}
                              >
                                <config.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                  {"name" in item ? item.name : item.title}
                                </p>
                                <p className="text-xs truncate" style={{ color: "var(--dash-text-muted)" }}>
                                  {"project_name" in item && item.project_name ? `${item.project_name} · ` : ""}
                                  {config.label}
                                </p>
                              </div>
                              {isSelected && (
                                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: "var(--dash-accent)" }} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
