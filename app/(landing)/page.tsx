"use client";

import { RadialOrbitalTimeline, TimelineItem } from "@/components/custom/RadialOrbitalTimeline";
import { Kanban, Timer, Users, Activity, Bell, Terminal, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Notepad3D } from "@/components/custom/Notepad3D";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { motion } from "framer-motion";

const kairoTimelineData: TimelineItem[] = [
// ... [kept to not mess with lines, wait I only need to replace the import and the header part]
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
    <div className="bg-background text-foreground min-h-screen selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="absolute top-0 w-full flex items-center justify-between p-6 z-50">
        <div className="font-bold text-xl tracking-tighter">KairoTask</div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/login" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Iniciar sesión
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden border-b border-border">
        {/* Subtle background gradient / grid to prevent complete flatness */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <div className="container mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          
          {/* Left Column: Text & CTA */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/50 text-secondary-foreground text-sm font-medium mb-8 border border-border"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              KairoTask 2.0 ya está aquí
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.05] mb-6"
            >
              Gestión ágil para <br className="hidden md:block" />
              equipos modernos.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed font-medium"
            >
              Organiza, asigna y colabora en tiempo real sin distracciones. 
              Domina tu tiempo, mide tu energía y mantén a todo tu equipo sincronizado.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 shadow-sm"
              >
                Comenzar un proyecto
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link
                href="#ecosystem"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-secondary text-secondary-foreground font-semibold flex items-center justify-center gap-2 hover:bg-secondary/80 transition-transform active:scale-95 border border-border"
              >
                Ver ecosistema
              </Link>
            </motion.div>
          </div>

          {/* Right Column: 3D Notepad */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="flex-1 flex justify-center items-center w-full max-w-lg relative z-10"
          >
            {/* Subtle glow behind the notepad */}
            <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full pointer-events-none aspect-square" />
            
            {/* Floating animation wrapper */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Notepad3D />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section id="ecosystem" className="py-24 bg-card/20">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center">
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              El Ecosistema KairoTask
            </h2>
            <p className="text-lg text-muted-foreground">
              Explora las herramientas diseñadas para elevar tu productividad. Navega por nuestro ecosistema orbital y descubre cómo encaja todo.
            </p>
          </div>
          
          <div className="w-full max-w-5xl h-[70vh] rounded-3xl overflow-hidden border border-border bg-card/50 backdrop-blur-md shadow-sm relative">
            <RadialOrbitalTimeline timelineData={kairoTimelineData} />
          </div>
        </div>
      </section>
    </div>
  );
}
