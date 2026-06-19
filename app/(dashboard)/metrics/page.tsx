"use client";

import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { PomodoroStats } from "@/components/pomodoro/PomodoroStats";

export default function MetricsPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto w-full">
      <div className="mb-8">
        <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
          <span style={{ color: "var(--dash-accent)" }}>$</span> kairo pomodoro --start
        </p>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
          Pomodoro
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
          Concentración profunda con la técnica Pomodoro.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex items-start justify-center pt-4">
          <PomodoroTimer />
        </div>
        <div className="lg:col-span-1">
          <PomodoroStats />
        </div>
      </div>
    </div>
  );
}
