"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, FolderKanban, Palette } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { createClient } from "@/lib/supabase/client";

const COLORS = [
  "#22C55E", // Green
  "#A855F7", // Purple
  "#F59E0B", // Amber
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#EC4899", // Pink
];

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState<string | null>(null);

  const { createProject } = useProjects();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Debes iniciar sesión para crear un proyecto.");

      await createProject.mutateAsync({
        name,
        description,
        color,
        owner_id: user.id,
      });

      // Limpiar y cerrar
      setName("");
      setDescription("");
      setColor(COLORS[0]);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Ocurrió un error al crear el proyecto.");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md border rounded-2xl p-6 pointer-events-auto shadow-2xl shadow-black/80"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "var(--dash-text-muted)" }}>
                    <span style={{ color: "var(--dash-accent)" }}>&gt;</span> init project
                  </p>
                  <h2 className="text-xl font-bold" style={{ color: "var(--dash-text)" }}>Nuevo Proyecto</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:opacity-80"
                  style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)", background: "var(--dash-bg)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg px-4 py-2.5 text-sm text-red-400 bg-red-400/10 border border-red-400/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                    <FolderKanban className="w-3.5 h-3.5" /> Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. KairoTask Core"
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all duration-200"
                    style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                    onFocus={e => (e.target.style.borderColor = color)}
                    onBlur={e => (e.target.style.borderColor = "var(--dash-border)")}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                    Descripción
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve descripción del proyecto..."
                    rows={3}
                    className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all duration-200 resize-none"
                    style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                    onFocus={e => (e.target.style.borderColor = color)}
                    onBlur={e => (e.target.style.borderColor = "var(--dash-border)")}
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                    <Palette className="w-3.5 h-3.5" /> Color de acento
                  </label>
                  <div className="flex items-center gap-3">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColor(c)}
                        className="w-6 h-6 rounded-full transition-transform"
                        style={{
                          background: c,
                          transform: color === c ? "scale(1.25)" : "scale(1)",
                          boxShadow: color === c ? `0 0 12px ${c}80` : "none"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={createProject.isPending}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold active:scale-[0.98] transition-all duration-200 disabled:opacity-70 mt-2"
                  style={{ background: color, color: "#020617" }}
                >
                  {createProject.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Creando...</>
                  ) : (
                    "Crear proyecto"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
