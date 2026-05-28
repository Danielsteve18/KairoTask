# Vista: Tablero Kanban (Gestión de Tareas)

## Descripción General
La vista principal y más importante de KairoTask. Es donde ocurre la gestión ágil. Muestra un tablero Kanban dividido en columnas representando los estados del flujo de trabajo de un proyecto específico.

## Elementos UI / Componentes Principales
1. **Cabecera del Proyecto:**
   * Título del proyecto.
   * Lista de avatares del equipo (Con un botón "+" para invitar a más miembros).
   * Botón "Configuración del Proyecto" (Solo visible para administradores).
2. **Columnas del Kanban:**
   * Típicamente: `Por Hacer` (To Do), `En Progreso` (In Progress), `Revisión` (Review), `Completado` (Done).
3. **Tarjetas de Tareas (Task Cards):**
   * Ubicadas dentro de las columnas.
   * Muestran: Título de la tarea, etiquetas de prioridad (Baja, Media, Alta), fecha límite (Due Date) y el avatar de la persona asignada.
4. **Botonera de Creación:**
   * Botón "+ Añadir Tarea" al pie de cada columna.

## Interacciones y UX (El Corazón de KairoTask)
* **Drag and Drop (Arrastrar y Soltar):** El usuario puede agarrar una tarjeta y moverla de "Por Hacer" a "En Progreso".
* **Realtime (Tiempo Real):** Cuando un usuario mueve una tarjeta, el movimiento debe reflejarse instantáneamente en las pantallas de todos sus compañeros sin recargar la página (vía Supabase Realtime).
* **Click en la Tarjeta:** Abre la "Vista de Detalles de la Tarea" (generalmente un Modal o panel lateral).

## Rutas Asociadas
* `/projects/[id]/board` (Ej: `/projects/123-abc/board`)
