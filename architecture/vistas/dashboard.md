# Vista: Dashboard (Listado de Proyectos)

## Descripción General
Es la primera vista privada (requiere autenticación) que el usuario ve al iniciar sesión. Sirve como un centro de control (Hub) para gestionar y acceder a todos sus espacios de trabajo (proyectos).

## Elementos UI / Componentes Principales
1. **Barra de Navegación (Navbar Superior):**
   * Logo de KairoTask.
   * Icono de Notificaciones (Campana) con contador rojo de alertas no leídas.
   * Avatar del usuario (Abre un menú desplegable con opciones de perfil y "Cerrar Sesión").
2. **Cabecera del Dashboard:**
   * Saludo personalizado ("Hola, Daniel").
   * Botón principal "Nuevo Proyecto" (Abre un Modal para crear uno).
3. **Cuadrícula de Proyectos (Grid):**
   * Tarjetas (Cards) para cada proyecto al que el usuario pertenece.
   * Cada tarjeta muestra: Título del proyecto, descripción breve, rol del usuario (Ej: Admin, Miembro), y avatares superpuestos de los compañeros del equipo.
   * Pestañas para filtrar: "Activos" y "Archivados".

## Interacciones y UX
* Al hacer clic en un proyecto, el sistema navega a la vista del Tablero Kanban.
* El Modal de "Nuevo Proyecto" debe permitir invitar personas ingresando sus correos desde el mismo momento de la creación.
* Animación al pasar el mouse (hover) sobre las tarjetas de proyecto para indicar que son clickeables.

## Rutas Asociadas
* `/dashboard` o `/projects`
