"use client";

import { useState } from "react";
import { Check, Clock, Edit2, Play } from "lucide-react";

export function Notepad3D({ externalOpen }: { externalOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(externalOpen ?? false);
  const [prevExternalOpen, setPrevExternalOpen] = useState(externalOpen);

  if (externalOpen !== prevExternalOpen) {
    setPrevExternalOpen(externalOpen);
    if (externalOpen !== undefined) {
      setIsOpen(externalOpen);
    }
  }

  return (
    <div
      className="relative group cursor-pointer w-72 h-96 flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
      style={{ perspective: "1200px" }}
      onClick={() => setIsOpen(!isOpen)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(!isOpen);
        }
      }}
      tabIndex={0}
      role="button"
      onMouseEnter={() => !isOpen && setIsOpen(true)}
      onMouseLeave={() => isOpen && setIsOpen(false)}
    >
      <div
        className="relative w-64 h-80 transition-all duration-700 ease-out"
        style={{
          transformStyle: "preserve-3d",
          transform: isOpen
            ? "rotateX(15deg) rotateY(10deg) rotateZ(-2deg) scale(1.05)"
            : "rotateX(30deg) rotateY(25deg) rotateZ(-10deg) scale(1)",
        }}
      >
        {/* Back Cover */}
        <div
          className="absolute inset-0 bg-card rounded-r-2xl rounded-l-lg shadow-2xl border border-border"
          style={{ transform: "translateZ(-20px)" }}
        >
          {/* Ring Binder Spine */}
          <div className="absolute left-0 inset-y-0 w-6 bg-muted rounded-l-lg border-r border-border"></div>
        </div>

        {/* Pages layer 3 */}
        <div
          className="absolute inset-y-1 right-1 left-3 bg-card rounded-r-xl border border-border opacity-70"
          style={{ transform: "translateZ(-15px)" }}
        ></div>
        
        {/* Pages layer 2 */}
        <div
          className="absolute inset-y-2 right-2 left-3 bg-card rounded-r-xl border border-border opacity-90"
          style={{ transform: "translateZ(-10px)" }}
        ></div>

        {/* Top Page (Content) */}
        <div
          className="absolute inset-y-3 right-3 left-4 bg-background rounded-r-xl border border-border shadow-sm flex flex-col p-5 overflow-hidden text-foreground"
          style={{ transform: "translateZ(-5px)" }}
        >
          <div className="flex items-center justify-between mb-5 pb-3 border-b-2 border-dashed border-border">
            <span className="text-muted-foreground font-semibold flex items-center gap-2 text-sm">
              <Clock size={16} /> Today
            </span>
            <Edit2 size={16} className="text-muted-foreground opacity-50" />
          </div>
          <div className="space-y-4 flex-1">
            {/* Task 1 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border bg-blue-500 border-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={14} className="text-white" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-2.5 rounded-full bg-zinc-200 w-full"></div>
                <div className="h-2.5 rounded-full bg-zinc-200 w-2/3"></div>
              </div>
            </div>
            
            {/* Task 2 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-zinc-300 shrink-0 mt-0.5 transition-colors group-hover:border-blue-400 group-hover:bg-blue-50"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2.5 rounded-full bg-zinc-100 w-5/6"></div>
                <div className="h-2.5 rounded-full bg-zinc-100 w-1/2"></div>
              </div>
            </div>

            {/* Task 3 */}
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded border border-zinc-300 shrink-0 mt-0.5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-2.5 rounded-full bg-zinc-100 w-full"></div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 mt-auto border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-400 font-medium">
            <span>KairoTask</span>
            <span className="flex items-center gap-1"><Play size={10} fill="currentColor"/> 25:00</span>
          </div>
        </div>

        {/* Front Cover */}
        <div
          className="absolute inset-0 bg-primary text-primary-foreground rounded-r-2xl rounded-l-lg shadow-xl origin-left transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] flex flex-col items-center justify-center border-l-4 border-black/20"
          style={{
            transform: isOpen ? "rotateY(-120deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cover Design */}
          <div 
            className="flex flex-col items-center justify-center w-full h-full p-6"
            style={{ backfaceVisibility: "hidden", transform: "translateZ(1px)" }}
          >
            <div className="w-16 h-16 bg-black/10 rounded-2xl flex items-center justify-center backdrop-blur-md mb-6 shadow-inner border border-white/10">
              <Clock size={32} className="text-primary-foreground drop-shadow-sm" />
            </div>
            <h3 className="font-bold text-3xl tracking-tight text-primary-foreground mb-2">
              KairoTask
            </h3>
            <p className="text-primary-foreground/70 text-sm font-medium tracking-wide uppercase">
              Master Your Time
            </p>
          </div>

          {/* Front Cover Backface (Inside of cover) */}
          <div 
            className="absolute inset-0 bg-secondary rounded-r-2xl rounded-l-lg border-r border-border flex items-center justify-center opacity-0 transition-opacity duration-300"
            style={{ 
              transform: "rotateY(180deg) translateZ(1px)",
              opacity: isOpen ? 1 : 0 // Custom backface logic to avoid flicker in some browsers
            }}
          >
            <span className="text-secondary-foreground/20 text-8xl font-black -rotate-90">K</span>
          </div>
          
        </div>

        {/* Bindings (Rings) - Moved to center depth to fix parallax misalignment */}
        <div className="absolute -left-2 inset-y-0 w-8 flex flex-col justify-evenly py-6 pointer-events-none" style={{ transform: "translateZ(-10px)" }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-1 items-center">
              <div className="w-8 h-3 bg-gradient-to-b from-zinc-300 to-zinc-500 rounded-full shadow-lg border border-zinc-400"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
