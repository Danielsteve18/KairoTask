# 🌐 Next.js: Core Framework

**Next.js** (desarrollado por Vercel) es el framework principal de **KairoTask**. Maneja el enrutamiento de la aplicación, el renderizado del lado del servidor (SSR), la generación de páginas estáticas (SSG), las Server Actions para el backend y la optimización del SEO e imágenes.

---

## 🛠️ Inicialización del Proyecto

Para KairoTask, el core de Next.js se configuró con la arquitectura más moderna mediante el CLI oficial de Vercel utilizando `pnpm`:

```bash
pnpm create next-app@latest kairo-task --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

### Argumentos de configuración elegidos:
*   `--typescript`: Tipado estricto en toda la aplicación.
*   `--tailwind`: Integración nativa de TailwindCSS para diseño responsivo ágil.
*   `--eslint`: Reglas estandarizadas de análisis estático de código.
*   `--app`: Uso de la arquitectura moderna de **App Router** (sistema de carpetas basado en rutas).
*   `--src-dir`: Todo el código de negocio reside ordenadamente bajo `/src`.
*   `--import-alias "@/*"`: Alias de importación simplificados apuntando al directorio raíz de origen.

---

## 📂 Arquitectura de Rutas (App Router)

Bajo el App Router de Next.js, cada carpeta dentro de `src/app` representa un segmento de ruta URL:

*   `src/app/page.tsx` ➡️ Ruta principal `/` (Landing Page).
*   `src/app/layout.tsx` ➡️ Envoltura principal de HTML, metadatos globales, fuentes y proveedores de temas.
*   `src/app/(auth)/` ➡️ Grupo de rutas protegidas para autenticación (login, registro).
*   `src/app/dashboard/` ➡️ Panel administrativo de la aplicación para interactuar con proyectos y tareas.

---

## 🚀 Servidor de Desarrollo y Compilación

Para operar el framework en tu entorno local, utiliza los siguientes comandos estándar de `pnpm`:

### Iniciar servidor local:
Levanta un servidor rápido de desarrollo con recarga en caliente (*Fast Refresh*):
```bash
pnpm dev
```
*(Por defecto estará disponible en [http://localhost:3000](http://localhost:3000)).*

### Compilar para producción:
Genera un bundle optimizado de producción reduciendo al mínimo el tamaño de los scripts de cliente:
```bash
pnpm build
```

### Arrancar la versión compilada:
Inicia el servidor Node.js sirviendo la compilación optimizada generada en el paso anterior:
```bash
pnpm start
```

---

> [!TIP]
> **React Server Components (RSC):** Por defecto, todos los archivos dentro de `src/app/` se renderizan en el servidor. Si necesitas interactuar con eventos del cliente (como estados de Zustand, clicks de ratón o hooks de React), recuerda añadir la directiva `"use client";` al inicio del archivo.
