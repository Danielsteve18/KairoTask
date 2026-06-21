"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, X, Loader2, GripVertical, AlertCircle,
  Type, Hash, Calendar, CheckSquare, List,
} from "lucide-react";
import { useCustomFields } from "@/hooks/useCustomFields";
import type { CustomField } from "@/hooks/useCustomFields";

interface CustomFieldsManagerProps {
  projectId: string;
}

const FIELD_TYPE_CONFIG = {
  text: { label: "Texto", icon: Type, color: "#22C55E" },
  number: { label: "Número", icon: Hash, color: "#F59E0B" },
  date: { label: "Fecha", icon: Calendar, color: "#A855F7" },
  select: { label: "Selección", icon: List, color: "#3B82F6" },
  boolean: { label: "Sí/No", icon: CheckSquare, color: "#EC4899" },
};

export function CustomFieldsManager({ projectId }: CustomFieldsManagerProps) {
  const { fields, isLoading, createField, updateField, deleteField } = useCustomFields(projectId);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", field_type: "text" as CustomField["field_type"], options: "", required: false });
  const [formError, setFormError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setFormError("El nombre es obligatorio.");
      return;
    }
    setIsCreating(true);
    setFormError(null);
    try {
      await createField.mutateAsync({
        name: form.name.trim(),
        field_type: form.field_type,
        options: form.field_type === "select" ? form.options.split(",").map((o) => o.trim()).filter(Boolean) : [],
        required: form.required,
      });
      setForm({ name: "", field_type: "text", options: "", required: false });
      setShowCreate(false);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Error al crear campo.");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-4 h-4 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  return (
    <div className="pt-4 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
          <List className="w-4 h-4" /> Campos personalizados
        </p>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-mono transition-all hover:bg-white/5"
          style={{ borderColor: "var(--dash-border)", color: "var(--dash-accent)" }}
        >
          <Plus className="w-3 h-3" /> Añadir campo
        </button>
      </div>

      {fields.length === 0 && !showCreate && (
        <p className="text-[10px] font-mono text-center py-4" style={{ color: "var(--dash-text-muted)" }}>
          No hay campos personalizados. Añade campos para extender tus tareas.
        </p>
      )}

      <div className="space-y-2">
        {fields.map((field) => {
          const cfg = FIELD_TYPE_CONFIG[field.field_type];
          const Icon = cfg.icon;
          return (
            <div
              key={field.id}
              className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
              style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)" }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--dash-text-muted)" }} />
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${cfg.color}18` }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium" style={{ color: "var(--dash-text)" }}>{field.name}</p>
                  <p className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                    {cfg.label}{field.required ? " *" : ""}{field.options && field.options.length > 0 ? ` (${field.options.join(", ")})` : ""}
                  </p>
                </div>
              </div>
              <button
                onClick={() => deleteField.mutateAsync(field.id)}
                className="p-1 rounded hover:bg-red-400/10 transition-colors shrink-0"
                style={{ color: "#EF4444" }}
                title="Eliminar campo"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {showCreate && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleCreate}
            className="space-y-3 overflow-hidden"
          >
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Nombre *
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="ej. Departamento, URL, Tiempo estimado…"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                Tipo
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {(Object.entries(FIELD_TYPE_CONFIG) as [CustomField["field_type"], typeof FIELD_TYPE_CONFIG[keyof typeof FIELD_TYPE_CONFIG]][]).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setForm({ ...form, field_type: key, options: key !== "select" ? "" : form.options })}
                      className="flex flex-col items-center gap-1 p-2 rounded-lg border text-[9px] font-mono transition-all"
                      style={{
                        color: form.field_type === key ? cfg.color : "var(--dash-text-muted)",
                        background: form.field_type === key ? `${cfg.color}18` : "var(--dash-bg)",
                        borderColor: form.field_type === key ? `${cfg.color}50` : "var(--dash-border)",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {form.field_type === "select" && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                  Opciones <span className="normal-case">(separadas por coma)</span>
                </label>
                <input
                  value={form.options}
                  onChange={(e) => setForm({ ...form, options: e.target.value })}
                  placeholder="opción 1, opción 2, opción 3"
                  className="w-full px-3 py-2 rounded-lg border text-sm outline-none"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                />
              </div>
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.required}
                onChange={(e) => setForm({ ...form, required: e.target.checked })}
                className="rounded border"
                style={{ accentColor: "#22C55E" }}
              />
              <span className="text-[11px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                Campo obligatorio
              </span>
            </label>

            {formError && (
              <p className="text-[11px] font-mono flex items-center gap-1" style={{ color: "#EF4444" }}>
                <AlertCircle className="w-3 h-3" /> {formError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex-1 py-2 rounded-lg border text-xs font-mono"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="flex-1 py-2 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-1"
                style={{ background: "linear-gradient(135deg, #22C55E, #16A34A)", color: "#fff" }}
              >
                {isCreating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                Crear campo
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
