"use client";

import { Loader2 } from "lucide-react";
import { useCustomFields, useCustomFieldValues } from "@/hooks/useCustomFields";

interface CustomFieldValuesEditorProps {
  taskId: string;
  projectId: string;
}

export function CustomFieldValuesEditor({ taskId, projectId }: CustomFieldValuesEditorProps) {
  const { fields, isLoading: fieldsLoading } = useCustomFields(projectId);
  const { values, isLoading: valuesLoading, setValue } = useCustomFieldValues(taskId);

  const isLoading = fieldsLoading || valuesLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center py-3">
        <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "var(--dash-text-muted)" }} />
      </div>
    );
  }

  if (fields.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="border-t" style={{ borderColor: "var(--dash-border)" }} />
      <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
        Campos personalizados
      </p>
      <div className="space-y-2">
        {fields.map((field) => {
          const val = values.find((v) => v.field_id === field.id);
          return (
            <div key={field.id} className="space-y-1">
              <label className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                {field.name}{field.required ? " *" : ""}
              </label>
              {field.field_type === "text" && (
                <input
                  type="text"
                  defaultValue={val?.value ?? ""}
                  onBlur={(e) => setValue.mutate({ fieldId: field.id, value: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                  placeholder={`Ingresa ${field.name.toLowerCase()}…`}
                />
              )}
              {field.field_type === "number" && (
                <input
                  type="number"
                  defaultValue={val?.value ?? ""}
                  onBlur={(e) => setValue.mutate({ fieldId: field.id, value: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none font-mono"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                />
              )}
              {field.field_type === "date" && (
                <input
                  type="date"
                  defaultValue={val?.value ?? ""}
                  onChange={(e) => setValue.mutate({ fieldId: field.id, value: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none font-mono"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)", colorScheme: "dark" }}
                />
              )}
              {field.field_type === "boolean" && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={val?.value === "true"}
                    onChange={(e) => setValue.mutate({ fieldId: field.id, value: e.target.checked ? "true" : "false" })}
                    className="rounded"
                    style={{ accentColor: "#22C55E" }}
                  />
                  <span className="text-[11px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                    {val?.value === "true" ? "Sí" : "No"}
                  </span>
                </label>
              )}
              {field.field_type === "select" && (
                <select
                  defaultValue={val?.value ?? ""}
                  onChange={(e) => setValue.mutate({ fieldId: field.id, value: e.target.value || null })}
                  className="w-full px-3 py-1.5 rounded-lg border text-sm outline-none font-mono"
                  style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                >
                  <option value="">Seleccionar…</option>
                  {(field.options as string[] ?? []).map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
