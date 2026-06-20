"use client";

import { useEffect, useState } from "react";

interface AsciiAnimationProps {
  frames: string[];
  fps?: number;
  className?: string;
  loop?: boolean;
  onComplete?: () => void;
}

export function AsciiAnimation({
  frames,
  fps = 12,
  className = "",
  loop = true,
  onComplete,
}: AsciiAnimationProps) {
  const [frameIdx, setFrameIdx] = useState(0);

  useEffect(() => {
    if (frames.length === 0) return;

    const id = setInterval(() => {
      setFrameIdx((prev) => {
        const next = prev + 1;
        if (next >= frames.length) {
          if (loop) return 0;
          onComplete?.();
          return prev;
        }
        return next;
      });
    }, 1000 / fps);

    return () => clearInterval(id);
  }, [frames, fps, loop, onComplete]);

  if (frames.length === 0) return null;

  return (
    <pre className={`font-mono leading-tight select-none ${className}`}>
      {frames[frameIdx]}
    </pre>
  );
}
