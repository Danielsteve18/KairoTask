# Nivel 2: Diagrama de Contenedores

Este diagrama desglosa el Sistema **KairoTask** en sus contenedores principales de ejecución y almacenamiento, mostrando cómo están distribuidas las responsabilidades tecnológicas.

```mermaid
C4Container
    title Diagrama de Contenedores - KairoTask

    Person(user, "Usuario (Estudiante/Docente)", "Interactúa con la plataforma desde navegadores de escritorio o móviles.")

    System_Boundary(kairoTask_Boundary, "KairoTask") {
        Container(pwa, "Frontend Web App (PWA)", "Next.js, NextUI, React", "Interfaz de usuario instalable, responsiva y animada (GSAP, ASCII Studio). Maneja el estado global y caché de datos con TanStack Query o Zustand.")
        Container(api, "Backend / Server Actions", "Next.js, Node.js", "Capa intermedia de lógica de negocio, validación y seguridad. Expone funciones llamadas desde el cliente de forma segura.")
    }

    System_Ext(supabase_auth, "Supabase Auth", "Go, JWT", "Servicio gestionado de Autenticación y gestión de usuarios.")
    System_Ext(supabase_db, "PostgreSQL Base de Datos", "PostgreSQL", "Almacenamiento persistente de proyectos, tareas, usuarios y comentarios. Incluye configuración de RLS (Row Level Security).")
    System_Ext(supabase_realtime, "Supabase Realtime", "Elixir, WebSockets", "Notificaciones y sincronización en tiempo real de cambios en la base de datos a los clientes conectados.")
    System_Ext(billionMail, "BillionMail", "SMTP", "Servidor transaccional de correos para notificaciones externas.")

    Rel(user, pwa, "Navega, crea tareas, visualiza proyectos", "HTTPS / WSS")
    Rel(pwa, api, "Llama acciones (Server Actions) y API Routes", "HTTPS")
    Rel(pwa, supabase_realtime, "Escucha cambios en vivo (Tablero Kanban, comentarios)", "WebSockets")
    
    Rel(api, supabase_db, "Lee y escribe información estructural", "TCP/IP, Postgres Protocol")
    Rel(api, supabase_auth, "Valida sesiones de usuario, genera y renueva tokens JWT", "HTTPS")
    Rel(api, billionMail, "Dispara notificaciones por correo electrónico a los usuarios", "SMTP / API")
```

## Descripción de Contenedores

1.  **Frontend Web App (PWA):** Construido sobre React y el App Router de Next.js. Provee una experiencia inmersiva usando NextUI para la base de componentes, GSAP para animaciones complejas y ASCII Studio para identidad visual. Integra Service Workers a través de `@ducanh2912/next-pwa` para funcionalidad offline parcial y la capacidad de instalarse como una aplicación en móviles o escritorio.
2.  **Backend / Server Actions:** Aprovechando las capacidades de Next.js, se elimina la necesidad de un servidor Node.js (como Express) separado. Las Server Actions actúan como controladores backend seguros que procesan formularios y peticiones en el lado del servidor antes de interactuar con la base de datos o APIs externas.
3.  **Supabase Auth & DB & Realtime:** Supabase se divide conceptualmente en tres servicios altamente acoplados que son consumidos por KairoTask.
    *   **Auth:** Gestiona las identidades (Registro, Login, Recuperación). Los tokens se guardan de forma segura en cookies.
    *   **PostgreSQL:** El corazón de los datos. Emplea RLS (Row Level Security) para garantizar que un estudiante solo pueda ver y modificar los proyectos y tareas a los que pertenece o le han sido asignados.
    *   **Realtime:** Esencial para la actualización instantánea del tablero Kanban; cuando un compañero mueve una tarea de columna, el cambio se refleja en milisegundos en la pantalla del resto del equipo.
