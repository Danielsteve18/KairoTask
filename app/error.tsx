"use client";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#020617" }}>
      <div className="max-w-md text-center space-y-4 p-8">
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center" style={{ background: "rgba(239,68,68,0.1)" }}>
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-xl font-bold" style={{ color: "#F8FAFC" }}>Algo salió mal</h1>
        <p className="text-sm" style={{ color: "#94A3B8" }}>
          Ocurrió un error inesperado. Ya lo registramos y lo revisaremos pronto.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: "#22C55E", color: "#020617" }}
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
