"use client";

import Link from "next/link";
import { AsciiAnimation } from "@/components/ascii/AsciiAnimation";
import { skullFrames } from "@/lib/ascii/frames";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="text-center max-w-2xl">
        {/* ASCII Animation */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 overflow-hidden">
            <div className="flex items-center gap-1.5 mb-4">
              <span className="w-2 h-2 rounded-full bg-red-500/80" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/80" />
              <span className="w-2 h-2 rounded-full bg-green-500/80" />
              <span className="ml-3 text-zinc-500 text-[10px] font-mono">error: 404.ascii</span>
            </div>
            <AsciiAnimation
              frames={skullFrames}
              fps={8}
              className="text-green-400/60 text-[6px] md:text-[7px] leading-tight"
            />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-4 font-mono">
          404
        </h1>
        <p className="text-zinc-400 font-mono text-sm md:text-base mb-8">
          <span className="text-green-400">$</span> page not found — the requested resource does not exist
        </p>
        <p className="text-zinc-500 text-sm mb-8 max-w-md mx-auto leading-relaxed">
          El archivo que buscas se ha movido, eliminado, o nunca existió.
          Como este ASCII art, todo es temporal.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-mono text-sm hover:bg-green-500/20 transition-all"
        >
          <span className="animate-pulse">&gt;</span> volver al inicio
        </Link>
      </div>
    </div>
  );
}
