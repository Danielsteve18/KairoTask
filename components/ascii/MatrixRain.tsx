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

    const fit = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      if (w !== canvas.width || h !== canvas.height) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const init = () => {
      fit();
      if (canvas.width === 0) return;

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

    const observer = new ResizeObserver(() => {
      fit();
      const fontSize = 14;
      const cols = Math.floor(canvas.width / (fontSize * 0.8));
      const prevLen = drops.length;
      if (cols !== prevLen) {
        if (cols > prevLen) {
          for (let i = prevLen; i < cols; i++) {
            drops.push(
              Math.floor(Math.random() * -(canvas.height / fontSize)),
            );
            charValues.push(Math.floor(Math.random() * CHARS.length));
          }
        } else {
          drops.length = cols;
          charValues.length = cols;
        }
      }
    });
    observer.observe(canvas.parentElement!);

    const fontSize = 14;

    const draw = () => {
      ctx.fillStyle = "rgba(3, 7, 18, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const x = i * (fontSize * 0.8);
        const y = drops[i] * fontSize;

        charValues[i] = (charValues[i] + 1) % CHARS.length;
        const char = CHARS[charValues[i]];

        ctx.font = `bold ${fontSize}px "Geist Mono", monospace`;
        ctx.fillStyle = "#22c55e";
        ctx.shadowColor = "#22c55e";
        ctx.shadowBlur = 8;
        ctx.fillText(char, x, y);
        ctx.shadowBlur = 0;

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
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-full ${className}`}
    />
  );
}
