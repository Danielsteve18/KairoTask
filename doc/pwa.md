# 📱 Configuración e Implementación de PWA (Progressive Web App)

Para convertir **KairoTask** en una aplicación móvil/escritorio instalable de alto rendimiento, implementamos el estándar de **PWA (Progressive Web App)** en nuestra arquitectura de Next.js (App Router), manteniendo el Server-Side Rendering (SSR) y las Server Actions completamente intactas.

---

## 🚀 1. Instalación de la Dependencia

Utilizamos el plugin más moderno y optimizado para las versiones recientes de Next.js (`@ducanh2912/next-pwa`).

```bash
pnpm add @ducanh2912/next-pwa
```

---

## ⚙️ 2. Configuración en Next.js (`next.config.mjs`)

Envolvemos la configuración nativa de Next.js con el plugin de PWA. Esto autogenera el Service Worker (`sw.js`) en la carpeta `public` automáticamente al compilar en producción.

```javascript
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development", // Fundamental: Desactiva la PWA en desarrollo para que no guarde caché antiguo mientras programas
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Aquí va tu configuración previa de Next.js (si tenías alguna)
};

export default withPWA(nextConfig);
```

---

## 📄 3. Crear el Web Manifest (`public/manifest.json`)

El manifest es el archivo de identidad digital (*DNI*) de la aplicación. Le indica al navegador móvil o de escritorio que la web es instalable, qué orientación utilizar, los colores de marca y qué iconos usar en la pantalla de inicio.

Crea el archivo en `public/manifest.json`:

```json
{
  "name": "KairoTask - Gestión Ágil",
  "short_name": "KairoTask",
  "description": "Plataforma Colaborativa para Gestión de Proyectos y Tareas",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

> [!TIP]
> **Generación de Iconos:** Recuerda generar dos versiones en formato PNG del logo de KairoTask con resoluciones exactas de `192x192` y `512x512` píxeles, y guardarlos en el directorio `public/icons/`.

---

## 🛠️ 4. Metadatos en el Root Layout (`src/app/layout.tsx`)

Para que los navegadores detecten la compatibilidad e inyecten el botón nativo de **"Instalar Aplicación"** en móviles Android, iOS o navegadores de escritorio, añade el manifest y los viewports correspondientes en el layout principal.

```typescript
import type { Metadata, Viewport } from "next";

// El viewport maneja el color de la barra de estado en móviles
export const viewport: Viewport = {
  themeColor: "#000000", // Cambia esto por el color principal (primary) de la paleta de KairoTask
};

// Los metadatos enlazan el manifest
export const metadata: Metadata = {
  title: "KairoTask",
  description: "Plataforma Colaborativa para Gestión Ágil de Proyectos",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KairoTask",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
```
