"use client";

import { usePathname } from "next/navigation";

export function DashboardBreadcrumb() {
  const pathname = usePathname() || "";
  
  // Eliminamos barras vacías y creamos los segmentos
  const segments = pathname.split('/').filter(Boolean);
  
  // Construimos el path final. Por defecto es "workspace" si no hay segmentos.
  const currentView = segments.length > 0 ? segments.join("/") : "workspace";

  return (
    <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
      <span style={{ color: "var(--dash-accent)" }}>~/</span>
      <span>kairo</span>
      <span style={{ color: "var(--dash-accent)" }}>/</span>
      <span style={{ color: "var(--dash-text)" }}>{currentView}</span>
    </div>
  );
}
