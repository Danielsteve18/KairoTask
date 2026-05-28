"use client";
import { useEffect } from "react";

export function AnimatedTabTitle() {
  useEffect(() => {
    const originalTitle = "KairoTask | Gestión Ágil para Equipos Modernos";
    const animatedTitle = "🚀 KairoTask ✦ Master Your Time ✦ ";
    let titleText = animatedTitle;
    let animationFrameId: number;
    let lastTime = 0;
    
    // Animate title when tab is hidden, or we can animate it constantly
    const animateTitleFunc = (time: number) => {
      if (time - lastTime > 400) { // update every 400ms
        titleText = titleText.substring(1) + titleText[0];
        document.title = titleText;
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animateTitleFunc);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is inactive, start animation
        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(animateTitleFunc);
      } else {
        // Tab is active, stop animation and restore original title
        cancelAnimationFrame(animationFrameId);
        document.title = originalTitle;
        titleText = animatedTitle; // reset
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial check
    if (document.hidden) {
      handleVisibilityChange();
    } else {
      document.title = originalTitle;
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return null;
}
