# 🌀 GSAP y simpleParallax.js: Animaciones e Interactividad Premium

Para garantizar una experiencia de usuario sobresaliente y un diseño que asombre a primera vista (*Wow Effect*), **KairoTask** utiliza **GSAP** para la interactividad avanzada y microinteracciones dinámicas, junto con **simpleParallax.js** para efectos de paralaje y profundidad en la Landing Page.

---

## 🛠️ Instalación y Dependencias

Para instalar ambas librerías en el entorno Next.js utilizando `pnpm`, ejecuta el siguiente comando:

```bash
pnpm add gsap @gsap/react simple-parallax-js
```

### 🧠 ¿Por qué `@gsap/react`?
En React/Next.js, el manejo del ciclo de vida y los efectos puede provocar fugas de memoria (*memory leaks*) si las animaciones no se limpian adecuadamente al desmontar componentes. `@gsap/react` proporciona el hook oficial `useGSAP()`, que simplifica la creación de animaciones dentro del DOM virtual y maneja automáticamente la recolección de basura (*garbage collection*) y la limpieza de timelines.

---

## 🚀 1. Implementación de Animaciones con GSAP en Next.js

Para animar elementos del core (como el arrastre del tablero Kanban, transiciones suaves y microinteracciones de tarjetas), envuelve tu lógica en el hook `useGSAP`.

### Ejemplo de Componente Animado (`src/components/project/TaskCard.tsx`):
```tsx
"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export function TaskCard({ title, description }: { title: string; description: string }) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Hook especializado de GSAP para React
  useGSAP(() => {
    // Animación de entrada de la tarjeta
    gsap.from(cardRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: "power2.out",
    });
  }, { scope: cardRef }); // Scope limita los selectores internos para mayor rendimiento

  const handleHover = () => {
    // Microinteracción al pasar el mouse
    gsap.to(cardRef.current, {
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.15)",
      duration: 0.3,
      ease: "power1.out",
    });
  };

  const handleHoverExit = () => {
    gsap.to(cardRef.current, {
      scale: 1,
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.05)",
      duration: 0.3,
      ease: "power1.inOut",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverExit}
      className="p-4 border rounded-xl bg-background cursor-pointer"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
```

---

## 🚀 2. Efecto de Profundidad con simpleParallax.js

`simpleParallax.js` es una librería extremadamente ligera y de alto rendimiento que añade parallax a imágenes y contenedores utilizando matrices CSS de transformación en lugar de pesados listeners de scroll en JS.

### Ejemplo de Imagen de Landing Page con Paralaje:
```tsx
"use client";

import { useEffect, useRef } from "react";
import simpleParallax from "simple-parallax-js";

export function HeroImage() {
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let instance: any = null;
    if (imageRef.current) {
      // Inicializar el efecto de profundidad
      instance = new simpleParallax(imageRef.current, {
        scale: 1.3,
        delay: 0.6,
        orientation: "up",
        transition: "cubic-bezier(0,0,0,1)",
      });
    }

    // Limpieza al desmontar el componente
    return () => {
      if (instance) {
        instance.destroy();
      }
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl w-full max-w-4xl">
      <img
        ref={imageRef}
        src="/images/landing-3d-mockup.png"
        alt="KairoTask Dashboard Mockup"
        className="w-full object-cover"
      />
    </div>
  );
}
```

---

> [!IMPORTANT]
> **Rendimiento UI/UX:** Las animaciones visuales intensivas deben limitarse exclusivamente a vistas estáticas e introductorias (Landing Page, página 404, Acerca del Proyecto). Mantén el dashboard de tareas libre de animaciones de scroll persistentes para conservar al máximo el rendimiento computacional de la máquina del usuario.
