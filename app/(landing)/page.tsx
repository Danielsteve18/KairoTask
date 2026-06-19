"use client";

import { RadialOrbitalTimeline, TimelineItem } from "@/components/custom/RadialOrbitalTimeline";
import { Kanban, Timer, Users, Activity, Bell, Terminal, ChevronRight, Github } from "lucide-react";
import Link from "next/link";
import { Notepad3D } from "@/components/custom/Notepad3D";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { BentoFeatures } from "@/components/custom/BentoFeatures";
import { TechStack } from "@/components/custom/TechStack";
import { TeamSection } from "@/components/custom/TeamSection";
import { motion } from "framer-motion";
import { SnakeGridBackground } from "@/components/custom/SnakeGridBackground";


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
        {/* Dynamic Snake Grid Background (Self-playing Retro Snake & Tetris blocks) */}
        <div className="absolute inset-0 opacity-[0.4] dark:opacity-[0.7] pointer-events-none">
          <SnakeGridBackground />
        </div>
        {/* Fade bottom for section transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

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
      <section id="ecosystem" className="py-24 md:py-36 bg-secondary/20 border-y border-border">
        <div className="container mx-auto px-6 md:px-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground mb-4">
              El Ecosistema KairoTask
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Navega por el ecosistema orbital. Cada nodo conecta una herramienta diseñada para eliminar el caos y mantener a tu equipo en el flow.
            </p>
          </motion.div>
          
          <div className="w-full max-w-5xl h-[70vh] rounded-2xl overflow-hidden border border-border bg-card/50 shadow-sm relative">
            <RadialOrbitalTimeline timelineData={kairoTimelineData} />
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <div id="features">
        <BentoFeatures />
      </div>

      {/* Tech Stack Marquee */}
      <TechStack />

      {/* Team Section */}
      <TeamSection />

      {/* Footer */}
      <footer className="py-16 md:py-24 border-t border-border bg-card relative z-10 text-muted-foreground">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
            <div className="md:col-span-2">
              <div className="font-black text-2xl tracking-tighter text-foreground mb-4">KairoTask</div>
              <p className="max-w-sm mb-6 leading-relaxed">
                Gestión ágil para equipos modernos. Domina tu tiempo, mide tu energía y mantén a tu equipo sincronizado en modo zen.
              </p>
              <div className="flex gap-4">
                <a href="https://github.com/Danielsteve18/KairoTask" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-border bg-background flex items-center justify-center hover:bg-secondary hover:text-foreground transition-colors">
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-foreground mb-4">Producto</h4>
              <ul className="space-y-3">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Características</Link></li>
                <li><Link href="#ecosystem" className="hover:text-foreground transition-colors">Ecosistema</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Ingresar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Proyecto</h4>
              <ul className="space-y-3">
                <li><a href="https://www.unipacifico.edu.co/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Universidad Del Pacífico</a></li>
                <li><a href="https://github.com/Danielsteve18/KairoTask/blob/main/README.md" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Documentación</a></li>
                <li><a href="https://github.com/Danielsteve18/KairoTask" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Código Fuente</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Términos de Uso</Link></li>
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-foreground">KairoTask</span>
              <span>© {new Date().getFullYear()}</span>
            </div>
            <p>
              Creado con 💻 y ☕ por el equipo UDP.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
