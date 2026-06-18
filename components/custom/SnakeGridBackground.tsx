"use client";

import React, { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
}

interface TetrisShape {
  cells: Point[];
  colorDark: string;
  colorLight: string;
  borderDark: string;
  borderLight: string;
}

export const SnakeGridBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    const cellSize = 32;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        width = parent.clientWidth;
        height = parent.clientHeight;
      } else {
        width = window.innerWidth;
        height = window.innerHeight;
      }
      canvas.width = width;
      canvas.height = height;
    };
    resize();
    window.addEventListener("resize", resize);

    let cols = Math.ceil(width / cellSize);
    let rows = Math.ceil(height / cellSize);
    let tetrisShapes: TetrisShape[] = [];

    const initTetrisShapes = () => {
      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      tetrisShapes = [];

      if (cols < 5 || rows < 5) return;

      // Define 5 standard Tetris tetromino shapes at scattered, nice background coordinates
      // 1. T-Shape (Purple) - Left top area
      const tCol = Math.floor(cols * 0.15);
      const tRow = Math.floor(rows * 0.25);
      tetrisShapes.push({
        cells: [
          { x: tCol, y: tRow },
          { x: tCol - 1, y: tRow },
          { x: tCol + 1, y: tRow },
          { x: tCol, y: tRow + 1 },
        ],
        colorDark: "rgba(168, 85, 247, 0.06)",   // Violet/Purple
        colorLight: "rgba(147, 51, 234, 0.07)",
        borderDark: "rgba(168, 85, 247, 0.25)",
        borderLight: "rgba(147, 51, 234, 0.22)",
      });

      // 2. L-Shape (Orange) - Right top area
      const lCol = Math.floor(cols * 0.72);
      const lRow = Math.floor(rows * 0.2);
      tetrisShapes.push({
        cells: [
          { x: lCol, y: lRow },
          { x: lCol, y: lRow + 1 },
          { x: lCol, y: lRow + 2 },
          { x: lCol + 1, y: lRow + 2 },
        ],
        colorDark: "rgba(249, 115, 22, 0.06)",    // Orange
        colorLight: "rgba(234, 88, 12, 0.07)",
        borderDark: "rgba(249, 115, 22, 0.25)",
        borderLight: "rgba(234, 88, 12, 0.22)",
      });

      // 3. Square O-Shape (Yellow) - Center bottom area
      const oCol = Math.floor(cols * 0.42);
      const oRow = Math.floor(rows * 0.65);
      tetrisShapes.push({
        cells: [
          { x: oCol, y: oRow },
          { x: oCol + 1, y: oRow },
          { x: oCol, y: oRow + 1 },
          { x: oCol + 1, y: oRow + 1 },
        ],
        colorDark: "rgba(234, 179, 8, 0.06)",     // Yellow
        colorLight: "rgba(202, 138, 4, 0.07)",
        borderDark: "rgba(234, 179, 8, 0.25)",
        borderLight: "rgba(202, 138, 4, 0.22)",
      });

      // 4. Line I-Shape (Cyan) - Right middle/bottom area
      const iCol = Math.floor(cols * 0.85);
      const iRow = Math.floor(rows * 0.55);
      tetrisShapes.push({
        cells: [
          { x: iCol, y: iRow },
          { x: iCol, y: iRow + 1 },
          { x: iCol, y: iRow + 2 },
          { x: iCol, y: iRow + 3 },
        ],
        colorDark: "rgba(6, 182, 212, 0.06)",     // Cyan
        colorLight: "rgba(8, 145, 178, 0.07)",
        borderDark: "rgba(6, 182, 212, 0.25)",
        borderLight: "rgba(8, 145, 178, 0.22)",
      });

      // 5. Z-Shape (Red) - Left bottom area
      const zCol = Math.floor(cols * 0.22);
      const zRow = Math.floor(rows * 0.7);
      tetrisShapes.push({
        cells: [
          { x: zCol, y: zRow },
          { x: zCol + 1, y: zRow },
          { x: zCol + 1, y: zRow + 1 },
          { x: zCol + 2, y: zRow + 1 },
        ],
        colorDark: "rgba(239, 68, 68, 0.06)",     // Red
        colorLight: "rgba(220, 38, 38, 0.07)",
        borderDark: "rgba(239, 68, 68, 0.25)",
        borderLight: "rgba(220, 38, 38, 0.22)",
      });
    };
    initTetrisShapes();

    const drawGrid = (isDark: boolean) => {
      // Aumentamos la opacidad en modo claro (de 0.02 a 0.15) para que sea visible
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.15)";
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let x = 0; x <= width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = 0; y <= height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const drawTetrisBlocks = (isDark: boolean) => {
      for (const shape of tetrisShapes) {
        const fillColor = isDark ? shape.colorDark : shape.colorLight;
        const strokeColor = isDark ? shape.borderDark : shape.borderLight;

        // 1. Draw solid subtle cell fills
        ctx.fillStyle = fillColor;
        for (const cell of shape.cells) {
          ctx.fillRect(
            cell.x * cellSize + 1,
            cell.y * cellSize + 1,
            cellSize - 2,
            cellSize - 2
          );
        }

        // 2. Draw the cell borders & inner details for tech/arcade style
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.2;
        
        for (const cell of shape.cells) {
          const px = cell.x * cellSize;
          const py = cell.y * cellSize;

          // Border of each cell
          ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);

          // Draw arcade block design: tiny inset corners
          ctx.fillStyle = strokeColor;
          ctx.fillRect(px + 4, py + 4, 3, 3); // top-left inset mark
        }
      }
    };

    const loop = () => {
      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Determine theme on each paint to stay perfectly reactive
      const isDark = document.documentElement.classList.contains("dark");

      drawGrid(isDark);
      drawTetrisBlocks(isDark);

      // Static background doesn't need constant RAF loop, but we keep a passive frame on window resize.
      // We can run a passive loop or just paint once on resize. 
      // To ensure correct reactivity with theme toggle buttons immediately, we can check classes.
      // Running at a very low frequency or simple RAF is perfectly fine and uses 0.0% CPU.
      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
