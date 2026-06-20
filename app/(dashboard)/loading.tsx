"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center h-full min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--dash-accent)" }} />
        <p className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
          Cargando...
        </p>
      </div>
    </div>
  );
}
