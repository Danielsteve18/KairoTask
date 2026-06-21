"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Download, Upload, Loader2, Check, AlertCircle,
  FileJson, FileText, Terminal, FileSpreadsheet,
} from "lucide-react";
import { useTasks } from "@/hooks/useTasks";

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
}

export function ExportImportModal({ isOpen, onClose, projectId, projectName }: ExportImportModalProps) {
  const { tasks } = useTasks(projectId);
  const [exporting, setExporting] = useState<string | null>(null);
  const [exportDone, setExportDone] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ success: number; errors: string[] } | null>(null);

  const handleExportJSON = async () => {
    setExporting("json");
    await new Promise((r) => setTimeout(r, 300));

    const data = tasks.map((t) => ({
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      tags: t.tags,
      due_date: t.due_date,
      assignee_id: t.assignee_id,
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    downloadBlob(blob, `${projectName.replace(/\s+/g, "-")}-tasks.json`);

    setExporting(null);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const handleExportCSV = async () => {
    setExporting("csv");
    await new Promise((r) => setTimeout(r, 300));

    const headers = ["title", "description", "status", "priority", "tags", "due_date", "assignee_id"];
    const rows = tasks.map((t) => [
      escapeCSV(t.title),
      escapeCSV(t.description ?? ""),
      t.status,
      t.priority,
      escapeCSV(t.tags.join("; ")),
      t.due_date ?? "",
      t.assignee_id ?? "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, `${projectName.replace(/\s+/g, "-")}-tasks.csv`);

    setExporting(null);
    setExportDone(true);
    setTimeout(() => setExportDone(false), 2000);
  };

  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const errors: string[] = [];
      let success = 0;

      for (const item of data) {
        if (!item.title) {
          errors.push("Item sin título");
          continue;
        }
        success++;
      }

      setImportResult({ success, errors });
    } catch (err) {
      setImportResult({ success: 0, errors: [err instanceof Error ? err.message : "Error al parsear JSON"] });
    } finally {
      setImporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(2,6,10,0.75)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div
              className="pointer-events-auto w-full max-w-md rounded-2xl border overflow-hidden"
              style={{
                background: "var(--dash-surface)",
                borderColor: "var(--dash-border)",
                boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: "var(--dash-border)" }}
              >
                <div className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4" style={{ color: "#22C55E" }} />
                  <span className="text-sm font-mono font-semibold" style={{ color: "var(--dash-text)" }}>
                    export_import<span className="text-[#22C55E]">.sh</span>
                  </span>
                </div>
                <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-6">
                {/* Export */}
                <div>
                  <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
                    <Download className="w-4 h-4" /> Exportar tareas
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleExportJSON}
                      disabled={!!exporting}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:bg-white/5 disabled:opacity-50"
                      style={{ borderColor: "var(--dash-border)" }}
                    >
                      {exporting === "json" ? (
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#22C55E" }} />
                      ) : exportDone ? (
                        <Check className="w-6 h-6" style={{ color: "#22C55E" }} />
                      ) : (
                        <FileJson className="w-6 h-6" style={{ color: "#F59E0B" }} />
                      )}
                      <span className="text-[11px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                        JSON
                      </span>
                    </button>
                    <button
                      onClick={handleExportCSV}
                      disabled={!!exporting}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:bg-white/5 disabled:opacity-50"
                      style={{ borderColor: "var(--dash-border)" }}
                    >
                      {exporting === "csv" ? (
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#22C55E" }} />
                      ) : exportDone ? (
                        <Check className="w-6 h-6" style={{ color: "#22C55E" }} />
                      ) : (
                        <FileText className="w-6 h-6" style={{ color: "#A855F7" }} />
                      )}
                      <span className="text-[11px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                        CSV
                      </span>
                    </button>
                  </div>
                </div>

                {/* Import */}
                <div className="border-t" style={{ borderColor: "var(--dash-border)" }}>
                  <div className="pt-4">
                    <p className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
                      <Upload className="w-4 h-4" /> Importar tareas (JSON)
                    </p>
                    <label
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-dashed cursor-pointer transition-all hover:bg-white/5"
                      style={{ borderColor: "var(--dash-border)" }}
                    >
                      {importing ? (
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#22C55E" }} />
                      ) : (
                        <Upload className="w-6 h-6" style={{ color: "var(--dash-text-muted)" }} />
                      )}
                      <span className="text-[11px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                        {importing ? "Importando…" : "Seleccionar archivo JSON"}
                      </span>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportJSON}
                        className="hidden"
                        disabled={importing}
                      />
                    </label>

                    {importResult && (
                      <div className="mt-3 p-3 rounded-lg border" style={{ background: "var(--dash-bg)", borderColor: importResult.errors.length > 0 ? "#EF444430" : "#22C55E30" }}>
                        <p className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: importResult.errors.length > 0 ? "#EF4444" : "#22C55E" }}>
                          {importResult.errors.length > 0 ? <AlertCircle className="w-3 h-3" /> : <Check className="w-3 h-3" />}
                          {importResult.success} tareas válidas
                        </p>
                        {importResult.errors.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {importResult.errors.slice(0, 5).map((err, i) => (
                              <p key={i} className="text-[10px] font-mono" style={{ color: "#EF4444" }}>
                                • {err}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Info */}
                <p className="text-[10px] font-mono text-center" style={{ color: "var(--dash-text-muted)" }}>
                  {tasks.length} tareas en &ldquo;{projectName}&rdquo;
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function escapeCSV(str: string): string {
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}
