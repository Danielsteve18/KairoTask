# Nivel 3: Diagrama de Componentes (Backend / Server Actions)

Este diagrama se enfoca en la capa interna de la aplicación (Next.js), detallando los módulos lógicos (Server Actions y Controladores) que permiten el funcionamiento orquestado de **KairoTask**.

```mermaid
C4Component
    title Diagrama de Componentes - Capa Lógica KairoTask (Next.js)

    Container(pwa, "Frontend UI", "React Components", "Interfaces visuales, Tablero Kanban interactivo, Formularios de creación.")

    Container_Boundary(nextjs_boundary, "Backend Lógico (Next.js Server Actions)") {
        Component(authAction, "Controlador de Autenticación", "Server Action", "Maneja peticiones de login, logout, registro y recuperación de clave de forma segura en el servidor.")
        Component(projectAction, "Controlador de Proyectos", "Server Action", "CRUD de proyectos y gestión de los miembros del equipo asociados.")
        Component(taskAction, "Controlador de Tareas", "Server Action", "CRUD de tareas, lógica de cambio de estado (Drag & Drop en Kanban) y validación de fechas límite.")
        Component(notificationAction, "Servicio de Notificaciones", "Módulo Interno", "Recibe eventos y decide cuándo enviar un email vía BillionMail o emitir una alerta en base de datos.")
    }

    Container(supabase_db, "Supabase Database", "PostgreSQL", "Almacenamiento relacional y ejecución de políticas RLS.")
    Container(billionMail, "BillionMail", "SMTP", "Servicio externo de Correos electrónicos.")

    Rel(pwa, authAction, "Envía credenciales y validación de 2FA/Email")
    Rel(pwa, projectAction, "Crea, archiva o edita propiedades de proyectos")
    Rel(pwa, taskAction, "Mueve tareas entre columnas, actualiza descripciones, añade comentarios")
    
    Rel(authAction, supabase_db, "Valida existencia del usuario y persistencia de sesión")
    Rel(projectAction, supabase_db, "Inserta/Actualiza entidades de proyectos en DB")
    Rel(taskAction, supabase_db, "Inserta/Actualiza entidades de tareas en DB")
    
    Rel(taskAction, notificationAction, "Gatilla alerta interna por nueva asignación o comentario")
    Rel(projectAction, notificationAction, "Gatilla alerta por invitación al proyecto")
    
    Rel(notificationAction, billionMail, "Orquesta el envío de correo transaccional asíncrono")
```

## Descripción de Componentes Internos

*   **Controlador de Autenticación:** Se comunica con la API de Supabase Auth para gestionar los tokens JWT (que luego son configurados para ser almacenados en cookies HTTP-only). Protege las rutas principales de la PWA redirigiendo a los usuarios no autenticados mediante Next.js Middleware.
*   **Controlador de Proyectos:** Contiene la lógica de negocio para crear espacios de trabajo. Verifica límites de proyectos (si los hubiere) y gestiona la tabla de relación (usuario-proyecto) para dar los accesos correctos a los compañeros de equipo invitados.
*   **Controlador de Tareas:** Es el módulo de mayor uso. Cada vez que un usuario arrastra una tarea en el Kanban o cambia su nivel de prioridad, esta Server Action se ejecuta, valida los roles de usuario a través de RLS, y actualiza la fila correspondiente en la base de datos PostgreSQL, retornando la versión actualizada para revalidar el caché del frontend.
*   **Servicio de Notificaciones:** Un servicio interno que intercepta acciones importantes provenientes de los controladores (ej: asignar a un estudiante a una tarea urgente o acercarse a una fecha de entrega) para gestionar el envío del correo electrónico con BillionMail y registrar la notificación in-app en la base de datos para que Supabase Realtime la distribuya a la campana de alertas del usuario.
