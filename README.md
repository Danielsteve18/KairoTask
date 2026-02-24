# 🚀 KairoTask

> Plataforma colaborativa para la gestión ágil de proyectos y tareas en entornos universitarios y equipos pequeños.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![ShadCN](https://img.shields.io/badge/UI-ShadCN-000)
![Status](https://img.shields.io/badge/status-En%20desarrollo-yellow)

---

## 📌 Descripción

**KairoTask** es una plataforma web moderna diseñada para optimizar la gestión de proyectos y tareas mediante un entorno colaborativo intuitivo.

Surge como solución a problemas comunes en equipos académicos y pequeños grupos de trabajo:

- Desorganización de tareas  
- Falta de seguimiento  
- Comunicación deficiente  
- Retrasos en entregas  
- Baja trazabilidad  

KairoTask mejora la eficiencia mediante asignación clara de responsabilidades, notificaciones en tiempo real y seguimiento del progreso.

---

## 🎯 Objetivo General

Desarrollar una plataforma colaborativa intuitiva y ágil que facilite la gestión eficiente de proyectos y tareas, mejorando la comunicación y el seguimiento del progreso en equipos de trabajo.

---

## 🛠️ Stack Tecnológico
# 🚀 KairoTask

> Plataforma colaborativa para la gestión ágil de proyectos y tareas en entornos universitarios y equipos pequeños.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Supabase](https://img.shields.io/badge/Backend-Supabase-3ECF8E)
![ShadCN](https://img.shields.io/badge/UI-ShadCN-000)
![Status](https://img.shields.io/badge/status-En%20desarrollo-yellow)

---

## 📌 Descripción

**KairoTask** es una plataforma web moderna diseñada para optimizar la gestión colaborativa de proyectos y tareas.

Permite:

- ✔ Crear y administrar proyectos  
- ✔ Asignar tareas a miembros  
- ✔ Seguimiento en tiempo real  
- ✔ Notificaciones automáticas  
- ✔ Comentarios y trazabilidad  
- ✔ Gestión segura de usuarios  

Construido con una arquitectura moderna basada en **Next.js + Supabase**.

---

## 🛠️ Stack Tecnológico

- **Next.js (App Router)**
- **TypeScript**
- **ShadCN UI**
- **TailwindCSS**
- **Supabase**
  - PostgreSQL
  - Auth
  - Realtime
  - Row Level Security (RLS)

---

## 🏗️ Arquitectura

El proyecto sigue una arquitectura moderna fullstack:

- Frontend con Server & Client Components
- Backend gestionado por Supabase
- Autenticación segura con Supabase Auth
- Realtime con Supabase Channels
- Seguridad mediante Row Level Security (RLS)

---

## 📁 Estructura Profesional de Carpetas

- **Next.js (App Router)**
- **TypeScript**
- **ShadCN UI**
- **TailwindCSS**
- **Prisma ORM**
- **SupabaseSQL**
- **NextAuth**
- **WebSockets / Realtime Notifications**

---

## 🏗️ Arquitectura

El proyecto sigue un enfoque híbrido:

- Modelo estructurado por fases (planificación)
- Desarrollo incremental
- Principios ágiles
- Separación por dominios
- Arquitectura escalable

---

## 📁 Estructura Profesional de Carpetas
kairo-task/
│
├── public/
│
├── src/
│ ├── app/
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ ├── register/
│ │ │ └── forgot-password/
│ │ │
│ │ ├── dashboard/
│ │ │ ├── projects/
│ │ │ │ ├── [projectId]/
│ │ │ │ │ ├── tasks/
│ │ │ │ │ └── page.tsx
│ │ │ │ └── page.tsx
│ │ │ └── layout.tsx
│ │ │
│ │ ├── api/ (opcional para lógica adicional)
│ │ │
│ │ ├── layout.tsx
│ │ └── page.tsx
│ │
│ ├── components/
│ │ ├── ui/
│ │ ├── layout/
│ │ ├── project/
│ │ ├── task/
│ │ └── notifications/
│ │
│ ├── lib/
│ │ ├── supabaseClient.ts
│ │ ├── supabaseServer.ts
│ │ └── utils.ts
│ │
│ ├── hooks/
│ │ ├── useProjects.ts
│ │ ├── useTasks.ts
│ │ └── useRealtime.ts
│ │
│ ├── services/
│ │ ├── project.service.ts
│ │ ├── task.service.ts
│ │ └── notification.service.ts
│ │
│ ├── types/
│ │ ├── database.types.ts
│ │ ├── project.types.ts
│ │ └── task.types.ts
│ │
│ └── middleware.ts
│
├── .env.example
├── next.config.js
├── tsconfig.json
└── package.json
---

# 🔄 Flujo de Trabajo (Git Workflow)

Para garantizar estabilidad, organización y control de calidad, KairoTask utiliza un flujo de trabajo basado en ramas protegidas y Pull Requests.

---

## 🌳 Estructura de Ramas

| Rama           | Propósito                               |
| :------------- | :-------------------------------------- |
| `main`         | Rama principal (protegida, producción estable) |
| `dev`          | Rama de integración (opcional pero recomendada) |
| `feature/***`  | Nuevas funcionalidades                  |
| `fix/***`      | Corrección de errores                   |
| `hotfix/***`   | Correcciones urgentes en producción     |

---

## 🔒 Protección de la Rama `main`

La rama `main` está protegida mediante reglas de GitHub, lo que asegura la **estabilidad**, **trazabilidad** y **control de cambios**. Las reglas implementadas son:

- ❌ No se permiten `pushes` directos.
- ✅ Se requiere un **Pull Request** para hacer `merge`.
- ✅ Se requiere al menos **1 aprobación** de un revisor.
- ✅ Se bloquean los `force pushes`.
- ✅ Se requiere la **resolución de todas las conversaciones** antes de realizar el `merge`.
- ✅ Se exige un **historial lineal** (sin `merge commits` que no sean `squash and merge`).

---

# 🚀 Flujo Completo para Nuevas Funcionalidades

El siguiente flujo de trabajo detalla los pasos para desarrollar y desplegar nuevas funcionalidades de manera controlada:

## 1️⃣ Actualizar la rama principal

Antes de iniciar cualquier desarrollo, es crucial asegurarse de trabajar con la versión más reciente de la rama `main`:

```bash
git checkout main
git pull origin main
```

## 2️⃣ Crear una nueva rama de trabajo

Todas las nuevas funcionalidades deben desarrollarse en una rama independiente, siguiendo la convención `feature/nombre-funcionalidad`:

```bash
git checkout -b feature/nombre-funcionalidad
```

**Ejemplo:**

```bash
git checkout -b feature/sistema-notificaciones
```

## 3️⃣ Desarrollar la funcionalidad

Trabaja en el código de la nueva funcionalidad. Puedes verificar el estado de tus cambios en cualquier momento con:

```bash
git status
```

## 4️⃣ Agregar cambios al `staging`

Una vez que los cambios estén listos para ser confirmados, agrégalos al área de `staging`:

```bash
git add .
```

O, si prefieres agregar archivos específicos:

```bash
git add src/components/Notification.tsx
```

## 5️⃣ Crear un `commit` con mensaje profesional

Se recomienda seguir una convención de mensajes de `commit` para mantener un historial claro y descriptivo. Algunas convenciones comunes incluyen:

- `feat:` Para nuevas funcionalidades.
- `fix:` Para correcciones de errores.
- `refactor:` Para mejoras internas del código.
- `docs:` Para cambios en la documentación.
- `style:` Para cambios visuales o de formato.
- `chore:` Para tareas internas o de mantenimiento.

**Ejemplo:**

```bash
git commit -m "feat: agregar sistema de notificaciones en tiempo real"
```

## 6️⃣ Subir la rama al repositorio remoto

Una vez que los cambios han sido confirmados localmente, sube tu rama al repositorio remoto:

```bash
git push origin feature/nombre-funcionalidad
```

## 7️⃣ Crear un Pull Request

Desde la interfaz de GitHub, crea un Pull Request con las siguientes consideraciones:

- **Base:** `main` (o `dev` si se utiliza una rama de integración).
- **Comparar con:** Tu rama `feature/*`.
- Agrega una **descripción clara y concisa** de los cambios realizados.
- Espera la **aprobación** de al menos un revisor.

## 8️⃣ Resolver comentarios (si existen)

Si el revisor solicita cambios o mejoras, realiza los ajustes necesarios en tu código, agrégalos al `staging`, crea un nuevo `commit` y sube los cambios. El Pull Request se actualizará automáticamente:

```bash
# Realizar ajustes en el código
git add .
git commit -m "fix: ajustes solicitados en revisión"
git push origin feature/nombre-funcionalidad
```

## 9️⃣ Merge del Pull Request

Una vez que el Pull Request ha sido aprobado y todas las conversaciones resueltas, procede a realizar el `merge` desde GitHub. Se recomienda utilizar la opción **"Squash and merge"** para mantener un historial de `commits` limpio y lineal en la rama `main`.
