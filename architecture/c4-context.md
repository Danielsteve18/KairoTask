# Nivel 1: Diagrama de Contexto (Vista General)

Este diagrama modela la relación de **KairoTask** con sus usuarios y sistemas externos de nivel macro, detallando cómo interactúan los diferentes actores con la plataforma y qué dependencias externas existen.

```mermaid
C4Context
    title Diagrama de Contexto - KairoTask

    Person(student, "Estudiante / Miembro", "Usuario universitario que gestiona proyectos, asigna tareas y colabora en tiempo real.")
    Person(admin, "Administrador / Docente", "Supervisa equipos y configuraciones del sistema, gestiona proyectos a nivel macro.")

    System(kairoTask, "Sistema KairoTask", "Plataforma progresiva (PWA) de gestión ágil de proyectos y tareas colaborativas.")
    
    System_Ext(billionMail, "BillionMail", "Servidor de correo auto-alojado para envíos transaccionales y notificaciones por email.")
    System_Ext(supabase, "Supabase (BaaS)", "Backend as a Service. Provee autenticación de usuarios, base de datos en tiempo real y almacenamiento de archivos.")

    Rel(student, kairoTask, "Utiliza para colaborar y organizar tareas")
    Rel(admin, kairoTask, "Gestiona y supervisa equipos")
    
    Rel(kairoTask, billionMail, "Solicita envío de correos (verificaciones, alertas)")
    Rel(kairoTask, supabase, "Autentica usuarios, lee/escribe datos y archivos")
    Rel(billionMail, student, "Envía correos electrónicos a")
    Rel(billionMail, admin, "Envía correos electrónicos a")
```

## Descripción de Componentes

### Actores
*   **Estudiante / Miembro:** Es el usuario final principal. Utiliza KairoTask para crear proyectos, definir tareas, actualizar estados (Kanban) y comunicarse con su equipo.
*   **Administrador / Docente:** Un usuario con permisos elevados que puede administrar configuraciones del sistema, supervisar varios equipos de estudiantes y auditar la actividad de los proyectos.

### Sistemas
*   **Sistema KairoTask:** La aplicación principal desarrollada en Next.js. Funciona como una PWA (Progressive Web App) para asegurar accesibilidad multiplataforma y una experiencia similar a una app nativa.
*   **Supabase (BaaS):** Servicio de infraestructura gestionada que actúa como pilar fundamental de los datos. Proporciona la base de datos PostgreSQL, la autenticación y las capacidades en tiempo real (WebSockets).
*   **BillionMail:** Sistema externo encargado de la entrega de correos electrónicos transaccionales, vital para el proceso de registro (confirmación de cuenta), recuperación de contraseñas y alertas críticas.
