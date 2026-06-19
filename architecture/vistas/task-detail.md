# Vista: Detalles de la Tarea (Task Modal/Panel)

## Descripción General
No suele ser una página completa, sino un Modal (ventana emergente) o un Panel Lateral (Drawer) que se superpone al Tablero Kanban. Aquí se concentra toda la información profunda y la comunicación sobre una tarea específica.

## Elementos UI / Componentes Principales
1. **Cabecera de la Tarea:**
   * Título editable de la tarea.
   * Botón para cerrar el panel/modal.
2. **Propiedades (Metadata):**
   * **Estado:** Selector desplegable (Dropdown) para cambiarla de columna.
   * **Responsable (Assignee):** Selector para buscar y asignar a un compañero del proyecto. (Esto gatilla el envío de un correo de notificación).
   * **Prioridad:** Selector de prioridad.
   * **Fecha Límite (Due Date):** Selector de calendario (Datepicker).
3. **Descripción:**
   * Editor de texto enriquecido (Rich Text) para dar contexto a la tarea.
4. **Sección de Actividad y Comentarios:**
   * Un feed histórico que muestra "Quién hizo qué" (Ej: "Daniel movió esta tarea a Revisión").
   * Caja de texto al final para añadir un nuevo comentario.

## Interacciones y UX
* Guardado automático (Autosave) o botones explícitos de "Guardar" dependiendo de cómo se diseñe la interacción.
* Mención de usuarios: Al escribir "@" en un comentario, debería autocompletar con los miembros del equipo (Requerimiento avanzado).

## Rutas Asociadas
* Normalmente se maneja en el cliente sin cambiar la ruta profunda, o mediante *intercepting routes* en Next.js (Ej: `/projects/123/task/456`).
