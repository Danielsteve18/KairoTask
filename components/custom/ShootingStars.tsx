"use client";
import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  length: number;
  speed: number;
  thickness: number;
  color: string;
}

export const ShootingStars = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];

    // Premium glowing colors (Indigo, Teal, Fuchsia)
    const colors = ["#6366f1", "#2dd4bf", "#e879f9", "#818cf8", "#38bdf8"];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createStar = (): Star => {
      const isTop = Math.random() > 0.5;
      // Spawn slightly off-screen to ensure smooth entrance
      const x = isTop ? Math.random() * canvas.width : -100;
      const y = isTop ? -100 : Math.random() * canvas.height;

      return {
        x,
        y,
        // Long, elegant tails
        length: Math.random() * 200 + 80,
        // Smooth, fast speed
        speed: Math.random() * 6 + 3,
        // Sharp, thin lines for a "laser/neon" aesthetic
        thickness: Math.random() * 1.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const initStars = () => {
      stars = [];
      // Create 30 stars max to keep it elegant and uncluttered
      for (let i = 0; i < 30; i++) {
        const star = createStar();
        // Randomly advance them so the screen isn't empty on load
        const advance = Math.random() * Math.max(canvas.width, canvas.height);
        star.x += advance;
        star.y += advance;
        stars.push(star);
      }
    };

    let isVisible = true;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible) {
            draw();
          }
        });
      },
      { threshold: 0 }
    );

    observer.observe(canvas);

    const draw = () => {
      if (!isVisible) return; // Halt the heavy loop when off-screen

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Angle for Top-Left to Bottom-Right (approx 45 degrees)
      const angle = Math.PI / 4;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      stars.forEach((star) => {
        const tailX = star.x - star.length * cosA;
        const tailY = star.y - star.length * sinA;

        // Create a gradient for the fading tail
        const gradient = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
        gradient.addColorStop(0, star.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.beginPath();
        ctx.lineCap = "round";
        ctx.lineWidth = star.thickness;
        ctx.strokeStyle = gradient;
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        // Add a bright core/head to the meteor
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.thickness * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.shadowBlur = 10;
        ctx.shadowColor = star.color;
        ctx.fill();
        ctx.shadowBlur = 0; // Reset shadow for next drawings

        // Move star
        star.x += star.speed * cosA;
        star.y += star.speed * sinA;

        // Reset if it goes completely off screen
        if (tailX > canvas.width || tailY > canvas.height) {
          Object.assign(star, createStar());
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
    initStars();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-80"
    />
  );
};
