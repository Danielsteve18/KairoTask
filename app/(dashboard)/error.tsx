"use client";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center p-12">
      <div className="max-w-md text-center space-y-4">
        <h2 className="text-lg font-bold" style={{ color: "var(--dash-text)" }}>Error en el panel</h2>
        <p className="text-sm" style={{ color: "var(--dash-text-muted)" }}>
          No pudimos cargar esta sección. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{ background: "#22C55E", color: "#020617" }}
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
