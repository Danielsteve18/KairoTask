# KairoTask

Plataforma Colaborativa para Gestión Ágil de Proyectos con enfoque **dev-centric**.

---

## Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Next.js (App Router) | 16.1.6 |
| **UI** | React + TypeScript (strict) + Tailwind CSS v4 | 19.2.3 / ^5 |
| **Componentes** | shadcn/ui (New York) + Radix UI | ^1.4.3 |
| **Estado cliente** | Zustand | ^5.0.14 |
| **Estado servidor** | @tanstack/react-query | ^5.101.0 |
| **Formularios** | react-hook-form + zod | ^7.71.2 / ^4.3.6 |
| **BaaS** | Supabase (Auth, PostgreSQL, Realtime, Storage) | ^2.97.0 |
| **Drag & Drop** | @hello-pangea/dnd | ^18.0.1 |
| **Animaciones** | framer-motion | ^12.40.0 |
| **PWA** | Nativo (Next.js 16) | - |
| **i18n** | next-intl | ^4.13.0 |
| **Testing** | Vitest + @testing-library/react + jsdom | ^4.1.10 |
| **Package Manager** | pnpm | 10.33.2 |

---

## Arquitectura

### Frontend (Next.js App Router)

```
app/
├── (landing)/         # Página principal (pública)
├── (auth)/            # Login, registro, forgot-password
├── (dashboard)/       # Dashboard protegido (requiere auth)
│   ├── dashboard/     # Página principal del dashboard
│   ├── projects/      # Lista de proyectos
│   ├── projects/[projectId]/  # Detalle: kanban, sprints, calendar, gantt, analytics
│   ├── team/          # Directorio del equipo
│   ├── metrics/       # Pomodoro timer + stats
│   ├── profile/       # Perfil de usuario
│   ├── settings/      # Configuración
│   └── console/       # Terminal interactiva
└── (legal)/           # Términos, privacidad
```

### Backend (Supabase)

- **Autenticación**: email/password, confirmación de email, magic links
- **Base de datos**: PostgreSQL 15 con 18 tablas
- **Realtime**: WebSocket vía `postgres_changes` (14 tablas publicadas)
- **Storage**: Avatares (público) y adjuntos de tareas (privado, URLs firmadas)
- **RLS**: Row-Level Security en todas las tablas

### Middleware (proxy.ts)

Migrado a Next.js 16 (`proxy.ts`). Protege rutas del dashboard redirigiendo a `/login` si no hay sesión. Redirige usuarios autenticados desde páginas de auth al dashboard.

---

## Modelo de Datos (18 tablas)

### Core
- **projects** — id, name, description, status, progress, color, owner_id
- **tasks** — id, project_id, title, description, status, priority, assignee_id, due_date, tags
- **profiles** — id, email, full_name, avatar_url (auto-creación en registro)
- **project_members** — id, project_id, user_id, role (owner/collaborator/viewer)

### Actividad
- **task_comments** — Comentarios en tareas
- **activity_log** — Log de acciones (trigger en tasks)
- **task_attachments** — Archivos adjuntos (storage path, mime, size)

### Productividad
- **pomodoro_sessions** — Sesiones focus/break/long_break
- **sprints** — Planificación ágil
- **sprint_tasks** — Asignación tareas a sprints
- **task_dependencies** — Dependencias entre tareas (blocks/requires)

### Notificaciones
- **notifications** — Notificaciones por usuario (task_assigned, comment, mention, deadline)
- **notification_preferences** — Preferencias de notificación por usuario

### Avanzadas
- **project_invitations** — Invitaciones a proyectos (token hex 32 chars)
- **task_custom_fields** — Campos personalizados por proyecto
- **task_custom_field_values** — Valores de campos personalizados
- **project_webhooks** — Webhooks por proyecto
- **webhook_queue** — Cola de eventos webhook

---

## Estado Global (Hybrid)

| Tipo | Librería | Uso |
|------|----------|-----|
| **Server State** | TanStack Query (17 hooks) | CRUD + realtime + optimistic updates |
| **UI State** | Zustand (3 stores) | Search modal, Pomodoro timer, Notification panel |
| **i18n** | next-intl | Cookie-based ES/EN |
| **Tema** | ThemeProvider | Dark/light mode con shadcn |

---

## Variables de Entorno

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | API key pública (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side) |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio (default: `http://localhost:3000`) |

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `pnpm dev` | Servidor de desarrollo (Turbopack) |
| `pnpm build` | Build producción |
| `pnpm start` | Servidor producción |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript --noEmit |
| `pnpm test` | Vitest (watch) |
| `pnpm test:run` | Vitest (CI) |

