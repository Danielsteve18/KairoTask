# 🎨 ASCII Studio: Identidad Visual y Arte en Consola

Para dotar a **KairoTask** de una identidad única, con un estilo marcadamente técnico ("hacker" y "dev-centric"), integramos **ASCII Studio**. Esta herramienta nos permite procesar contenido visual de alta fidelidad, convirtiéndolo en secuencias dinámicas de caracteres ASCII.

---

## ⚙️ ¿Qué es ASCII Studio?

`ascii-studio` es una herramienta especializada escrita en Python/C++ que toma archivos de video (`.mp4`, `.avi`, etc.) o secuencias de imágenes y los procesa para traducirlos a representaciones de caracteres de texto estructurados en base a su luminancia.

Dado que es una utilidad pesada de procesamiento gráfico de bajo nivel, no se instala como un módulo de Node.js en las dependencias de la web. En su lugar, se clona como una herramienta de soporte local (`tools/ascii-studio`) en el espacio de trabajo del diseñador.

---

## 🛠️ Cómo Utilizar ASCII Studio para Generar Assets

### 1. Preparar un Video en Bruto:
*   Prepara un video corto (p. ej., de 3 a 5 segundos) optimizado con alto contraste y fondo oscuro. 
*   Guárdalo en la carpeta de herramientas (p. ej., `tools/ascii-studio/assets/raw-intro.mp4`).

### 2. Ejecutar la Conversión:
Utilizando el CLI de Python dentro de la carpeta clonada, procesa el video para exportar la animación como una secuencia de texto plano o frames JSON:

```bash
cd tools/ascii-studio
python main.py --input assets/raw-intro.mp4 --output assets/converted/ --width 80 --chars " .:-=+*#%@"
```

### 3. Integración en Next.js (Core Web):
*   Los frames convertidos (como un array JSON de strings en texto plano) se copian a la carpeta `/public/assets/ascii/intro-frames.json` de Next.js.
*   En el frontend, se lee este archivo JSON y se dibuja cuadro a cuadro en una etiqueta HTML `<pre class="font-mono text-xs">` utilizando un temporizador en React. Esto permite reproducir un "video" en ASCII con un consumo de CPU e impacto en el DOM extremadamente bajo.

---

## 🚀 Ejemplos de Implementación en KairoTask

### 🌟 Easter Egg 1: Logs de Bienvenida en la Consola del Navegador
Al entrar a la aplicación web, inyectamos un logo ASCII estilizado en la consola para sorprender a los desarrolladores y usuarios avanzados que abran las herramientas de desarrollo (`F12`):

```tsx
"use client";

import { useEffect } from "react";

export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      `%c
  _  __    _          _______        _    
 | |/ /   (_)        |__   __|      | |   
 | ' /__ _ _ _ __ ___   | | __ _ ___| | __
 |  // _\` | | '__/ _ \\  | |/ _\` / __| |/ /
 | . \\ (_| | | | | (_) | | | (_| \\__ \\   < 
 |_|\\_\\__,_|_|_|  \\___/  |_|\\__,_|___/_|\\_\\
      `,
      "color: #88CE02; font-weight: bold; font-family: monospace;"
    );
    console.log("%c¡Bienvenido a KairoTask! Entorno AI-Driven activado.", "color: #002E5D; font-style: italic;");
  }, []);

  return null;
}
```

### 🌟 Easter Egg 2: Pantalla de Error 404 Dinámica en ASCII
Cuando un usuario ingresa a una ruta inexistente, se renderiza una animación en bucle basada en caracteres ASCII generada previamente por `ascii-studio` (como un temporizador de arena cayendo en texto), reforzando la estética diferencial del proyecto sin sobrecargar el navegador.
