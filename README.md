# ⏳ KairoTask

```text
  _  __    _          _______        _
 | |/ /   (_)        |__   __|      | |
 | ' /__ _ _ _ __ ___   | | __ _ ___| | __
 |  // _` | | '__/ _ \  | |/ _` / __| |/ /
 | . \ (_| | | | | (_) | | | (_| \__ \   <
 |_|\_\__,_|_|_|  \___/  |_|\__,_|___/_|\_\
```

> Plataforma Colaborativa para Gestión Ágil de Proyectos y Tareas

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=for-the-badge&logo=pwa)
![TanStack Query](https://img.shields.io/badge/State-TanStack%20Query-FF4154?style=for-the-badge&logo=reactquery)
![framer-motion](https://img.shields.io/badge/Animations-framer--motion-0055FF?style=for-the-badge&logo=framer)
![Status](https://img.shields.io/badge/status-En%20desarrollo-yellow?style=for-the-badge)

---

## 📌 Descripción

**KairoTask** es una plataforma colaborativa para gestión ágil de proyectos con enfoque dev-centric. Integra Kanban, Pomodoro, notificaciones en tiempo real, terminal interactiva y una experiencia visual inmersiva con animaciones ASCII y Matrix Rain.

---

## 🎯 Objetivo General

Desarrollar una plataforma colaborativa que facilite la gestión eficiente de proyectos y tareas, mejorando la comunicación y el seguimiento del progreso en equipos de trabajo.

---

## 🚀 Características Principales

- **Kanban Drag & Drop:** Tablero con 4 columnas (Backlog, In Progress, Review, Done) con @hello-pangea/dnd
- **Gestión de Proyectos:** CRUD completo con filtros, búsqueda y estadísticas
- **Roles de Equipo:** owner, collaborator, viewer con permisos granulares
- **Pomodoro Timer:** Sesiones de enfoque/descanso con tracking en Supabase
- **Notificaciones en Tiempo Real:** Sistema de notificaciones vía Supabase Realtime con trigger functions
- **Búsqueda Global:** Cmd+K con búsqueda en proyectos, tareas y miembros
- **Terminal Interactiva:** Consola embebida con comandos para explorar el proyecto
- **File Attachments:** Subida y descarga de archivos en tareas via Supabase Storage
- **Avatar Upload:** Foto de perfil con drag-and-drop y preview
- **Animaciones ASCII:** Matrix Rain, console.log banner, página 404 animada
- **PWA:** Instalable en móvil y desktop
- **Auth Completa:** Login, registro, recuperación de contraseña, magic links

---

## 🛠️ Stack Tecnológico

### Frontend & UI/UX

- **Framework:** Next.js 16 (App Router)
- **UI Components:** radix-ui + shadcn + Tailwind CSS v4
- **Animaciones:** framer-motion
- **Estado Cliente:** Zustand
- **Estado Servidor:** @tanstack/react-query
- **Íconos:** lucide-react
- **Formularios:** react-hook-form + zod
- **Drag & Drop:** @hello-pangea/dnd
- **3D (Landing):** three.js
- **PWA:** @ducanh2912/next-pwa

### Backend & DB

- **BaaS:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Despliegue:** Vercel

### Herramientas de Desarrollo

- **IA:** GitHub Copilot, skills de agente

---

## 📁 Estructura del Proyecto

```text
kairo-task/
│
├── app/
│ ├── (landing)/        # Landing page
│ ├── (auth)/           # Login, registro, forgot-password
│ ├── (dashboard)/      # Dashboard principal
│ │ ├── projects/       # Lista de proyectos + Kanban
│ │ ├── team/           # Directorio de equipo
│ │ ├── profile/        # Perfil de usuario
│ │ ├── settings/       # Configuración y preferencias
│ │ ├── metrics/        # Pomodoro stats
│ │ └── console/        # Terminal interactiva
│ └── (legal)/          # Términos, privacidad
│
├── components/
│ ├── ui/               # Componentes base (shadcn-style)
│ ├── auth/             # Formularios de autenticación
│ ├── layout/           # Sidebar, breadcrumbs, UserMenu
│ ├── project/          # KanbanBoard, ActivityFeed
│ ├── task/             # TaskCard, TaskDetailModal, CommentsSection
│ ├── notifications/    # NotificationBell, NotificationItem
│ ├── search/           # GlobalSearchModal
│ ├── pomodoro/         # PomodoroTimer, PomodoroStats
│ ├── console/          # Terminal emulator
│ ├── ascii/            # MatrixRain, AsciiAnimation, ConsoleEasterEgg
│ └── custom/           # Landing page components
│
├── hooks/              # TanStack Query hooks
│ ├── useProjects.ts
│ ├── useTasks.ts
│ ├── useProjectMembers.ts
│ ├── useTaskComments.ts
│ ├── useNotifications.ts
│ ├── useNotificationPreferences.ts
│ ├── usePomodoroSessions.ts
│ ├── useTaskAttachments.ts
│ ├── useGlobalSearch.ts
│ └── useActivityLog.ts
│
├── store/              # Zustand stores
│ ├── useNotificationStore.ts
│ ├── usePomodoroStore.ts
│ └── useSearchStore.ts
│
├── lib/
│ ├── supabase/
│ │ ├── client.ts       # Browser client
│ │ ├── server.ts       # Server client
│ │ └── storage.ts      # File upload helpers
│ └── utils.ts           # cn() utility
│
├── supabase/migrations/ # 7 migraciones SQL
├── middleware.ts         # Auth middleware (protege rutas del dashboard)
└── proxy.ts
```

---

## 🔄 Flujo de Trabajo (Git Workflow)

### 🌳 Estructura de Ramas

| Rama          | Propósito                                       |
| :------------ | :---------------------------------------------- |
| `main`        | Rama principal (producción estable)             |
| `dev`         | Rama de integración                             |
| `feature/***` | Nuevas funcionalidades                          |

### 🔒 Flujo para Nuevas Funcionalidades

```bash
git checkout dev && git pull origin dev
git checkout -b feature/mi-feature
# ... desarrollar ...
git add . && git commit -m "feat: descripcion"
git push origin feature/mi-feature
# Crear PR en GitHub hacia dev
```

Convención de commits: `feat:`, `fix:`, `refactor:`, `docs:`, `style:`, `chore:`

---

## 📦 Instalación y Uso

1. **Clonar e instalar:**
   ```bash
   git clone https://github.com/Danielsteve18/KairoTask.git
   cd KairoTask
   pnpm install
   ```

2. **Configurar variables de entorno:**
   Renombra `.env.example` a `.env.local` y añade las credenciales de Supabase.

3. **Iniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

---

## 🧪 Usuario de Pruebas

| Campo       | Valor                  |
| :---------- | :--------------------- |
| **Email**   | `test@kairotask.dev`   |
| **Password**| `Test1234!`            |
| **Rol**     | `user` (autenticado)   |

---

## 👥 Equipo de Desarrollo (Universidad Del Pacífico)

- **Daniel Steve Montaño** - _Full-stack Developer & Arquitectura_
- **Luisa Fernanda Lucio** - _Desarrollo / QA_
- **Didier Andres Congo** - _QA & Automatización_

**Asesor:** Daniel Bustos

---

Construido con dedicación, café, y un enfoque "AI-Driven".
