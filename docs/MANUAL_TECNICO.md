# KairoTask — Manual Técnico

## Arquitectura, base de datos, componentes y pruebas del sistema

| Característica | Detalle |
|---|---|
| Versión | 1.0.0 |
| Fecha | 20 de junio de 2026 |
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript (strict) |
| Base de datos | Supabase (PostgreSQL 15) |
| Testing | Vitest + Testing Library |

---

## Índice de contenidos

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Estructura del Proyecto](#2-estructura-del-proyecto)
3. [Base de Datos (Esquema completo)](#3-base-de-datos-esquema-completo)
4. [Sistema de Autenticación](#4-sistema-de-autenticación)
5. [Gestión de Estado](#5-gestión-de-estado)
6. [Arquitectura de Componentes](#6-arquitectura-de-componentes)
7. [Sistema de Hooks](#7-sistema-de-hooks)
8. [Sistema de i18n](#8-sistema-de-i18n)
9. [Sistema de Estilos](#9-sistema-de-estilos)
10. [PWA (Progressive Web App)](#10-pwa-progressive-web-app)
11. [Suscripciones en Tiempo Real](#11-suscripciones-en-tiempo-real)
12. [Pruebas (Testing)](#12-pruebas-testing)
13. [Seguridad y RLS](#13-seguridad-y-rls)
14. [Almacenamiento de Archivos](#14-almacenamiento-de-archivos)
15. [Despliegue](#15-despliegue)

---

## 1. Stack Tecnológico

| Capa | Tecnología | Propósito |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | SSR, routing, Server Components |
| **Lenguaje** | TypeScript (strict mode) | Tipado estático en todo el códigobase |
| **CSS** | Tailwind CSS v4 + `tw-animate-css` | Estilizado utility-first con animaciones |
| **UI Components** | shadcn/ui (New York style) + Radix UI | Componentes headless accesibles |
| **Estado** | @tanstack/react-query v5 + Zustand | Server state (queries/mutations) + UI state ephemeral |
| **Formularios** | react-hook-form + zod | Validación de formularios tipada |
| **Drag & Drop** | @hello-pangea/dnd | Arrastre de tarjetas Kanban |
| **Animaciones** | framer-motion, three.js | Transiciones UI y elementos 3D |
| **Auth / DB** | Supabase (Auth, PostgreSQL, Storage, Realtime) | Backend completo |
| **i18n** | next-intl v4 | Internacionalización ES/EN |
| **PWA** | @ducanh2912/next-pwa | Service worker, manifest, instalable |
| **Iconos** | lucide-react | Conjunto de iconos SVG |
| **Testing** | vitest + @testing-library/react | Tests unitarios y de componentes |
| **Package Manager** | pnpm | Gestión de dependencias |

---

## 2. Estructura del Proyecto

```
kairo-task/
├── app/                          # App Router (Next.js 16)
│   ├── globals.css               # Estilos globales + variables CSS
│   ├── layout.tsx                # Root layout (ThemeProvider, QueryClient, i18n)
│   ├── not-found.tsx             # Página 404 personalizada
│   ├── sitemap.ts                # Sitemap generado dinámicamente
│   ├── icon.tsx                  # Favicon dinámico
│   ├── (auth)/                   # Route group: páginas públicas de auth
│   │   ├── layout.tsx            # CyberNodesBackground + enlace volver
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/              # Route group: páginas protegidas
│   │   ├── layout.tsx            # Sidebar + TopBar + breadcrumb + search + user menu
│   │   ├── dashboard/page.tsx    # Panel principal
│   │   ├── projects/
│   │   │   ├── page.tsx          # Listado de proyectos
│   │   │   └── [projectId]/
│   │   │       └── page.tsx      # Detalle del proyecto (5 tabs)
│   │   ├── team/page.tsx         # Directorio de equipo
│   │   ├── settings/page.tsx     # Configuración del sistema
│   │   ├── metrics/page.tsx      # Pomodoro
│   │   ├── profile/page.tsx      # Perfil de usuario
│   │   └── console/page.tsx      # Terminal interactivo
│   ├── (landing)/                # Route group: landing page pública
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── (legal)/                  # Route group: páginas legales
│       ├── layout.tsx
│       ├── terms/page.tsx
│       └── privacy/page.tsx
├── components/
│   ├── auth/                     # 6 componentes: AuthCard, LoginForm, RegisterForm, etc.
│   ├── ascii/                    # 3 componentes: MatrixRain, AsciiAnimation, ConsoleEasterEgg
│   ├── console/                  # 1 componente: Terminal
│   ├── custom/                   # 12 componentes de landing page
│   ├── layout/                   # 4 componentes: DashboardSidebar, Breadcrumb, UserMenu, ComingSoon
│   ├── notifications/           # 2 componentes: NotificationBell, NotificationItem
│   ├── pomodoro/                 # 2 componentes: PomodoroTimer, PomodoroStats
│   ├── project/                  # 10 componentes: KanbanBoard, SprintPanel, CalendarView, etc.
│   ├── task/                     # 7 componentes: TaskCard, CreateTaskModal, TaskDetailModal, etc.
│   ├── ui/                       # 13 componentes shadcn: Button, Dialog, Input, Avatar, etc.
│   ├── theme-provider.tsx
│   └── query-provider.tsx
├── hooks/                        # 17 hooks personalizados con TanStack Query
├── store/                        # 3 stores Zustand
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Cliente Supabase browser
│   │   ├── server.ts             # Cliente Supabase server (cookies)
│   │   └── storage.ts            # Helpers para subida de archivos
│   ├── utils.ts                  # Función cn() (clsx + tailwind-merge)
│   └── cookie.ts                 # setCookie helper
├── messages/
│   ├── es.json                   # Traducciones español (~279 keys, 9 namespaces)
│   └── en.json                   # Traducciones inglés
├── supabase/migrations/          # 9 migraciones SQL
├── tests/                        # 3 archivos de test
├── public/                       # Assets, PWA icons, service workers
├── i18n/request.ts               # Configuración de next-intl
├── proxy.ts                      # Proxy de desarrollo
├── architecture/                 # Documentación de arquitectura
├── .agents/                      # Skills y configuración de asistentes AI
├── vitest.config.ts              # Configuración de Vitest
├── next.config.ts                # Configuración de Next.js con PWA + i18n
└── components.json               # Configuración de shadcn/ui
```

### 2.1. Patrón de Organización

- **Route groups** separan dominios lógicos: `(auth)` para no autenticados, `(dashboard)` para autenticados, `(landing)` público, `(legal)` páginas legales.
- **Components** agrupados por dominio funcional (`auth/`, `project/`, `task/`, etc.) no por tipo.
- **Hooks** siguiendo el patrón `use[Recurso].ts` con TanStack Query.
- **Store** exclusivo para estado UI efímero (no persistente).

---

## 3. Base de Datos (Esquema completo)

KairoTask utiliza Supabase (PostgreSQL 15) con 9 migraciones secuenciales y un total de **14 tablas**.

### 3.1. Migración 001 — Projects

```sql
CREATE TABLE projects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  description TEXT,
  status     TEXT NOT NULL DEFAULT 'active'
             CHECK (status IN ('active','review','pending','done')),
  progress   INTEGER NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  color      TEXT NOT NULL DEFAULT '#22C55E',
  owner_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**RLS**: El propietario y los miembros del proyecto pueden leer. Solo el propietario puede escribir/eliminar.

### 3.2. Migración 002 — Tasks

```sql
CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  status      TEXT NOT NULL DEFAULT 'backlog'
              CHECK (status IN ('backlog','in-progress','review','done')),
  priority    TEXT NOT NULL DEFAULT 'medium'
              CHECK (priority IN ('low','medium','high','critical')),
  assignee_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date    DATE,
  tags        TEXT[] DEFAULT '{}',
  created_by  UUID REFERENCES auth.users(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger: actualiza updated_at automáticamente
CREATE TRIGGER tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION moddatetime(updated_at);
```

**Trigger de actividad**: `log_task_activity()` registra en `activity_log` cualquier INSERT/UPDATE en tasks.

### 3.3. Migración 003 — Perfiles y Miembros

```sql
CREATE TABLE profiles (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT,
  full_name  TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ
);

-- Trigger: crea perfil automáticamente al registrarse
CREATE FUNCTION handle_new_user() RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

CREATE TABLE project_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT NOT NULL DEFAULT 'collaborator'
             CHECK (role IN ('owner','collaborator','viewer')),
  UNIQUE(project_id, user_id)
);
```

**Función helper RLS**:

```sql
CREATE FUNCTION is_project_member(proj_id UUID, usr_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM project_members
    WHERE project_id = proj_id AND user_id = usr_id
  );
$$ LANGUAGE sql SECURITY DEFINER;
```

### 3.4. Migración 004 — Comentarios y Actividad

```sql
CREATE TABLE task_comments (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES auth.users(id),
  content    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE activity_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id    UUID REFERENCES tasks(id) ON DELETE SET NULL,
  user_id    UUID REFERENCES auth.users(id),
  action     TEXT NOT NULL,
  metadata   JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Publicaciones Realtime** configuradas para: `tasks`, `project_members`, `task_comments`, `activity_log`.

### 3.5. Migración 005 — Pomodoro

```sql
CREATE TABLE pomodoro_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at         TIMESTAMPTZ,
  duration_minutes INTEGER NOT NULL,
  type             TEXT NOT NULL CHECK (type IN ('focus','break','long_break')),
  completed        BOOLEAN NOT NULL DEFAULT false
);
```

**RLS**: Usuarios solo ven y modifican sus propias sesiones.

### 3.6. Migración 006 — Notificaciones

```sql
CREATE TABLE notification_preferences (
  user_id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email             BOOLEAN DEFAULT true,
  push              BOOLEAN DEFAULT true,
  task_assignment   BOOLEAN DEFAULT true,
  mentions          BOOLEAN DEFAULT true
);

CREATE TABLE notifications (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type       TEXT NOT NULL CHECK (type IN ('task_assigned','comment','mention','deadline')),
  title      TEXT NOT NULL,
  message    TEXT,
  link       TEXT,
  is_read    BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Triggers automáticos**:
- `handle_task_assignment_notification()`: Se dispara cuando `assignee_id` cambia en tasks.
- `handle_comment_notification()`: Se dispara al insertar un comentario en task_comments.
- `handle_new_task_notification()`: Se dispara al insertar una tarea nueva.

### 3.7. Migración 007 — Storage

```sql
-- Buckets creados:
-- 'avatars'    -> público, 2MB, solo imágenes
-- 'task-attachments' -> privado, 10MB, cualquier tipo

CREATE TABLE task_attachments (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id      UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES auth.users(id),
  file_name    TEXT NOT NULL,
  file_size    INTEGER NOT NULL,
  mime_type    TEXT,
  storage_path TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.8. Migración 008 — Sprints, Dependencias, Invitaciones, Campos Personalizados

```sql
-- Sprints
CREATE TABLE sprints (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  goal       TEXT,
  start_date DATE,
  end_date   DATE,
  status     TEXT NOT NULL DEFAULT 'planning'
             CHECK (status IN ('planning','active','completed','cancelled')),
  UNIQUE(name, project_id)
);

CREATE TABLE sprint_tasks (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sprint_id UUID NOT NULL REFERENCES sprints(id) ON DELETE CASCADE,
  task_id   UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  UNIQUE(sprint_id, task_id)
);

-- Dependencias
CREATE TABLE task_dependencies (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id            UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  depends_on_task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  dependency_type    TEXT NOT NULL CHECK (dependency_type IN ('blocks','requires')),
  CHECK (task_id != depends_on_task_id) -- No auto-dependencia
);

-- Invitaciones
CREATE TABLE project_invitations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  invited_email TEXT NOT NULL,
  invited_by    UUID NOT NULL REFERENCES auth.users(id),
  role          TEXT NOT NULL DEFAULT 'collaborator',
  token         TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','accepted','declined','expired')),
  expires_at    TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '7 days')
);

-- Campos personalizados
CREATE TABLE task_custom_fields (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  field_type TEXT NOT NULL CHECK (field_type IN ('text','number','date','select','boolean')),
  options    JSONB DEFAULT '[]',
  required   BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE task_custom_field_values (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id  UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  field_id UUID NOT NULL REFERENCES task_custom_fields(id) ON DELETE CASCADE,
  value    TEXT,
  UNIQUE(task_id, field_id)
);
```

### 3.9. Migración 009 — Webhooks

```sql
CREATE TABLE project_webhooks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  url        TEXT NOT NULL,
  events     TEXT[] NOT NULL DEFAULT '{}',
  is_active  BOOLEAN NOT NULL DEFAULT true,
  secret     TEXT,
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE webhook_queue (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES project_webhooks(id) ON DELETE CASCADE,
  event      TEXT NOT NULL,
  payload    JSONB NOT NULL DEFAULT '{}',
  status     TEXT NOT NULL DEFAULT 'pending'
             CHECK (status IN ('pending','sent','failed')),
  retries    INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.10. Diagrama de Relaciones (Resumen)

```
auth.users
  ├── profiles (1:1)
  ├── project_members (1:N)
  ├── pomodoro_sessions (1:N)
  ├── notification_preferences (1:1)
  ├── notifications (1:N)
  └── project_invitations (1:N)

projects
  ├── tasks (1:N)
  ├── sprints (1:N)
  ├── project_members (1:N)
  ├── activity_log (1:N)
  ├── task_custom_fields (1:N)
  ├── project_webhooks (1:N)
  └── project_invitations (1:N)

tasks
  ├── task_comments (1:N)
  ├── task_attachments (1:N)
  ├── task_dependencies (1:N, bidireccional)
  ├── task_custom_field_values (1:N)
  ├── sprint_tasks (N:M con sprints)
  └── activity_log (1:N)
```

---

## 4. Sistema de Autenticación

### 4.1. Flujo de Auth

KairoTask utiliza **Supabase Auth** como proveedor de autenticación completo.

**Registro** (`RegisterForm.tsx` con `useForm` + zod):
1. Usuario ingresa nombre completo, email y contraseña.
2. `supabase.auth.signUp({ email, password, options: { data: { full_name } } })`.
3. Se envía email de confirmación.
4. El trigger `on_auth_user_created` inserta automáticamente un registro en `profiles`.
5. Redirección a `/login` tras 3 segundos.

**Inicio de sesión** (`LoginForm.tsx`):
1. Usuario ingresa email y contraseña.
2. `supabase.auth.signInWithPassword({ email, password })`.
3. Redirección a `/dashboard` o al `redirectTo` especificado.
4. Humanización de errores: "Credenciales inválidas" → "El email o la contraseña no son correctos."

**Recuperación de contraseña** (`ForgotPasswordForm.tsx`):
1. Usuario ingresa su email.
2. `supabase.auth.resetPasswordForEmail(email, { redirectTo })`.
3. Se envía un enlace de restablecimiento.

**Cierre de sesión**: `supabase.auth.signOut()` → redirección a `/login`.

### 4.2. Clientes Supabase

- **Cliente browser** (`lib/supabase/client.ts`): `createBrowserClient()` — para componentes cliente.
- **Cliente server** (`lib/supabase/server.ts`): `createServerClient()` con manejo de cookies — para server components.
- **Middleware**: No implementado actualmente; la protección de rutas se maneja del lado del cliente.

### 4.3. Seguridad de Contraseñas

El componente `PasswordModal.tsx` implementa:
- **Indicador de fortaleza** con 5 niveles (Muy débil → Muy fuerte).
- **Checklist** en vivo: 8+ caracteres, mayúsculas, minúsculas, números, símbolos.
- **Generador de contraseñas** aleatorias seguras.

---

## 5. Gestión de Estado

KairoTask utiliza una arquitectura de estado híbrida con dos sistemas complementarios:

### 5.1. TanStack Query (Server State)

Todas las interacciones con la base de datos pasan por TanStack Query v5. Cada hook personalizado sigue el patrón:

```typescript
// Patrón típico de un hook
export function useTasks(projectId: string) {
  const supabase = createClient();

  const query = useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const createTask = useMutation({
    mutationFn: async (task: NewTask) => {
      const { data } = await supabase.from("tasks").insert(task).select().single();
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks", projectId] }),
  });

  return { ...query, createTask: createTask.mutateAsync };
}
```

**Cache keys principales**:
| Query Key | Recurso |
|---|---|
| `["projects"]` | Todos los proyectos |
| `["tasks", projectId]` | Tareas de un proyecto |
| `["sprints", projectId]` | Sprints de un proyecto |
| `["members", projectId]` | Miembros de un proyecto |
| `["notifications", userId]` | Notificaciones del usuario |
| `["webhooks"]` | Todos los webhooks |
| `["pomodoro", "today"]` | Sesiones Pomodoro del día |

### 5.2. Zustand (UI Ephemeral State)

Tres stores para estado UI puramente efímero:

| Store | Estado | Acciones |
|---|---|---|
| `useNotificationStore` | `isOpen: boolean` | `open()`, `close()`, `toggle()` |
| `usePomodoroStore` | `phase`, `timeLeft`, `isRunning`, `cycleCount`, `totalFocusToday` | `start()`, `pause()`, `reset()`, `skipBreak()`, `tick()` |
| `useSearchStore` | `isOpen: boolean`, `query: string` | `open()`, `close()`, `toggle()`, `setQuery(q)` |

---

## 6. Arquitectura de Componentes

### 6.1. Patrón de Composición en Modales

Los modales de tareas siguen un patrón de composición en capas:

```
TaskCard (tarjeta) → click → TaskDetailModal (modal completo)
  ├── Form fields (editables)
  ├── CommentsSection
  │   └── CommentItem (x N)
  ├── TaskAttachments
  │   └── AttachmentItem (x N)
  ├── TaskDependenciesPanel
  └── CustomFieldValuesEditor
```

### 6.2. Slide-over Panels

Los paneles deslizables (Activity, Members, Settings en proyecto) siguen un patrón consistente:

```typescript
// Estado de apertura en el componente padre
const [activePanel, setActivePanel] = useState<"activity" | "members" | "settings" | null>(null);

// Render condicional con framer-motion
<AnimatePresence>
  {activePanel === "activity" && (
    <SlideOverPanel onClose={() => setActivePanel(null)}>
      <ActivityFeed projectId={id} />
    </SlideOverPanel>
  )}
</AnimatePresence>
```

### 6.3. KanbanBoard con Drag-and-Drop

Utiliza `@hello-pangea/dnd` (fork mantenido de `react-beautiful-dnd`):

```typescript
<DragDropContext onDragEnd={handleDragEnd}>
  <Droppable droppableId="backlog">
    {(provided) => (
      <div ref={provided.innerRef} {...provided.droppableProps}>
        {tasks.map((task, index) => (
          <Draggable key={task.id} draggableId={task.id} index={index}>
            {(provided) => (
              <TaskCard ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} />
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </div>
    )}
  </Droppable>
</DragDropContext>
```

### 6.4. DashboardSidebar

Sidebar colapsable con diseño responsive:

- **Desktop**: Sidebar fijo a la izquierda, colapsable (íconos solos o íconos + texto).
- **Mobile**: Se transforma en una barra de navegación inferior (bottom nav) con los mismos 6 elementos.
- **Estado activo**: Animación `layoutId` de framer-motion para el indicador de página activa.

### 6.5. Terminal Interactivo

El componente `Terminal.tsx` implementa un emulador de terminal completo:

```typescript
type Command = {
  name: string;
  description: string;
  handler: (args: string[]) => Promise<OutputLine[]> | OutputLine[];
};

const commands: Command[] = [
  { name: "projects", description: "List all projects", handler: listProjects },
  { name: "tasks", description: "Show tasks for a project", handler: showTasks },
  { name: "whoami", description: "Show current user", handler: showUser },
  // ...
];
```

Características: historial de comandos (↑/↓), prompt personalizado, output en tiempo real con datos de Supabase, soporte para `--format json`.

---

## 7. Sistema de Hooks

Total: **17 hooks personalizados**, todos en el directorio `hooks/`.

### 7.1. Hooks de Recursos Principales

| Hook | Query Key | Mutations | Realtime |
|---|---|---|---|
| `useProjects` | `["projects"]` | `createProject`, `deleteProject` | ❌ |
| `useTasks` | `["tasks", projectId]` | `createTask`, `updateTask`, `deleteTask`, `updateTaskStatus` | ✅ |
| `useProjectMembers` | `["members", projectId]` | `addMember`, `updateMemberRole`, `removeMember` | ✅ |
| `useSprints` | `["sprints", projectId]` | `createSprint`, `updateSprint`, `deleteSprint` | ✅ |
| `useTaskComments` | `["comments", taskId]` | `addComment`, `deleteComment` | ✅ |
| `useTaskAttachments` | `["attachments", taskId]` | `createAttachment`, `deleteAttachment` | ❌ |
| `useTaskDependencies` | `["dependencies", taskId]` | `addDependency`, `removeDependency` | ❌ |

### 7.2. Hooks de Funcionalidades Específicas

| Hook | Propósito | Query Key |
|---|---|---|
| `useNotifications` | Notificaciones del usuario | `["notifications", userId]` |
| `useNotificationPreferences` | Preferencias de notificaciones | `["notification-preferences", userId]` |
| `useRealtimeNotifications` | Suscripción en tiempo real a notificaciones | — |
| `useGlobalSearch` | Búsqueda global (proyectos, tareas, miembros) | `["search"]` |
| `useActivityLog` | Registro de actividad por proyecto | `["activity", projectId]` |
| `useGlobalActivity` | Registro de actividad global | `["global-activity"]` |
| `usePomodoroSessions` | Sesiones Pomodoro del día | `["pomodoro", "today"]` |
| `useBurndown` | Datos de burndown chart por sprint | `["burndown", sprintId]` |
| `useCustomFields` | Campos personalizados del proyecto | `["custom-fields", projectId]` |
| `useInvitations` | Invitaciones de proyecto | `["invitations", projectId]` |
| `useWebhooks` | Webhooks del sistema | `["webhooks"]` |

### 7.3. Patrón de Realtime

Los hooks que requieren actualizaciones en tiempo real siguen este patrón:

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`tasks:${projectId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "tasks", filter: `project_id=eq.${projectId}` },
      () => queryClient.invalidateQueries({ queryKey: ["tasks", projectId] })
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [projectId]);
```

---

## 8. Sistema de i18n

### 8.1. Configuración

KairoTask utiliza `next-intl` v4 con detección de idioma basada en cookies (sin prefijo en la URL).

**Configuración** (`i18n/request.ts`):
```typescript
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = await requestLocale ?? "es";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
```

**Detectores de idioma soportados** (en orden de prioridad):
1. Cookie `NEXT_LOCALE` (seteada por LanguageSwitcher).
2. Preferencia del navegador (Accept-Language).
3. Valor por defecto: `es`.

**Uso en Server Components** (Root Layout):
```typescript
const locale = await cookies().get("NEXT_LOCALE")?.value ?? "es";
```

**Uso en Client Components**:
```typescript
const t = useTranslations("namespace");
// t("key")
// t("key", { count: 5 })  // para pluralización
```

### 8.2. Namespaces

| Namespace | Keys | Propósito |
|---|---|---|
| `common` | 15 | Botones y textos genéricos (loading, save, cancel, delete) |
| `nav` | 6 | Navegación del sidebar (dashboard, projects, team, pomodoro, console, settings) |
| `dashboard` | 8 | Dashboard principal |
| `projects` | 22 | Listado de proyectos (incluye status anidados) |
| `project` | ~40 | Detalle del proyecto, tabs, miembros, ajustes |
| `team` | ~15 | Página de equipo, roles, búsqueda |
| `settings` | ~30 | Configuración del sistema, webhooks, apariencia |
| `profile` | ~15 | Perfil de usuario, avatar, datos de cuenta |
| `pomodoro` | 2 | Título y subtítulo |

**Total**: ~279 keys por archivo de idioma.

### 8.3. LanguageSwitcher

El componente `LanguageSwitcher.tsx`:
1. Muestra un icono de globo en la barra superior del Dashboard.
2. Al hacer clic, alterna entre `es` y `en`.
3. Setea la cookie `NEXT_LOCALE` con el nuevo valor.
4. Ejecuta `router.refresh()` para re-renderizar el layout con el nuevo idioma.

```typescript
function toggleLocale() {
  const next = currentLocale === "es" ? "en" : "es";
  setCookie("NEXT_LOCALE", next);
  router.refresh();
}
```

---

## 9. Sistema de Estilos

### 9.1. Arquitectura CSS

KairoTask usa **Tailwind CSS v4** con un sistema de variables CSS de tres capas:

**Capa 1 — Variables shadcn** (en `globals.css`):
```css
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  /* ... ~30 variables más para componentes shadcn */
}

.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  /* ... versión oscura */
}
```

**Capa 2 — Dashboard palette** (variables `--dash-*`):
```css
.dark {
  --dash-bg: #000000;
  --dash-surface: #09090B;
  --dash-surface-hover: rgba(255,255,255,0.04);
  --dash-border: rgba(255,255,255,0.10);
  --dash-text: #f8fafc;
  --dash-text-muted: #475569;
  --dash-accent: #22C55E;
}
```

**Capa 3 — Tema forzado**: El app fuerza `dark` por defecto en el `<html>`. Modo claro es opt-in mediante `localStorage`.

### 9.2. Tipografía

- **Geist Sans** (Vercel): Fuente principal para textos y títulos.
- **Geist Mono**: Fuente monoespaciada para código, terminal y datos técnicos.
- **shadcn/ui New York style**: Radio de borde `radius: 0.5rem` para consistencia visual.

### 9.3. Animaciones

- **framer-motion**: Transiciones de páginas, animaciones de elementos al montarse, `layoutId` para indicadores activos, variantes con `staggerChildren`.
- **tw-animate-css**: Utilidades de animación Tailwind.
- **three.js** (solo landing): Elementos 3D interactivos.

---

## 10. PWA (Progressive Web App)

### 10.1. Configuración

KairoTask utiliza `@ducanh2912/next-pwa` para generar el service worker automáticamente.

**Configuración** (`next.config.ts`):
```typescript
import withPWA from "@ducanh2912/next-pwa";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig = {
  // ... otras configuraciones
};

export default withNextIntl(withPWA({ dest: "public", disable: process.env.NODE_ENV === "development" })(nextConfig));
```

### 10.2. Assets PWA

| Archivo | Propósito |
|---|---|
| `public/manifest.json` | Manifest de aplicación web |
| `public/icon-192x192.png` | Icono para instalación |
| `public/icon-512x512.png` | Icono de alta resolución |
| `public/sw.js` | Service worker generado |
| `public/workbox-*.js` | Librería Workbox para caching |

### 10.3. Características

- Instalable en dispositivos móviles y desktop.
- Cacheo offline de assets estáticos.
- Actualización automática del service worker.

---

## 11. Suscripciones en Tiempo Real

### 11.1. Canales de Supabase Realtime

| Tabla | Canales | Uso |
|---|---|---|
| `tasks` | `tasks:{projectId}` | Actualizar Kanban en tiempo real |
| `task_comments` | `comments:{taskId}` | Nuevos comentarios sin recargar |
| `notifications` | `notifications:{userId}` | Campana de notificaciones actualizada |
| `activity_log` | `activity:{projectId}`, `global-activity` | Feeds de actividad |
| `project_members` | `members:{projectId}` | Cambios en miembros del proyecto |
| `sprints` | `sprints:{projectId}` | Cambios en sprints |

### 11.2. Patrón de Implementación

```typescript
useEffect(() => {
  const channel = supabase
    .channel(`custom:${table}:${filter}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table, filter },
      () => queryClient.invalidateQueries({ queryKey })
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, [dependencies]);
```

Cada hook se suscribe a su canal correspondiente y, al recibir un cambio, invalida la caché de TanStack Query para que se refetcheen los datos automáticamente.

---

## 12. Pruebas (Testing)

### 12.1. Configuración

**Framework**: Vitest v4 + @testing-library/react + @testing-library/jest-dom

**Configuración** (`vitest.config.ts`):
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

**Setup** (`tests/setup.ts`):
```typescript
import "@testing-library/jest-dom/vitest";
```

### 12.2. Tests Existentes

| Archivo | Tests | Tipo | Descripción |
|---|---|---|---|
| `tests/hooks/useBurndown.test.ts` | 4 | Unitario | Prueba funciones puras: `toDateStr`, `eachDay`, `normalizeDate` |
| `tests/components/CalendarView.test.tsx` | 2 | Componente | Renderiza encabezado del mes y días de la semana |
| `tests/components/GanttChart.test.tsx` | 2 | Componente | Renderiza nombres de tareas y encabezado de línea de tiempo |

**Total**: 3 archivos, 8 tests, todos pasando.

### 12.3. Patrón de Mocking

Los tests de componentes utilizan `vi.mock()` para simular hooks:

```typescript
// tests/components/CalendarView.test.tsx
vi.mock("@/hooks/useTasks", () => ({
  useTasks: () => ({
    data: [
      { id: "1", title: "Task A", due_date: "2026-06-15", priority: "high", status: "backlog" },
    ],
    isLoading: false,
  }),
}));
```

### 12.4. Cómo Ejecutar los Tests

```bash
# Una vez (CI)
pnpm test:run

# Modo watch (desarrollo)
pnpm test
```

### 12.5. Cobertura y Mejores Prácticas

- Los tests se enfocan en **componentes puros** y **funciones de utilidad**.
- Los hooks con side effects (llamadas a Supabase) se mockean completamente.
- Se recomienda usar `data-testid` para selectores en lugar de clases CSS.
- Los tests nuevos deben seguir el patrón: `tests/{type}/{name}.test.{ts,tsx}`.

---

## 13. Seguridad y RLS

### 13.1. Políticas Row-Level Security (RLS)

Todas las tablas tienen RLS habilitado. Las políticas principales son:

**projects**:
```sql
-- SELECT: propietario o miembro del proyecto
CREATE POLICY "project_select" ON projects FOR SELECT
  USING (owner_id = auth.uid() OR is_project_member(id, auth.uid()));

-- INSERT: cualquier usuario autenticado
CREATE POLICY "project_insert" ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- UPDATE/DELETE: solo propietario
CREATE POLICY "project_update" ON projects FOR UPDATE
  USING (owner_id = auth.uid());
```

**tasks**:
```sql
-- SELECT/INSERT/UPDATE: miembros del proyecto
CREATE POLICY "task_access" ON tasks FOR ALL
  USING (is_project_member(project_id, auth.uid()));
```

**pomodoro_sessions**:
```sql
-- Solo el propio usuario
CREATE POLICY "pomodoro_self" ON pomodoro_sessions FOR ALL
  USING (user_id = auth.uid());
```

### 13.2. Almacenamiento (Storage)

**Bucket `avatars`** (público):
```sql
-- SELECT: cualquier persona (para mostrar avatares)
-- INSERT: usuario autenticado, solo en carpeta con su UID
-- UPDATE: solo el dueño del archivo
```

**Bucket `task-attachments`** (privado):
```sql
-- SELECT/INSERT: miembros del proyecto asociado a la tarea
-- DELETE: solo quien subió el archivo o propietario del proyecto
```

### 13.3. Otras Medidas de Seguridad

- **Tokens de invitación**: Generados con `gen_random_bytes(16)` → 32 caracteres hex, únicos y no adivinables.
- **Auto-dependencia**: CHECK constraint `(task_id != depends_on_task_id)` previene dependencias circulares de un solo nivel.
- **Validación con Zod**: Todos los formularios validan datos client-side antes de enviar al servidor.
- **UUIDs**: Todos los IDs primarios son UUIDs generados por la base de datos.

---

## 14. Almacenamiento de Archivos

### 14.1. Supabase Storage

Dos buckets configurados:

| Bucket | Visibilidad | Límite | Tipos | Uso |
|---|---|---|---|---|
| `avatars` | Público | 2 MB | Imágenes (JPEG, PNG, WebP) | Fotos de perfil |
| `task-attachments` | Privado | 10 MB | Cualquier tipo | Archivos adjuntos a tareas |

### 14.2. API de Subida

```typescript
// lib/supabase/storage.ts
export async function uploadAvatar(file: File, userId: string) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/avatar.${ext}`;
  const { data, error } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  return publicUrl;
}
```

---

## 15. Despliegue

### 15.1. Build y Verificación

```bash
# Instalar dependencias
pnpm install

# Compilación
pnpm build

# Verificación de tipos
pnpm typecheck

# Linter
pnpm lint

# Tests
pnpm test:run
```

### 15.2. Variables de Entorno Requeridas

```
NEXT_PUBLIC_SUPABASE_URL=<url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<key>
NEXT_PUBLIC_SITE_URL=<url>
```

### 15.3. Plataforma de Despliegue

KairoTask está diseñado para desplegarse en **Vercel** con configuración Next.js estándar.

### 15.4. Base de Datos

Las migraciones se ejecutan manualmente o mediante herramientas como `supabase migration up`. El esquema completo se encuentra en `supabase/migrations/`.

---

## Apéndice A: Comandos Útiles

```bash
# Desarrollo
pnpm dev          # Inicia servidor de desarrollo
pnpm dev --webpack # Desarrollo con webpack (más estable que Turbopack)

# Build
pnpm build         # Compilación de producción
pnpm build --webpack # Compilación con webpack

# Verificación
pnpm lint          # ESLint
pnpm typecheck     # TypeScript
pnpm test:run      # Tests unitarios

# Dependencias
pnpm add <pkg>     # Añadir dependencia
pnpm update        # Actualizar dependencias
```

---

## Apéndice B: Migraciones SQL

Las migraciones se numeran secuencialmente:

| Archivo | Tablas creadas |
|---|---|
| `001_projects.sql` | `projects` |
| `002_tasks.sql` | `tasks` |
| `003_team.sql` | `profiles`, `project_members`, `handle_new_user()` |
| `004_activity.sql` | `task_comments`, `activity_log` |
| `005_pomodoro.sql` | `pomodoro_sessions` |
| `006_notifications.sql` | `notification_preferences`, `notifications` |
| `007_storage.sql` | Buckets + `task_attachments` |
| `008_complete.sql` | `sprints`, `sprint_tasks`, `task_dependencies`, `project_invitations`, `task_custom_fields`, `task_custom_field_values` |
| `009_webhooks.sql` | `project_webhooks`, `webhook_queue` |

---

*Documentación técnica generada para el sistema KairoTask v1.0.0 — Plataforma de gestión de proyectos ágil con enfoque dev-centric.*
