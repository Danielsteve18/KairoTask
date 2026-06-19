# 🎨 NextUI y Base UI: Biblioteca de Componentes

Para el sistema de componentes e interfaz de usuario de **KairoTask**, adoptamos una combinación premium de **NextUI** y **Base UI** (de MUI). Esto nos dota de componentes hermosos, accesibles, de alto rendimiento y altamente interactivos desde el primer día.

---

## 🛠️ Instalación y Dependencias

Para instalar e integrar el sistema UI en el proyecto de Next.js utilizando `pnpm`, ejecuta:

```bash
pnpm add @nextui-org/react framer-motion
```

### ⚠️ Nota Técnica sobre Framer Motion:
Aunque **GSAP** es nuestro motor exclusivo para animaciones complejas de rendimiento extremo (como el drag-and-drop del tablero Kanban y transiciones generales de página), **NextUI** requiere internamente la librería `framer-motion` como dependencia obligatoria para sus componentes dinámicos nativos (tales como la apertura de modales, popovers, tooltips y menús desplegables).

---

## 🚀 Configuración en Next.js (App Router)

Para que los componentes de NextUI se rendericen y tengan estilos cohesivos, es necesario configurar el proveedor en la raíz y habilitar el plugin en Tailwind.

### 1. Crear el Proveedor Global
Crea el archivo `src/app/providers.tsx` con el siguiente contenido:

```tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      {children}
    </NextUIProvider>
  );
}
```

### 2. Configurar el Proveedor en `layout.tsx`
Envuelve la aplicación dentro de `src/app/layout.tsx`:

```tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### 3. Configurar Tailwind CSS (`tailwind.config.ts`)
Añade el plugin de NextUI para que inyecte las variables de tema y los estilos del sistema en el bundle de CSS:

```typescript
import { nextui } from "@nextui-org/react";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config;
```

---

## 📏 Estándares de Uso
*   **NextUI** se utiliza para elementos visuales estándar interactivos (Botones, Modales de edición de tareas, Tablas de listado de proyectos y avatares de los desarrolladores).
*   **Base UI** se reserva para componentes que requieran comportamientos y lógica complejos sin estilos prefijados, facilitando el diseño a medida utilizando clases puras de CSS/Tailwind.
