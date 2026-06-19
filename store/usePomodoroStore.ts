import { create } from "zustand";

export type PomodoroPhase = "focus" | "break" | "long_break";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;
const CYCLES_BEFORE_LONG_BREAK = 4;

interface PomodoroState {
  phase: PomodoroPhase;
  timeLeft: number;
  isRunning: boolean;
  cycleCount: number;
  totalFocusToday: number;

  start: () => void;
  pause: () => void;
  reset: () => void;
  skipBreak: () => void;
  tick: () => void;
  setTotalFocusToday: (minutes: number) => void;
}

function getPhaseDuration(phase: PomodoroPhase): number {
  switch (phase) {
    case "focus": return FOCUS_TIME;
    case "break": return BREAK_TIME;
    case "long_break": return LONG_BREAK_TIME;
  }
}

function getNextPhase(cycleCount: number): PomodoroPhase {
  if (cycleCount > 0 && cycleCount % CYCLES_BEFORE_LONG_BREAK === 0) {
    return "long_break";
  }
  return "break";
}

export const usePomodoroStore = create<PomodoroState>()((set, get) => ({
  phase: "focus",
  timeLeft: FOCUS_TIME,
  isRunning: false,
  cycleCount: 0,
  totalFocusToday: 0,

  start: () => {
    set({ isRunning: true });
  },

  pause: () => {
    set({ isRunning: false });
  },

  reset: () => {
    set({
      phase: "focus",
      timeLeft: FOCUS_TIME,
      isRunning: false,
      cycleCount: 0,
    });
  },

  skipBreak: () => {
    const { cycleCount } = get();
    set({
      phase: "focus",
      timeLeft: FOCUS_TIME,
      isRunning: false,
      cycleCount,
    });
  },

  tick: () => {
    const { timeLeft, phase, cycleCount } = get();
    if (timeLeft <= 1) {
      if (phase === "focus") {
        const newCycleCount = cycleCount + 1;
        const nextPhase = getNextPhase(newCycleCount);
        set({
          phase: nextPhase,
          timeLeft: getPhaseDuration(nextPhase),
          isRunning: false,
          cycleCount: newCycleCount,
        });
      } else {
        set({
          phase: "focus",
          timeLeft: FOCUS_TIME,
          isRunning: false,
        });
      }
      return;
    }
    set({ timeLeft: timeLeft - 1 });
  },

  setTotalFocusToday: (minutes) => {
    set({ totalFocusToday: minutes });
  },
}));
