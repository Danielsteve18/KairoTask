"use client";

import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh] p-8">
      <div className="flex flex-col items-center gap-5 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, #EF4444 15%, transparent)" }}>
          <AlertTriangle className="w-8 h-8 text-red-500" />
        </div>

        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: "var(--dash-text)" }}>
            Error al cargar el proyecto
          </h2>
          <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
            {error.message || "No se pudo cargar la información del proyecto. Intenta de nuevo."}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:scale-105"
            style={{ background: "var(--dash-accent)", color: "#020617" }}
          >
            <RefreshCw className="w-4 h-4" />
            Reintentar
          </button>
          <Link
            href="/projects"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{ background: "var(--dash-surface)", color: "var(--dash-text)", border: "1px solid var(--dash-border)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a proyectos
          </Link>
        </div>
      </div>
    </div>
  );
}