---

## Problemas Corregidos

### ✅ Tests funcionando
Se instalaron `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom`. Ahora `pnpm test:run` funciona (8 tests pasan).

### ✅ Build con Turbopack
Se eliminó `@ducanh2912/next-pwa` (incompatible con Next.js 16). Se quitó el flag `--webpack`. Ahora usa Turbopack nativo.

### ✅ PWA Nativo
Next.js 16 incluye PWA experimental. El manifest y service worker existentes en `public/` se usan sin plugin externo.

### ✅ Middleware → Proxy
Next.js 16 deprecó `middleware.ts` en favor de `proxy.ts`. Se migró y renombró el archivo.

### ✅ React Hooks Errors
Se corrigieron `setState` en `useEffect` en `LoginForm.tsx` y `confirmed/page.tsx` (cascading renders).

### ✅ React Compiler Warning
Se reemplazó `watch()` de react-hook-form por estado local en `RegisterForm.tsx`.

### ✅ ESLint
Se excluyeron `.claude/` y `.agents/` del lint. Se corrigieron missing deps en hooks.

### ✅ Modo Prueba
Botón "Modo Prueba (demo)" en la pantalla de login que ingresa con credenciales demo.

---

## Problemas Restantes (Pendientes)

### 🔴 Producción
1. **Sin seed data** — No hay scripts para poblar datos de prueba en la BD
2. **Sin monitoreo** — No hay Sentry, logging estructurado ni health checks
3. **Cobertura de tests baja** — Solo 8 tests, 0 de integración/E2E
4. **Sin manejo de errores global** — No hay ErrorBoundary en rutas del dashboard
5. **Sin carga lazy** — Todos los componentes se cargan al inicio

### 🟡 Calidad
1. **33 warnings de ESLint** — Variables sin usar (no críticos pero ruido)
2. **Missing alt text** — Algunas imágenes sin `alt`
3. **Sin CI/CD completo** — Tests no se ejecutan en CI
4. **Dependencias deprecadas** — `glob@7`, `inflight@1` en subdependencias

### 🟢 UX/UI
1. **Sin estados vacíos** — Muchos componentes no muestran "no data"
2. **Sin skeleton loading** — Aunque algunos hooks exponen `isLoading`
3. **Sin pruebas de accesibilidad** — Teclado, screen readers

---

## Usuario de Pruebas

| Campo | Valor |
|-------|-------|
| Email | `test@kairotask.dev` |
| Password | `Test1234!` |

---

## Cómo Empezar

```bash
git clone https://github.com/Danielsteve18/KairoTask.git
cd KairoTask
pnpm install
# Copiar .env.example a .env.local y rellenar Supabase credentials
pnpm dev
```

---

## Notas para el Experto

Puntos críticos que requieren atención profesional:

1. **Autenticación y sesiones** — Revisar el flujo de refresh de cookies en `proxy.ts`. Posibles bugs con tokens expirados en producción por el manejo de cookies de Supabase SSR.

2. **Realtime channels** — Los hooks crean channels con `useId()` que cambia en cada render. Aunque está memoizado, el patrón de cleanup es frágil. Posibles memory leaks.

3. **Optimistic updates** — `useTasks.ts` tiene rollback en error, pero las mutaciones concurrentes pueden causar race conditions. Revisar con TanStack Query Devtools.

4. **RLS Policies** — Las migraciones SQL tienen RLS, pero no hay tests automatizados para verificar que los roles y permisos funcionan correctamente en edge cases.

5. **Turbopack + shadcn** — Tailwind v4 con Turbopack puede tener issues de HMR en modo desarrollo al modificar CSS variables de shadcn.

6. **PWA service worker** — Al migrar de `@ducanh2912/next-pwa` a PWA nativo, el `sw.js` generado anteriormente puede causar caché stale en producción. Se debe regenerar.

7. **Error en `router.refresh()`** — Next.js 16 cambió el comportamiento de `router.refresh()`. Puede causar doble render o pérdida de estado en Server Components.

---

## Equipo de Desarrollo (Universidad Del Pacífico)

- **Daniel Steve Montaño** — Full-stack Developer & Arquitectura
- **Luisa Fernanda Lucio** — Desarrollo / QA
- **Didier Andres Congo** — QA & Automatización

**Asesor:** Daniel Bustos
