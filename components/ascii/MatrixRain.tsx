"use client";

import { useEffect, useRef } from "react";

interface MatrixRainProps {
  className?: string;
}

const CHARS =
  "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789" +
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
  "{}[]<>/\\|!@#$%^&*()_+-=.,;:";

export function MatrixRain({ className = "" }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let drops: number[] = [];
    let charValues: number[] = [];

    const init = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;

      const fontSize = 14;
      const cols = Math.floor(canvas.width / (fontSize * 0.8));
      drops = Array.from({ length: cols }, () =>
        Math.floor(Math.random() * -(canvas.height / fontSize)),
      );
      charValues = Array.from({ length: cols }, () =>
        Math.floor(Math.random() * CHARS.length),
      );
    };

    init();
    const onResize = () => init();
    window.addEventListener("resize", onResize);

    const fontSize = 14;

    const draw = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const x = i * (fontSize * 0.8);
        const y = drops[i] * fontSize;

        // Random character change each frame for shimmering effect
        charValues[i] = (charValues[i] + 1) % CHARS.length;
        const char = CHARS[charValues[i]];

        // Bright leading character
        ctx.font = `bold ${fontSize}px "Geist Mono", monospace`;
        ctx.fillStyle = "#22c55e";
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 8;
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

        // Trail with fading brightness
        ctx.font = `${fontSize}px "Geist Mono", monospace`;
        for (let j = 1; j < 8; j++) {
          const trailY = y - j * fontSize;
          if (trailY < 0) break;
          const trailChar =
            CHARS[
              Math.floor((charValues[i] + j * 7) % CHARS.length)
            ];
          const alpha = Math.max(0, 0.35 - j * 0.04);
          ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
          ctx.fillText(trailChar, x, trailY);
        }

        // Reset or continue
        if (y > canvas.height + 100) {
          drops[i] = Math.floor(Math.random() * -(canvas.height / fontSize));
          charValues[i] = Math.floor(Math.random() * CHARS.length);
        } else {
          drops[i] += 0.5 + Math.random() * 0.5;
        }
      }

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block ${className}`}
      style={{ minHeight: "200px" }}
    />
  );
}
