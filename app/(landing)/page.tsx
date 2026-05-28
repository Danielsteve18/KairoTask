"use client";
import { ScrollExpandMedia } from "@/components/custom/ScrollExpandMedia";
import { RadialOrbitalTimeline, TimelineItem } from "@/components/custom/RadialOrbitalTimeline";
import { Kanban, Timer, Users, Activity, Bell, Terminal } from "lucide-react";

const kairoTimelineData: TimelineItem[] = [
  {
    id: 1,
    title: "Gestión Ágil",
    date: "Core",
    content: "Organiza tus proyectos con tableros Kanban, Sprints y metodologías ágiles diseñadas para equipos.",
    category: "Workflow",
    icon: Kanban,
    relatedIds: [2, 3],
    status: "completed",
    energy: 90,
  },
  {
    id: 2,
    title: "Time Tracking",
    date: "Productivity",
    content: "Domina tu tiempo con el método Pomodoro integrado y visualiza exactamente dónde inviertes tu energía cada día.",
    category: "Productivity",
    icon: Timer,
    relatedIds: [1, 4],
    status: "in-progress",
    energy: 75,
  },
  {
    id: 3,
    title: "Colaboración Real",
    date: "Network",
    content: "Sincronización instantánea gracias a Supabase. Edita tareas en equipo sin recargar la página y colabora en vivo.",
    category: "Team",
    icon: Users,
    relatedIds: [1, 5],
    status: "completed",
    energy: 85,
  },
  {
    id: 4,
    title: "Métricas y Energía",
    date: "Analytics",
    content: "No solo controlamos el tiempo, medimos tu nivel de energía y concentración para prevenir el burnout y mejorar tu rendimiento.",
    category: "Health",
    icon: Activity,
    relatedIds: [2, 6],
    status: "pending",
    energy: 60,
  },
  {
    id: 5,
    title: "Notificaciones",
    date: "System",
    content: "Alertas al instante sobre cambios críticos en el proyecto. Mantén a tu equipo siempre en sintonía mediante BillionMail.",
    category: "Comms",
    icon: Bell,
    relatedIds: [3],
    status: "in-progress",
    energy: 40,
  },
  {
    id: 6,
    title: "Modo Zen & ASCII",
    date: "UX",
    content: "Interfaz dev-centric limpia, con animaciones 3D y arte ASCII para cuando necesitas máxima concentración sin distracciones.",
    category: "Design",
    icon: Terminal,
    relatedIds: [4, 1],
    status: "completed",
    energy: 95,
  }
];

export default function Home() {
  return (
    <div className="bg-zinc-950 font-sans text-white min-h-screen">
      <ScrollExpandMedia
        mediaType="quasar"
        title="Kairo Task"
      >
        <div className="w-full flex flex-col items-center">
          <div className="text-center mb-6 max-w-2xl mx-auto space-y-4 pt-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white drop-shadow-md">
              Ecosistema KairoTask
            </h2>
            <p className="text-lg text-white/70">
              Explora las herramientas diseñadas para elevar tu productividad. Navega por nuestro ecosistema orbital y haz clic en los nodos para descubrir más.
            </p>
          </div>
          
          <div className="w-full h-[65vh] rounded-3xl overflow-hidden border border-white/10 bg-black/50 backdrop-blur-sm shadow-2xl relative mb-4">
            <RadialOrbitalTimeline timelineData={kairoTimelineData} />
          </div>
        </div>
      </ScrollExpandMedia>
    </div>
  );
}
