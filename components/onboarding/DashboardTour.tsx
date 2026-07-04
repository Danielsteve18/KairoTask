"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

const STEPS = [
  {
    element: '[data-tour="sidebar"]',
    popover: {
      title: "Panel de navegación",
      description:
        "Accede a tus proyectos, equipo, métricas y configuración desde aquí.",
      side: "right" as const,
      align: "center" as const,
    },
  },
  {
    element: '[data-tour="create-project"]',
    popover: {
      title: "Crear proyecto",
      description:
        "Crea tu primer proyecto para empezar a organizar tareas y colaborar con tu equipo.",
      side: "bottom" as const,
      align: "start" as const,
    },
  },
  {
    element: '[data-tour="kanban"]',
    popover: {
      title: "Tablero Kanban",
      description:
        "Arrastra y suelta tareas entre columnas para gestionar tu flujo de trabajo.",
      side: "top" as const,
      align: "center" as const,
    },
  },
  {
    element: '[data-tour="user-menu"]',
    popover: {
      title: "Tu perfil",
      description:
        "Configura tu perfil, notificaciones, temas y preferencias de cuenta.",
      side: "bottom" as const,
      align: "end" as const,
    },
  },
  {
    popover: {
      title: "¡Listo!",
      description:
        "Ya conoces lo esencial. Explora el resto por tu cuenta.",
    },
  },
];

export function DashboardTour() {
  const searchParams = useSearchParams();
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  useEffect(() => {
    const hasTourParam = searchParams.get("tour") === "true";
    const pending = localStorage.getItem("onboarding_pending") === "true";

    if (!hasTourParam && !pending) return;

    localStorage.removeItem("onboarding_pending");

    const timeout = setTimeout(() => {
      const driverInstance = driver({
        showProgress: true,
        showButtons: ["next", "previous", "close"],
        steps: STEPS as any,
        onDestroyed: () => {
          const wasClosed = localStorage.getItem("onboarding_dismissed") === "true";
          if (!wasClosed) {
            localStorage.setItem("onboarding_completed", "true");
          }
        },
        onCloseClick: () => {
          localStorage.setItem("onboarding_dismissed", "true");
          driverInstance.destroy();
        },
      });

      driverInstance.drive();
      driverRef.current = driverInstance;
    }, 800);

    return () => {
      clearTimeout(timeout);
      driverRef.current?.destroy();
    };
  }, [searchParams]);

  return null;
}
