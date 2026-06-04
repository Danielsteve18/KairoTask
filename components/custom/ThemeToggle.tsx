"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [isDark, setIsDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
      setMounted(true);
    }, 0);
    return () => clearTimeout(timeout);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (root.classList.contains("dark")) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  if (!mounted) {
    return (
      <button className="inline-flex items-center justify-center rounded-md w-9 h-9 text-muted-foreground opacity-50">
        <div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center justify-center rounded-md w-9 h-9 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors relative"
      aria-label="Alternar tema"
    >
      <Sun className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'}`} />
      <span className="sr-only">Alternar tema</span>
    </button>
  );
}
