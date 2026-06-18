"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Siempre forzamos el modo oscuro por defecto por la estética dev-centric
    // Solo permitimos el modo claro si el usuario lo seleccionó explícitamente
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      // Opcionalmente guardarlo para consistencia
      if (!theme) localStorage.setItem("theme", "dark");
    }
  }, []);

  return <>{children}</>;
}
