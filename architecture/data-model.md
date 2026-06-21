# Diagrama Entidad-Relación (Base de Datos)

El corazón de los datos de **KairoTask** reside en una base de datos PostgreSQL alojada en **Supabase**. Actualmente hay **7 migraciones** que definen 10 tablas y 2 buckets de Storage.

```mermaid
erDiagram
    PROFILES {
        uuid id PK
        string email
        string full_name
        string avatar_url
        timestamp updated_at
    }

    PROJECTS {
        uuid id PK
        string name
        text description
        string status "active, review, pending, done"
        int progress
        string color
        uuid owner_id FK
        timestamp created_at
    }

    PROJECT_MEMBERS {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string role "owner, collaborator, viewer"
        timestamp created_at
    }

    TASKS {
        uuid id PK
        uuid project_id FK
        string title
        text description
        string status "backlog, in-progress, review, done"
        string priority "low, medium, high, critical"
        uuid assignee_id FK
        date due_date
        string[] tags
        uuid created_by FK
        timestamp created_at
        timestamp updated_at
    }

    TASK_COMMENTS {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        text content
        timestamp created_at
    }

    ACTIVITY_LOG {
        uuid id PK
        uuid project_id FK
        uuid task_id FK
        uuid user_id FK
        string action
        jsonb metadata
        timestamp created_at
    }

    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        string type "task_assigned, comment, mention, deadline"
        string title
        text message
        string link
        boolean is_read
        timestamp created_at
    }

    NOTIFICATION_PREFERENCES {
        uuid user_id PK, FK
        boolean email
        boolean push
        boolean task_assignment
        boolean mentions
        timestamp created_at
        timestamp updated_at
    }

    POMODORO_SESSIONS {
        uuid id PK
        uuid user_id FK
        int duration_minutes
        string type "focus, break, long_break"
        boolean completed
        timestamp started_at
        timestamp ended_at
    }

    TASK_ATTACHMENTS {
        uuid id PK
        uuid task_id FK
        uuid user_id FK
        string file_name
        int file_size
        string mime_type
        string storage_path
        timestamp created_at
    }

    PROFILES ||--o{ PROJECTS : "owns"
    PROFILES ||--o{ PROJECT_MEMBERS : "belongs to"
    PROJECTS ||--o{ PROJECT_MEMBERS : "has"
    PROJECTS ||--o{ TASKS : "contains"
    PROJECTS ||--o{ ACTIVITY_LOG : "logs"
    TASKS ||--o{ TASK_COMMENTS : "has"
    TASKS ||--o{ ACTIVITY_LOG : "logs"
    TASKS ||--o{ TASK_ATTACHMENTS : "attaches"
    PROFILES ||--o{ TASK_COMMENTS : "writes"
    PROFILES ||--o{ NOTIFICATIONS : "receives"
    PROFILES ||--o{ POMODORO_SESSIONS : "focuses"
    PROFILES ||--o{ NOTIFICATION_PREFERENCES : "configures"
    PROFILES ||--o{ TASKS : "assigned to"
    PROFILES ||--o{ TASKS : "creates"
    PROFILES ||--o{ TASK_ATTACHMENTS : "uploads"
```

## Entidades

| Tabla | Propósito | Migración |
|-------|-----------|-----------|
| `profiles` | Perfiles sincronizados desde auth.users vía trigger | 003 |
| `projects` | Proyectos con estado, progreso y color | 001 |
| `project_members` | Relación usuario-proyecto con roles | 003 |
| `tasks` | Tareas con status, prioridad, tags y fechas | 002 |
| `task_comments` | Comentarios en tareas | 004 |
| `activity_log` | Log automático de actividad vía trigger | 004 |
| `notifications` | Notificaciones con tipos y link | 006 |
| `notification_preferences` | Preferencias de notificación por usuario | 006 |
| `pomodoro_sessions` | Sesiones de enfoque/descanso | 005 |
| `task_attachments` | Archivos adjuntos a tareas | 007 |

## Storage Buckets

| Bucket | Visibilidad | Límite | Tipos | Propósito |
|--------|-------------|--------|-------|-----------|
| `avatars` | Público | 2 MB | Imágenes | Fotos de perfil |
| `task-attachments` | Privado | 10 MB | Cualquiera | Archivos de tareas (vía signed URLs) |

## Seguridad (RLS)

Todas las tablas tienen Row Level Security habilitado. Políticas clave:

- **projects/**: owner ve todos sus proyectos; miembros ven proyectos compartidos vía project_members
- **tasks/**: miembros del proyecto pueden CRUD tareas según su rol
- **project_members/**: owner puede gestionar miembros; cada quien ve sus membresías
- **task_attachments/**: miembros del proyecto pueden ver/crear; creador puede eliminar
- **storage.objects**: avatars son públicos; task-attachments requiere membresía al proyecto

## Realtime

Las siguientes tablas están publicadas en `supabase_realtime`:
`tasks`, `project_members`, `task_comments`, `activity_log`, `notifications`, `task_attachments`
