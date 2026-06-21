# KairoTask — Manual de Usuario

## Gestión de proyectos ágiles con enfoque dev-centric

| Característica | Detalle |
|---|---|
| Versión | 1.0.0 |
| Fecha | 20 de junio de 2026 |
| Contenido visual | Capturas integradas por sección |
| Descripción | Guía operativa para gestionar proyectos, tareas, sprints, equipo, pomodoro y configuración del sistema KairoTask. |

---

## Índice de contenidos

1. [Dashboard (Panel de Control Principal)](#1-dashboard-panel-de-control-principal)
2. [Proyectos (Listado)](#2-proyectos-listado)
3. [Detalle del Proyecto](#3-detalle-del-proyecto)
4. [Tablero Kanban](#4-tablero-kanban)
5. [Gestión de Tareas](#5-gestión-de-tareas)
6. [Sprints](#6-sprints)
7. [Vista de Calendario](#7-vista-de-calendario)
8. [Diagrama de Gantt](#8-diagrama-de-gantt)
9. [Panel de Analíticas](#9-panel-de-analíticas)
10. [Equipo](#10-equipo)
11. [Pomodoro](#11-pomodoro)
12. [Búsqueda Global](#12-búsqueda-global)
13. [Consola / Terminal](#13-consola--terminal)
14. [Ajustes (Configuración)](#14-ajustes-configuración)
15. [Perfil de Usuario](#15-perfil-de-usuario)
16. [Exportar / Importar](#16-exportar--importar)
17. [Notificaciones en Tiempo Real](#17-notificaciones-en-tiempo-real)
18. [Actividad Global](#18-actividad-global)

---

## 1. Dashboard (Panel de Control Principal)

**[Figura 1: Vista general del Dashboard con métricas principales]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral izquierdo > Dashboard |
| Icono | Grid (cuadrícula) |

El Dashboard es la primera pantalla que verás al iniciar sesión. Te ofrece un resumen en tiempo real del estado de tu espacio de trabajo, con métricas clave, accesos directos y la actividad más reciente.

### 1.1. Tarjetas de Métricas Rápidas (Parte Superior)

Cuatro tarjetas que te dan una visión inmediata del rendimiento general:

- **Proyectos Activos**: Muestra el número de proyectos con estado `active`. Te indica cuántos proyectos están en marcha actualmente.
- **Tareas Totales**: Suma de todas las tareas creadas en todos tus proyectos.
- **Completadas**: Número de tareas marcadas como `done` en todo el workspace.
- **Rendimiento**: Porcentaje de tareas completadas respecto al total (`(done / total) × 100`). Un valor alto indica buena productividad.

### 1.2. Acceso Rápido (Quick Access)

Una cuadrícula de 2×2 con accesos directos a las secciones principales:

- **Proyectos** (icono FolderKanban): Te lleva al listado completo de proyectos. Muestra el número total de proyectos.
- **Equipo** (icono Users): Te lleva a la página de gestión de miembros del equipo.

### 1.3. Actividad Reciente

**[Figura 2: Panel de actividad reciente en el Dashboard]**

Ubicado en la parte inferior, el `GlobalActivityFeed` muestra un registro cronológico de todas las acciones relevantes realizadas en el workspace: creación de tareas, cambios de estado, comentarios, etc. Cada entrada incluye:

- **Avatar del usuario** que realizó la acción.
- **Descripción de la acción** con formato legible (ej. *"Daniel creó la tarea 'Configurar CI/CD'"*).
- **Marca de tiempo relativa** (ej. *"hace 2 horas"*, *"ayer"*).

> **Consejo**: Usa el Dashboard cada mañana como tu punto de partida. Revisa las métricas para identificar si hay proyectos estancados (bajo rendimiento) y la actividad reciente para estar al día con lo que ha ocurrido desde tu última sesión.

---

## 2. Proyectos (Listado)

**[Figura 3: Listado de proyectos en vista cuadrícula]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral izquierdo > Proyectos |
| Atajo | Desde el Dashboard > Acceso Rápido > Proyectos |

Esta es la vista principal de gestión de proyectos. Aquí puedes crear, filtrar, buscar y acceder a cada uno de tus proyectos.

### 2.1. Fila de Estadísticas (Parte Superior)

Cuatro tarjetas que resumen el estado general de tus proyectos:

| Métrica | Descripción |
|---|---|
| Proyectos Activos | Proyectos con estado activo actualmente |
| Tareas Totales | Suma de todas las tareas en todos los proyectos |
| Completadas | Tareas marcadas como completadas |
| Miembros | Número de miembros en el workspace |

### 2.2. Barra de Herramientas

- **Buscador** (Search): Filtra proyectos por nombre en tiempo real mientras escribes.
- **Filtros de Estado** (Píldoras): Filtra rápidamente por `Todos`, `Activos`, `En revisión`, `Pendientes` o `Completados`.
- **Alternar Vista**: Botones para cambiar entre vista **Cuadrícula** (Grid) y **Lista** (List).

### 2.3. Vista Cuadrícula (Grid)

Cada proyecto se muestra como una tarjeta con:

- **Icono/Color**: Círculo con el color distintivo del proyecto.
- **Estado**: Etiqueta con color (verde = Activo, morado = Revisión, amarillo = Pendiente, verde = Completado).
- **Nombre**: Título del proyecto.
- **Descripción**: Texto breve o *"Sin descripción"* si no tiene.
- **Barra de Progreso**: Barra horizontal que muestra el avance del proyecto (0–100%).
- **Métricas**: Miembros asignados y conteo de tareas (ej. `3/12 tareas`).
- **Enlace**: Toda la tarjeta es un clic para entrar al detalle del proyecto.

Al final de la cuadrícula hay una tarjeta especial **"Crear nuevo proyecto"** con borde punteado para añadir uno nuevo.

### 2.4. Vista Lista

**[Figura 4: Listado de proyectos en vista tabla]**

Una tabla compacta con columnas:

| Columna | Descripción |
|---|---|
| Nombre | Icono + nombre del proyecto + descripción corta |
| Estado | Etiqueta de estado con color |
| Progreso | Barra de progreso compacta + porcentaje |
| Tareas | Conteo de tareas completadas/totales |
| → | Flecha de acceso al detalle |

### 2.5. Crear un Proyecto

**[Figura 5: Modal de creación de proyecto]**

1. Presiona el botón **"Nuevo Proyecto"** en la esquina superior derecha (o la tarjeta "Crear nuevo proyecto").
2. Completa el formulario modal:
   - **Nombre** (requerido): El título del proyecto.
   - **Descripción** (opcional): Texto explicativo del proyecto.
   - **Color** (opcional): Selecciona entre 6 colores predefinidos para identificar visualmente el proyecto.
3. Presiona **"Crear"** para guardar o **"Cancelar"** para descartar.

> **Consejo**: Usa colores distintos para cada proyecto para identificarlos rápidamente en el Dashboard y en la barra lateral. Por ejemplo, rojo para proyectos críticos, verde para proyectos estables.

---

## 3. Detalle del Proyecto

**[Figura 6: Vista general del detalle de un proyecto con sus tabs]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral > Proyectos > clic en un proyecto |
| Breadcrumb | `~/kairo/projects/[nombre]` |

Al entrar a un proyecto, verás una cabecera con información general y cinco pestañas (tabs) de navegación horizontal.

### 3.1. Cabecera del Proyecto

- **Breadcrumb**: Muestra `~/kairo/projects/[nombre]` para orientación.
- **Nombre del proyecto**: Título en negrita.
- **Estado**: Etiqueta con el estado actual del proyecto.
- **Barra de Progreso**: Barra animada con porcentaje numérico.
- **Botones de Acción** (esquina superior derecha):
  - **Export/Import**: Abre el modal de exportación e importación de tareas.
  - **Actividad** (icono Activity): Panel deslizable con el registro de actividad del proyecto.
  - **Miembros** (icono Users): Panel deslizable para gestionar miembros.
  - **Ajustes** (icono Settings): Panel deslizable para configurar el proyecto.

### 3.2. Las 5 Pestañas del Proyecto

El contenido principal se organiza en cinco vistas intercambiables:

| Pestaña | Descripción |
|---|---|
| **Kanban** | Tablero de 4 columnas con drag-and-drop (ver sección 4) |
| **Sprints** | Planificación de sprints con tareas asociadas (ver sección 6) |
| **Calendario** | Vista mensual con tareas por fecha (ver sección 7) |
| **Gantt** | Diagrama de Gantt con línea de tiempo (ver sección 8) |
| **Analíticas** | Gráficos y estadísticas del proyecto (ver sección 9) |

### 3.3. Panel de Ajustes del Proyecto (Slide-over)

**[Figura 7: Panel de ajustes del proyecto]**

Se abre desde el icono de Settings en la cabecera:

- **Nombre**: Campo editable para renombrar el proyecto.
- **Descripción**: Campo de texto para actualizar la descripción.
- **Estado**: Selector desplegable para cambiar el estado (Activo, Revisión, Pendiente, Completado).
- **Color**: Paleta de 6 colores para personalizar la identidad visual.
- **Guardar / Cancelar**: Botones para confirmar o descartar cambios.
- **Eliminar proyecto**: Botón rojo en la parte inferior. Al presionarlo, solicita escribir *"ELIMINAR"* como confirmación antes de borrar permanentemente.

### 3.4. Panel de Miembros (Slide-over)

- **Propietario**: Sección del dueño del proyecto con avatar, nombre y email.
- **Miembros**: Lista de miembros del proyecto. Cada uno muestra:
  - Avatar + nombre completo + email.
  - Rol actual (Propietario, Colaborador, Visualizador).
  - Selector de rol (solo visible para el propietario).
  - Botón de eliminar (solo propietario).
- **Invitar**: Formulario para añadir nuevos miembros:
  - Por **email**: Envía una invitación por correo.
  - Por **ID de usuario**: Añade directamente si conoces el UUID del usuario.

### 3.5. Panel de Actividad (Slide-over)

Lista cronológica de todas las acciones realizadas en el proyecto: tareas creadas, estados cambiados, sprints planificados, miembros añadidos, etc. Cada entrada incluye el usuario, la acción y la fecha relativa.

---

## 4. Tablero Kanban

**[Figura 8: Tablero Kanban con tareas en sus columnas]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Pestaña **Kanban** |

El tablero Kanban es el corazón operativo de cada proyecto. Organiza las tareas en cuatro columnas que representan el flujo de trabajo.

### 4.1. Las 4 Columnas

| Columna | Propósito |
|---|---|
| **Backlog** | Tareas pendientes por priorizar o planificar |
| **In Progress** | Tareas en las que se está trabajando activamente |
| **Review** | Tareas completadas que necesitan revisión o verificación |
| **Done** | Tareas terminadas y validadas |

Cada columna muestra el número de tareas que contiene actualmente.

### 4.2. Tarjetas de Tarea (Task Cards)

**[Figura 9: Tarjeta de tarea expandida]**

Cada tarea se representa como una tarjeta con:

- **Borde lateral de prioridad**: Color que indica la urgencia:
  - 🔴 Rojo = Critical
  - 🟡 Naranja = High
  - 🟢 Verde = Medium
  - 🔵 Azul = Low
- **Título**: Nombre de la tarea.
- **Descripción**: Texto breve (opcional, expandible).
- **Etiquetas** (tags): Palabras clave para categorizar.
- **Prioridad**: Icono + texto del nivel de prioridad.
- **Fecha de vencimiento**: Fecha límite si está definida.
- **Asignado**: Avatar del miembro responsable.

### 4.3. Drag-and-Drop

Para mover una tarea entre columnas:

1. Haz clic sostenido sobre una tarjeta de tarea.
2. Arrástrala horizontalmente a la columna deseada.
3. Suelta para confirmar el cambio de estado.

El sistema muestra un **diálogo de confirmación** preguntando si estás seguro de cambiar el estado. Esto evita movimientos accidentales.

### 4.4. Filtros del Kanban

En la parte superior del tablero:

- **Buscador**: Filtra tareas por nombre en tiempo real.
- **Filtro de Prioridad**: Selecciona una prioridad específica para ver solo tareas de ese nivel.

### 4.5. Crear una Tarea desde el Kanban

Presiona el botón **"+ Nueva Tarea"** en cualquier columna para abrir el modal de creación de tareas (ver sección 5.1).

---

## 5. Gestión de Tareas

### 5.1. Crear una Tarea

**[Figura 10: Modal de creación de tarea]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Kanban > Botón "+ Nueva Tarea" |

El formulario de creación de tareas incluye:

| Campo | Obligatorio | Descripción |
|---|---|---|
| **Título** | Sí | Nombre descriptivo de la tarea |
| **Descripción** | No | Texto detallado con el contexto o requerimientos |
| **Prioridad** | No | 4 niveles: Critical, High, Medium, Low |
| **Estado** | No | Columna inicial: Backlog, In Progress, Review, Done |
| **Tags** | No | Palabras clave separadas por coma |
| **Fecha de vencimiento** | No | Fecha límite para completar la tarea |
| **Asignado** | No | Miembro del proyecto responsable |

Botones: **Crear** (guarda y cierra), **Cancelar** (descarta).

### 5.2. Editar / Ver Detalle de una Tarea

**[Figura 11: Modal de detalle de tarea]**

Haz clic en cualquier tarjeta de tarea para abrir el modal de detalle completo, donde puedes:

- **Editar título, descripción, prioridad, estado, tags, fecha y asignado**.
- **Ver timestamps**: Fecha de creación y última actualización.
- **Agregar comentarios** (ver sección 5.3).
- **Subir archivos adjuntos** (ver sección 5.4).
- **Gestionar dependencias** (ver sección 5.5).
- **Editar campos personalizados** (ver sección 5.6).

Desde aquí también puedes **eliminar la tarea** con confirmación.

### 5.3. Comentarios

**[Figura 12: Sección de comentarios en el detalle de tarea]**

Cada tarea tiene un hilo de comentarios:

1. Los comentarios se muestran en orden cronológico.
2. Cada comentario muestra: avatar del autor, nombre, contenido y timestamp relativo.
3. Para agregar un comentario: escribe en el campo de texto y presiona **Enviar**.
4. Puedes **eliminar tus propios comentarios** (icono de papelera).
5. Los comentarios se actualizan en **tiempo real** gracias a las suscripciones de Supabase Realtime.

### 5.4. Archivos Adjuntos

**[Figura 13: Gestión de archivos adjuntos]**

Puedes adjuntar archivos a las tareas:

1. Presiona el botón **"Subir archivo"**.
2. Selecciona un archivo desde tu computadora.
3. El archivo se sube a Supabase Storage y se registra en la base de datos.
4. Los archivos aparecen listados con: nombre, tipo (icono según extensión: imagen, PDF, genérico), tamaño y botón de descarga.
5. Puedes **eliminar** cualquier archivo adjunto.

Límites: Máximo 10 MB por archivo. Formatos permitidos: imágenes, PDFs, documentos y archivos comprimidos.

### 5.5. Dependencias entre Tareas

**[Figura 14: Panel de dependencias de tarea]**

Puedes establecer relaciones entre tareas:

- **Bloquea** (Blocks): La tarea actual bloquea a otra tarea.
- **Requiere** (Requires): La tarea actual depende de otra para poder iniciarse.

Para agregar una dependencia:
1. Selecciona la tarea destino (buscador de tareas del proyecto).
2. Elige el tipo de relación (Blocks / Requires).
3. Presiona **Añadir**.

Las dependencias se muestran en dos listas: "Bloquea a..." y "Requiere de...". Puedes eliminar cualquier dependencia con el icono ✕.

### 5.6. Campos Personalizados (Custom Fields)

**[Figura 15: Gestión de campos personalizados]**

Los proyectos pueden tener campos adicionales definidos por el usuario:

| Tipo | Descripción |
|---|---|
| Text | Campo de texto libre |
| Number | Valor numérico |
| Date | Selector de fecha |
| Select | Lista desplegable con opciones predefinidas |
| Boolean | Interruptor sí/no |

Desde el proyecto, en la sección de Sprints, puedes gestionar los campos personalizados:
- **Crear** nuevo campo: nombre, tipo y opciones (para tipo Select).
- **Editar**: cambiar nombre, tipo o configuración.
- **Eliminar**: borrar el campo y todos sus valores asociados.

Desde el detalle de cada tarea, puedes **editar los valores** de estos campos personalizados para la tarea específica.

---

## 6. Sprints

**[Figura 16: Panel de sprints con sprints listados]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Pestaña **Sprints** |

La planificación por sprints permite organizar el trabajo en ciclos de tiempo definidos, siguiendo metodologías ágiles.

### 6.1. Estados de un Sprint

| Estado | Descripción |
|---|---|
| **Planning** | Sprint en fase de planificación, se están definiendo tareas |
| **Active** | Sprint en ejecución, el equipo está trabajando en las tareas asignadas |
| **Completed** | Sprint finalizado exitosamente |
| **Cancelled** | Sprint cancelado, las tareas quedan liberadas |

### 6.2. Crear un Sprint

1. Presiona el botón **"Nuevo Sprint"**.
2. Completa los campos:
   - **Nombre**: Identificador del sprint (ej. "Sprint 1", "Sprint 2").
   - **Objetivo** (Goal): Meta o propósito del sprint.
   - **Fecha de inicio** y **Fecha de fin**: Período de duración.
3. Presiona **Crear**.

### 6.3. Gestionar un Sprint

Cada sprint expandido muestra:

- **Banner informativo** con nombre, objetivo, fechas y estado.
- **Tareas del sprint**: Lista de tareas asignadas a este sprint.
- **Añadir tareas**: Botón para agregar tareas existentes del proyecto al sprint.
- **Cambiar estado**: Botones para mover el sprint entre Planning → Active → Completed / Cancelled.

> **Consejo**: Activa el sprint solo cuando todas las tareas estén planificadas. Un sprint activo debe tener un alcance claro y realista.

---

## 7. Vista de Calendario

**[Figura 17: Vista de calendario mensual con tareas]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Pestaña **Calendario** |

El calendario muestra las tareas del proyecto organizadas por su fecha de vencimiento en una cuadrícula mensual.

### 7.1. Navegación

- **Mes actual**: Indicador en la parte superior.
- **Botones ◀ / ▶**: Navegar entre meses.
- **Día actual**: Resaltado visualmente.

### 7.2. Tareas en el Calendario

- Cada tarea aparece en el día correspondiente a su fecha de vencimiento.
- Las tareas se muestran con un color que indica su prioridad.
- Al hacer clic en un día, puedes ver todas las tareas que vencen ese día.
- Los días sin tareas aparecen vacíos.

### 7.3. Panel Lateral

A la derecha del calendario, un panel muestra:

- Lista de tareas del día seleccionado.
- Cada tarea muestra: nombre, prioridad y estado.

---

## 8. Diagrama de Gantt

**[Figura 18: Diagrama de Gantt con línea de tiempo]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Pestaña **Gantt** |

El diagrama de Gantt proporciona una vista horizontal del cronograma del proyecto, mostrando las tareas como barras en una línea de tiempo.

### 8.1. Estructura

- **Eje vertical (izquierda)**: Lista de nombres de tareas.
- **Eje horizontal (superior)**: Días del período (encabezados de columna).
- **Barras de tarea**: Cada tarea se representa como una barra coloreada que se extiende desde su fecha de inicio hasta su fecha de fin estimada.

### 8.2. Interacción

- **Scroll horizontal**: Desplázate a lo largo de la línea de tiempo.
- **Scroll vertical**: Navega entre las tareas del proyecto.
- La vista se adapta automáticamente al ancho de la pantalla, con columnas de día de tamaño flexible.

### 8.3. Cambio de Vista

Puedes alternar entre:
- **Vista centrada en sprints**: Muestra las tareas agrupadas por sprint.
- **Vista de todas las tareas**: Muestra el cronograma completo del proyecto.

---

## 9. Panel de Analíticas

**[Figura 19: Panel de analíticas con gráficos]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Pestaña **Analíticas** |

El panel de analíticas ofrece datos cuantitativos sobre el rendimiento del proyecto.

### 9.1. Pestaña Overview

- **Gráfico de barras de distribución de estados**: Muestra cuántas tareas hay en cada columna (Backlog, In Progress, Review, Done). Ideal para identificar cuellos de botella.
- **Tarjetas de estadísticas**:
  | Métrica | Descripción |
  |---|---|
  | **Total** | Número total de tareas |
  | **Completadas** | Tareas en estado Done |
  | **En progreso** | Tareas en estado In Progress |
  | **Atrasadas** | Tareas vencidas no completadas |

### 9.2. Pestaña Distribution

Información adicional sobre la distribución de tareas por estado, con representación visual alternativa.

> **Consejo**: Usa la pestaña Overview al final de cada sprint para evaluar el rendimiento. Si ves muchas tareas en Review, el equipo puede estar acumulando revisión sin cerrar.

---

## 10. Equipo

**[Figura 20: Página de equipo con miembros agrupados]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral izquierdo > Equipo |
| Icono | Users |

La página de equipo muestra todos los miembros del workspace, los proyectos que comparten y sus roles.

### 10.1. Estadísticas de Equipo

| Métrica | Descripción |
|---|---|
| **Colaboradores** | Número total de miembros en el workspace |
| **Proyectos propios** | Cantidad de proyectos donde eres propietario |
| **Colaborativo** | Indicador de modo colaborativo activo |

### 10.2. Listado de Miembros

Cada miembro se muestra en una tarjeta con:

- **Avatar**: Iniciales del nombre o foto de perfil.
- **Nombre completo**: Nombre del usuario.
- **Email**: Dirección de correo electrónico.
- **Proyectos compartidos**: Lista de proyectos en los que participa, cada uno con su rol (Propietario, Colaborador, Visualizador).

### 10.3. Gestión de Roles

Si eres propietario de un proyecto, puedes:

| Acción | Descripción |
|---|---|
| **Cambiar rol** | Asignar Colaborador (puede editar tareas) o Visualizador (solo lectura) |
| **Eliminar miembro** | Remover a un usuario de un proyecto específico |

---

## 11. Pomodoro

**[Figura 21: Temporizador Pomodoro]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral izquierdo > Pomodoro |
| Icono | Clock |

El Pomodoro es una herramienta de productividad basada en la Técnica Pomodoro, que alterna intervalos de trabajo concentrado con descansos breves.

### 11.1. Ciclos del Temporizador

| Fase | Duración | Color |
|---|---|---|
| **Focus** (Enfoque) | 25 minutos | Rojo |
| **Break** (Descanso corto) | 5 minutos | Verde |
| **Long Break** (Descanso largo) | 15 minutos | Azul |

### 11.2. Cómo Usarlo

1. Presiona el botón **Play** para iniciar un ciclo de enfoque.
2. Trabaja concentrado hasta que suene la notificación.
3. Toma un descanso de 5 minutos (Break).
4. Después de 4 ciclos de enfoque, toma un descanso largo de 15 minutos.
5. Puedes **Pausar** en cualquier momento y reanudar después.
6. Presiona **Reset** para reiniciar la fase actual.
7. Presiona **Skip** para saltar a la siguiente fase.

El navegador mostrará una **notificación del sistema** al cambiar de fase (Focus → Break o Break → Focus).

### 11.3. Estadísticas del Pomodoro

**[Figura 22: Estadísticas semanales del Pomodoro]**

Debajo del temporizador:

- **Hoy**: Total de horas de enfoque acumuladas hoy.
- **Sesiones completadas**: Número de ciclos Focus finalizados hoy.
- **Ciclo actual**: Número de ciclos completados en la sesión actual.
- **Gráfico semanal**: Barras que muestran el tiempo de enfoque por día de la semana.

Todas las sesiones se guardan automáticamente en Supabase y se asocian a tu perfil.

> **Consejo**: Usa el Pomodoro cuando necesites concentrarte en tareas complejas. La técnica ayuda a mantener el foco y prevenir la fatiga mental.

---

## 12. Búsqueda Global

**[Figura 23: Modal de búsqueda global (Cmd+K)]**

| Parámetro | Ruta |
|---|---|
| Atajo de teclado | `Cmd + K` (Mac) / `Ctrl + K` (Windows/Linux) |

La búsqueda global te permite encontrar cualquier elemento en el workspace sin navegar manualmente.

### 12.1. Cómo Usarla

1. Presiona `Cmd + K` o `Ctrl + K` desde cualquier página.
2. Aparece un modal con un campo de búsqueda.
3. Escribe tu consulta. Los resultados se filtran en tiempo real.
4. Navega con las flechas del teclado (↑ / ↓).
5. Presiona `Enter` para ir al resultado seleccionado.

### 12.2. Resultados por Categoría

Los resultados se agrupan en:

| Categoría | Icono | Descripción |
|---|---|---|
| **Proyectos** | FolderKanban | Coincidencias por nombre de proyecto |
| **Tareas** | CheckSquare | Coincidencias por título de tarea |
| **Miembros** | Users | Coincidencias por nombre de usuario |

Puedes cerrar el modal presionando `Esc` o haciendo clic fuera de él.

---

## 13. Consola / Terminal

**[Figura 24: Terminal interactivo]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral izquierdo > Consola |
| Icono | Terminal |

La consola es un terminal interactivo emulado en el navegador. Permite consultar datos del workspace mediante comandos de texto, ideal para usuarios familiarizados con la línea de comandos.

### 13.1. Comandos Disponibles

| Comando | Descripción | Ejemplo |
|---|---|---|
| `help` | Muestra la lista de comandos disponibles | `help` |
| `projects` | Lista todos los proyectos del workspace | `projects --format json` |
| `tasks` | Muestra las tareas de un proyecto específico | `tasks [project-id]` |
| `stats` | Estadísticas generales del workspace | `stats` |
| `whoami` | Muestra tu información de perfil | `whoami` |
| `clear` | Limpia la pantalla del terminal | `clear` |
| `echo` | Repite el texto ingresado | `echo Hola mundo` |
| `date` | Muestra la fecha y hora actual | `date` |
| `banner` | Muestra el banner ASCII de KairoTask | `banner` |

### 13.2. Características

- **Historial de comandos**: Navega con las flechas ↑ / ↓ para recuperar comandos anteriores.
- **Formato JSON**: Algunos comandos aceptan `--format json` para salida estructurada.
- **Datos reales**: Los comandos consultan datos reales de Supabase (proyectos, tareas, perfil).
- **Prompt**: Muestra `kairo@task:~$ ` simulando un terminal real.

> **Consejo**: Usa `projects --format json` si necesitas copiar los datos de proyectos en un formato estructurado para compartir con otras herramientas.

---

## 14. Ajustes (Configuración)

**[Figura 25: Página de ajustes del sistema]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú lateral izquierdo > Ajustes |
| Icono | Settings (engranaje) |

La página de ajustes está organizada en secciones con tarjetas expandidas.

### 14.1. Notificaciones

Controla cómo y cuándo recibes notificaciones:

| Opción | Descripción |
|---|---|
| **Notificaciones por email** | Recibe resúmenes y alertas en tu bandeja de entrada |
| **Notificaciones push** | Alertas en tiempo real en el navegador |
| **Asignación de tareas** | Notificar cuando te asignan una tarea nueva |
| **Menciones** | Notificar cuando alguien te menciona en un comentario |

Cada opción tiene un interruptor (toggle) para activar/desactivar.

### 14.2. Webhooks

**[Figura 26: Gestión de webhooks]**

Los webhooks permiten conectar KairoTask con servicios externos mediante llamadas HTTP.

**Crear un webhook**:

1. Presiona **"Añadir webhook"**.
2. Completa los campos:
   - **Nombre**: Identificador del webhook.
   - **URL**: Dirección HTTP donde se enviará el payload.
   - **Proyecto**: Proyecto al que está asociado.
   - **Eventos**: Selecciona uno o más eventos (task.created, task.updated, task.deleted, etc.).
3. Presiona **"Crear"**.

**Gestionar webhooks existentes**:
- **Activar/Desactivar**: Interruptor para habilitar o deshabilitar el webhook sin eliminarlo.
- **Eliminar**: Borra el webhook permanentemente.

### 14.3. Apariencia

| Opción | Descripción |
|---|---|
| **Modo compacto** | Reduce el espaciado de la UI para más densidad de información |
| **Animaciones** | Habilita micro-animaciones y transiciones en la interfaz |
| **Tema** | El toggle principal de tema oscuro/claro está en la barra superior del Dashboard (☀/🌙) |

### 14.4. Idioma y Región

- **Idioma de la interfaz**: Actualmente disponible en Español e Inglés.
- Usa el selector de idioma en la barra superior (icono Globe) para cambiar entre ES/EN.

### 14.5. Seguridad

- **Cambiar contraseña**: Envía un enlace de restablecimiento a tu correo electrónico.
- Presiona **"Restablecer"** para iniciar el proceso.

### 14.6. Guardar Preferencias

- Botón **"Guardar preferencias"**: Persiste todos los cambios de configuración en la base de datos.
- Muestra estado "Guardando..." durante el proceso y "¡Guardado!" al completar.

### 14.7. Zona de Peligro

- **Eliminar cuenta**: Acción irreversible. Requiere escribir *"ELIMINAR"* en el campo de confirmación y presionar **"Confirmar eliminación"**.

---

## 15. Perfil de Usuario

**[Figura 27: Página de perfil de usuario]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Menú de usuario (esquina superior derecha) > Mi perfil |

### 15.1. Foto de Perfil

- **Avatar actual**: Muestra la foto actual o las iniciales si no tiene.
- **Cambiar avatar**: Arrastra y suelta una imagen o haz clic para seleccionar un archivo.
- Formatos permitidos: imágenes (JPEG, PNG, WebP). Máximo 2 MB.
- La imagen se sube a Supabase Storage y se asocia a tu perfil automáticamente.

### 15.2. Información Personal

| Campo | Descripción |
|---|---|
| **Nombre completo** | Campo editable para actualizar tu nombre |
| **Email** | Mostrado pero no editable (gestionado desde Supabase Auth) |

### 15.3. Datos de la Cuenta

| Dato | Descripción |
|---|---|
| **Miembro desde** | Fecha de registro en la plataforma |
| **ID de usuario** | Identificador único (UUID). Incluye botón **"Copiar"** para portapapeles |

Botón **"Guardar cambios"**: Persiste los cambios de nombre y avatar.

---

## 16. Exportar / Importar

**[Figura 28: Modal de exportación e importación de tareas]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dentro de un proyecto > Botón "Export/Import" en la cabecera |

### 16.1. Exportar Tareas

Puedes exportar todas las tareas de un proyecto en dos formatos:

| Formato | Descripción | Uso |
|---|---|---|
| **JSON** | Datos estructurados completos | Migración a otras herramientas, respaldo |
| **CSV** | Tabla plana compatible con Excel | Reportes, análisis en hojas de cálculo |

### 16.2. Importar Tareas

- **Formato**: Solo JSON.
- **Método**: Arrastra y suelta un archivo JSON en el área designada, o haz clic para seleccionarlo.
- Las tareas se importan al proyecto actual.
- **Validación**: El sistema verifica la estructura del JSON antes de importar.

> **Consejo**: Exporta regularmente en JSON como respaldo de las tareas de tus proyectos críticos.

---

## 17. Notificaciones en Tiempo Real

**[Figura 29: Campana de notificaciones con lista desplegable]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Barra superior del Dashboard (icono de campana) |

### 17.1. Tipos de Notificaciones

| Tipo | Cuándo se dispara |
|---|---|
| **Tarea asignada** | Cuando alguien te asigna una tarea |
| **Comentario** | Cuando alguien comenta en una tarea donde participas |
| **Mención** | Cuando alguien te menciona (@usuario) en un comentario |
| **Fecha límite** | Cuando una tarea asignada a ti está próxima a vencer |

### 17.2. Interacción

- **Campana**: Muestra un badge con el número de notificaciones no leídas.
- **Abrir lista**: Haz clic en la campana para desplegar las últimas notificaciones.
- **Marcar como leída**: Haz clic en una notificación para marcar individualmente y navegar al elemento relacionado.
- **Marcar todas como leídas**: Botón para limpiar todas las notificaciones pendientes.
- **Actualización en tiempo real**: Las notificaciones aparecen automáticamente sin necesidad de recargar la página.

---

## 18. Actividad Global

**[Figura 30: Feed de actividad global en el Dashboard]**

| Parámetro | Ruta |
|---|---|
| Ubicación | Dashboard > Sección inferior "Actividad reciente" |

El feed de actividad global recopila eventos de todos los proyectos del workspace:

- **Creación de tareas**: "Daniel creó la tarea 'Implementar login' en Proyecto Alpha".
- **Cambios de estado**: "María movió 'Revisar PR' de Review a Done".
- **Actualizaciones**: "Carlos actualizó la descripción de 'Configurar CI'".
- **Comentarios**: "Ana comentó en 'Diseñar mockups'".
- **Eventos de sprint**: "Luis activó el Sprint 2".

Cada entrada incluye el avatar del usuario, la descripción legible y un timestamp relativo.

---

## Buenas Prácticas de Uso

| Práctica | Recomendación |
|---|---|
| **Revisión diaria** | Comienza el día revisando el Dashboard para detectar proyectos con bajo rendimiento o tareas atrasadas |
| **Kanban actualizado** | Mantén las tareas en la columna correcta. Mueve las tareas a Review solo cuando estén listas para validación |
| **Sprints planificados** | Define sprints con fechas claras y objetivos específicos. No actives un sprint hasta que esté completamente planificado |
| **Pomodoro regular** | Usa el Pomodoro para bloques de trabajo concentrado. Respeta los descansos para mantener la productividad |
| **Equipo organizado** | Revisa los roles de los miembros periódicamente. Asigna permisos de visualización a usuarios que solo necesitan consultar |
| **Webhooks útiles** | Configura webhooks para integraciones con Slack, Discord u otras herramientas de notificación |
| **Respaldos periódicos** | Exporta proyectos importantes en JSON como respaldo antes de cambios mayores |
| **Auditoría** | Consulta la actividad global cuando necesites investigar quién hizo un cambio o cuándo ocurrió |

---

*Documentación generada para el sistema KairoTask — Plataforma de gestión de proyectos ágil con enfoque dev-centric.*
