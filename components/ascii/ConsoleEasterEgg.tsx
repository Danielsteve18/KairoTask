"use client";

import { useEffect } from "react";

const BANNER = `
  ╔══════════════════════════════════════════╗
  ║     ██╗  ██╗ █████╗ ██╗██████╗  ██████╗ ║
  ║     ██║ ██╔╝██╔══██╗██║██╔══██╗██╔═══██╗║
  ║     █████╔╝ ███████║██║██████╔╝██║   ██║║
  ║     ██╔═██╗ ██╔══██║██║██╔══██╗██║   ██║║
  ║     ██║  ██╗██║  ██║██║██║  ██║╚██████╔╝║
  ║     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ ║
  ║                                          ║
  ║     Gestión ágil para equipos modernos   ║
  ║     https://kairo.app                    ║
  ╚══════════════════════════════════════════╝
`;

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      `%c${BANNER}`,
      "color: #22c55e; font-family: monospace; font-size: 10px;"
    );
    console.log(
      "%c🐍 KairoTask — Modo dev activado",
      "color: #22c55e; font-weight: bold;"
    );
  }, []);

  return null;
}
