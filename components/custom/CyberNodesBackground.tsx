"use client";

import React, { useEffect, useRef } from "react";

export const CyberNodesBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const chars = ["{", "}", "</>", "()", "[]", "0", "1", "&&", "||", "=>", "K", "T"];
    
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      char: string;
      baseAlpha: number;
    }
    
    const particles: Particle[] = [];
    const count = Math.floor((width * height) / 20000); // Ajuste responsivo

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        char: chars[Math.floor(Math.random() * chars.length)],
        baseAlpha: Math.random() * 0.5 + 0.1,
      });
    }

    let animationId: number;
    const mouse = { x: -1000, y: -1000 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Conectar nodos entre sí
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / 140) * 0.2;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // Dibujar partículas y conectar con el mouse
      for (const p of particles) {
        // Interacción con el mouse
        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

        if (distMouse < 200) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          const alpha = 1 - distMouse / 200;
          ctx.strokeStyle = `rgba(34, 197, 94, ${alpha * 0.5})`; // Verde KairoTask #22C55E
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Ligera repulsión para efecto interactivo
          p.x += dxMouse * 0.01;
          p.y += dyMouse * 0.01;
        }

        // Movimiento base
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Dibujar el caracter ASCII
        // Si el mouse está cerca, el nodo brilla en verde, si no, es gris OLED
        const isNearMouse = distMouse < 200;
        ctx.fillStyle = isNearMouse 
          ? `rgba(34, 197, 94, 0.9)` 
          : `rgba(148, 163, 184, ${p.baseAlpha})`;
        
        ctx.fillText(p.char, p.x, p.y);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-black">
      {/* Añadimos un sutil gradiente radial central para darle profundidad 3D al lienzo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.03)_0%,transparent_70%)] pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block opacity-80" />
    </div>
  );
};
