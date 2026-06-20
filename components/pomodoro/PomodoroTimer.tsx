"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";
import { usePomodoroStore } from "@/store/usePomodoroStore";
import { usePomodoroSessions } from "@/hooks/usePomodoroSessions";

const PHASE_LABELS: Record<string, string> = {
  focus: "ENFOQUE",
  break: "DESCANSO",
  long_break: "DESCANSO LARGO",
};

const PHASE_COLORS: Record<string, string> = {
  focus: "#22C55E",
  break: "#3B82F6",
  long_break: "#8B5CF6",
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function PomodoroTimer() {
  const { phase, timeLeft, isRunning, start, pause, reset, skipBreak, tick, cycleCount } =
    usePomodoroStore();
  const { saveSession } = usePomodoroSessions();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (isRunning) {
      notifiedRef.current = false;
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, tick]);

  const prevPhaseRef = useRef(phase);

  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      if (prevPhaseRef.current === "focus") {
        const duration = 25;
        saveSession.mutate({
          duration_minutes: duration,
          type: "focus",
          completed: true,
        });
      }
      prevPhaseRef.current = phase;

      if (Notification.permission === "granted") {
        const isBreak = phase === "break" || phase === "long_break";
        new Notification(isBreak ? "Descanso" : "Enfoque", {
          body: isBreak ? "Tiempo de descanso. Recarga energía." : "¡Tiempo de enfoque! A trabajar.",
          icon: "/icon-192x192.png",
        });
      }
    }
  }, [phase, saveSession]);

  useEffect(() => {
    if (timeLeft === 0 && !notifiedRef.current) {
      notifiedRef.current = true;
      if (Notification.permission === "granted") {
        new Notification("¡Tiempo completado!", {
          body: "El ciclo ha terminado.",
          icon: "/icon-192x192.png",
        });
      }
    }
  }, [timeLeft]);

  const requestNotification = () => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const phaseDurations = { focus: 25 * 60, break: 5 * 60, long_break: 15 * 60 } as const;

  const progress = 1 - timeLeft / phaseDurations[phase];

  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference * (1 - progress);
  const color = PHASE_COLORS[phase];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-8"
      onClick={requestNotification}
    >
      {/* Phase label */}
      <div className="flex flex-col items-center gap-1">
        <span
          className="text-xs font-mono uppercase tracking-[0.2em]"
          style={{ color: "var(--dash-text-muted)" }}
        >
          {PHASE_LABELS[phase]}
        </span>
        <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
          Ciclo {cycleCount + 1}
        </span>
      </div>

      {/* Timer ring */}
      <div className="relative flex items-center justify-center">
        <svg width="280" height="280" className="transform -rotate-90">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="var(--dash-border)"
            strokeWidth="6"
          />
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            animate={{ strokeDashoffset }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-6xl font-black tabular-nums tracking-tight"
            style={{ color: "var(--dash-text)" }}
          >
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reset}
          className="w-12 h-12 rounded-full flex items-center justify-center border transition-all"
          style={{
            borderColor: "var(--dash-border)",
            color: "var(--dash-text-muted)",
            background: "var(--dash-surface)",
          }}
          title="Reiniciar"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={isRunning ? pause : start}
          className="w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg"
          style={{
            background: color,
            color: "#020617",
          }}
          title={isRunning ? "Pausar" : "Iniciar"}
        >
          {isRunning ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7 ml-0.5" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={skipBreak}
          className="w-12 h-12 rounded-full flex items-center justify-center border transition-all"
          style={{
            borderColor: "var(--dash-border)",
            color: "var(--dash-text-muted)",
            background: "var(--dash-surface)",
          }}
          title="Saltar descanso"
        >
          <SkipForward className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
