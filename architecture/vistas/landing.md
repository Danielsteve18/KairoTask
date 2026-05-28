# Vista: Landing Page (Página de Inicio)

## Descripción General
La **Landing Page** es la carta de presentación de KairoTask. Es una vista pública (no requiere autenticación) diseñada para generar un impacto visual inmediato ("efecto wow") y convencer a los estudiantes y docentes de utilizar la plataforma.

## Elementos UI / Componentes Principales
1. **Hero Section (Cabecera Principal):**
   * Título principal y propuesta de valor ("Gestión ágil para equipos universitarios").
   * Botón de "Comenzar Gratis" (Lleva al Registro).
   * **Animación Destacada:** Integración de la secuencia generada por **ASCII Studio** para darle una identidad visual tecnológica ("hacker") y única, combinada con modelos 3D de **LumaLabs** y efectos **simpleParallax.js**.
2. **Sección de Características:**
   * Tarjetas informativas (Cards) detallando: Tablero Kanban, Colaboración en Tiempo Real, PWA, Alertas por Correo.
3. **Footer (Pie de página):**
   * Enlaces a documentación, equipo creador (Universidad del Pacífico) y botón de inicio de sesión.

## Interacciones y Animaciones (GSAP)
* Animaciones de entrada (fade-in y slide-up) a medida que el usuario hace scroll hacia abajo.
* El fondo puede tener efectos de partículas o de profundidad utilizando CSS avanzado y GSAP.

## Rutas Asociadas
* `/` (Ruta raíz pública)
