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

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=for-the-badge&logo=typescript)
![NextUI](https://img.shields.io/badge/UI-NextUI%20%2F%20BaseUI-002E5D?style=for-the-badge)
![GSAP](https://img.shields.io/badge/Animations-GSAP-88CE02?style=for-the-badge&logo=greensock)
![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8?style=for-the-badge&logo=pwa)
![Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)
![Playwright](https://img.shields.io/badge/QA-Playwright-2EAD33?style=for-the-badge&logo=playwright)
![Status](https://img.shields.io/badge/status-En%20desarrollo-yellow?style=for-the-badge)

---

## 📌 Descripción

**KairoTask** es una plataforma colaborativa intuitiva y ágil diseñada para optimizar la gestión de proyectos en entornos universitarios y equipos de trabajo. Soluciona la desorganización, la falta de transparencia y los problemas de comunicación integrando herramientas modernas y notificaciones en tiempo real.

---

## 🎯 Objetivo General

Desarrollar una plataforma colaborativa intuitiva y ágil que facilite la gestión eficiente de proyectos y tareas, mejorando la comunicación y el seguimiento del progreso en equipos de trabajo.

---

## 🚀 Características Principales

*   **Gestión Ágil:** Creación, edición, y archivado de proyectos y tareas.
*   **Roles y Asignaciones:** Asignación clara de tareas a miembros específicos con fechas límite.
*   **Comunicación en Tiempo Real:** Sistema de notificaciones integradas para alertas inmediatas sobre cambios o comentarios.
*   **Micro-interacciones de UX:** Favicons dinámicos y animados que responden al estado de la aplicación (cargas, nuevas notificaciones) y a la navegación del usuario.
*   **Identidad Visual "Dev-Centric":** Animaciones fluidas basadas en caracteres usando **ASCII Studio** para una experiencia inmersiva, junto con arte de consola y modelos 3D.
*   **PWA (Progressive Web App):** Instalable nativamente en móviles y computadoras de escritorio, permitiendo un acceso rápido y una experiencia inmersiva tipo aplicación nativa.

---

## 🛠️ Stack Tecnológico y Arquitectura

Este proyecto está construido con un enfoque de ingeniería moderno y escalable, asistido activamente por herramientas de IA (GitHub Copilot / Gemini) para optimizar el flujo de trabajo:

### Frontend & UI/UX

*   **Framework:** Next.js
*   **UI Components:** NextUI / Base UI
*   **Animaciones Core:** GSAP (GreenSock)
*   **Experiencia Promocional & Efectos:**
    *   `simpleParallax.js` (Efectos de profundidad)
    *   `ascii-studio` (Conversión de video a secuencias de frames ASCII para landing pages o easter eggs)
*   **PWA Core:** `@ducanh2912/next-pwa`
*   **Manejo de Estado:** Zustand (Client) + TanStack Query (Server)
*   **Identidad Visual:** Assets 3D por LumaLabs AI y paletas cohesivas vía Realtime Colors.

### Backend, Base de Datos y Servicios Cloud

*   **BaaS (Backend as a Service):** **Supabase**. Gestiona la base de datos PostgreSQL, la autenticación de usuarios y el almacenamiento de archivos pesados (Storage).
*   **Gestor de Correos:** **BillionMail** + Nodemailer. Solución auto-alojada para el envío de notificaciones y verificaciones transaccionales.
*   **Despliegue y Hosting:** **Vercel** (Optimizado nativamente para Next.js).
*   **Arquitectura:** Diseño basado en principios de bajo nivel (inspirado en metodologías de *Codecrafters*) para optimizar el manejo de sockets y concurrencia.

### Quality Assurance (QA) & Testing

Garantizamos la calidad del software a través de un ecosistema de pruebas automatizado:

*   **E2E & Funcional Frontend:** [Playwright](https://playwright.dev/) - Elegido por su velocidad y arquitectura basada en WebSockets.
*   **Pruebas de API:** Postman.
*   **Pruebas de Carga:** JMeter / Gatling (Asegurando escalabilidad hasta 50k usuarios concurrentes).
*   **Gestión de Casos de Prueba:** TestRail.

---

## ⚙️ Flujo de Integración y Estrategia de Herramientas

Para garantizar que todas las tecnologías coexistan de manera armoniosa sin competir en responsabilidades, el flujo de trabajo del stack se organiza bajo la siguiente estrategia de implementación de UI/UX y QA:

1.  **Estructura y Breakpoints:**
    *   Configuración estricta de Tailwind/CSS usando los 4 breakpoints definidos (Mobile, Tablet, Desktop, Extra Large) para asegurar el responsive design desde el día cero.
    *   Se utiliza **Realtime Colors** para definir la paleta cromática cohesiva y exportar los tokens de color como variables CSS inyectadas en los estilos globales.
2.  **Landing Page y Experiencia "Wow":**
    *   Integración de modelos 3D de **LumaLabs** y efectos de profundidad de paralaje con **simpleParallax.js**.
    *   **ASCII Studio:** Se usará para generar un video introductorio renderizado en texto ASCII en la sección "Acerca del Proyecto" o en el Hero de la Landing Page. Esto refuerza la estética técnica de desarrollo de software sin penalizar el rendimiento del core.
3.  **App Core (NextUI + GSAP):**
    *   Construcción de la estructura base y rutas con **Next.js**.
    *   Desarrollo de los tableros Kanban, listas y configuración utilizando componentes de **NextUI / Base UI**.
    *   Manejo eficiente del estado global de UI con **Zustand** y sincronización asíncrona con **TanStack Query**.
    *   **GSAP** se encarga de las animaciones de arrastrar y soltar (Drag & Drop) en el tablero Kanban y transiciones fluidas de página.
4.  **Micro-interacciones y Detalles Técnicos (Favicons y Consola):**
    *   **Favicons dinámicos:** SVG animados reservados exclusivamente para procesos activos (cargas de red, notificaciones urgentes).
    *   **ASCII Art Archive / ASCII Studio (Easter Eggs):** Se implementará un logo ASCII estático impreso en la consola del navegador (`console.log`) al entrar a la app, y una vista especial (como la página 404) impulsada por animaciones de secuencias de frames de `ascii-studio`.
5.  **Aseguramiento de Calidad Continuo (QA):**
    *   Ejecución de flujos completos en el frontend mediante pruebas E2E con **Playwright** en pipelines de CI/CD.
    *   Validación independiente del API backend mediante colecciones y pruebas automatizadas en **Postman**.
    *   Simulación de picos de carga (hasta 50,000 usuarios concurrentes) empleando **JMeter o Gatling**.
    *   Centralización de resultados en **TestRail** para visibilidad total de la calidad del proyecto.

---

## 📏 Reglas de Diseño (UI/UX)

Para garantizar una experiencia consistente, el desarrollo frontend se rige por:

1.  **Responsive Design Estricto:** Se manejan 4 breakpoints principales para adaptar el contenido:
    *   `Mobile`: < 575.98px
    *   `Tablet`: 768px - 991.98px
    *   `Desktop`: 992px - 1199.98px
    *   `Extra Large (XL)`: > 1200px
2.  **Uso de Favicons Dinámicos:** Los favicons animados se reservan exclusivamente para comunicar estados temporales (loading, notificaciones). El resto del tiempo, la aplicación usa variaciones estáticas según el módulo activo.
3.  **Rendimiento Visual:** Las secuencias generadas por `ascii-studio` y las animaciones 3D se limitarán a vistas promocionales (Landing Page) y estados inactivos (Página 404, About) para mantener el dashboard principal ligero y enfocado en la productividad.

---

## 📁 Estructura Profesional de Carpetas

```text
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
├── package.json
```

---

## 🔄 Flujo de Trabajo (Git Workflow)

Para garantizar estabilidad, organización y control de calidad, KairoTask utiliza un flujo de trabajo basado en ramas protegidas y Pull Requests.

### 🌳 Estructura de Ramas

| Rama           | Propósito                               |
| :------------- | :-------------------------------------- |
| `main`         | Rama principal (protegida, producción estable) |
| `dev`          | Rama de integración (opcional pero recomendada) |
| `feature/***`  | Nuevas funcionalidades                  |
| `fix/***`      | Corrección de errores                   |
| `hotfix/***`   | Correcciones urgentes en producción     |

### 🔒 Protección de la Rama `main`

La rama `main` está protegida mediante reglas de GitHub, lo que asegura la **estabilidad**, **trazabilidad** y **control de cambios**. Las reglas implementadas son:

*   ❌ No se permiten `pushes` directos.
*   ✅ Se requiere un **Pull Request** para hacer `merge`.
*   ✅ Se requiere al menos **1 aprobación** de un revisor.
*   ✅ Se bloquean los `force pushes`.
*   ✅ Se requiere la **resolución de todas las conversaciones** antes de realizar el `merge`.
*   ✅ Se exige un **historial lineal** (sin `merge commits` que no sean `squash and merge`).

### 🚀 Flujo Completo para Nuevas Funcionalidades

El siguiente flujo de trabajo detalla los pasos para desarrollar y desplegar nuevas funcionalidades de manera controlada:

#### 1️⃣ Actualizar la rama principal
Antes de iniciar cualquier desarrollo, es crucial asegurarse de trabajar con la versión más reciente de la rama `main`:
```bash
git checkout main
git pull origin main
```

#### 2️⃣ Crear una nueva rama de trabajo
Todas las nuevas funcionalidades deben desarrollarse en una rama independiente, siguiendo la convención `feature/nombre-funcionalidad`:
```bash
git checkout -b feature/nombre-funcionalidad
```
*Ejemplo:*
```bash
git checkout -b feature/sistema-notificaciones
```

#### 3️⃣ Desarrollar la funcionalidad
Trabaja en el código de la nueva funcionalidad. Puedes verificar el estado de tus cambios en cualquier momento con:
```bash
git status
```

#### 4️⃣ Agregar cambios al `staging`
Una vez que los cambios estén listos para ser confirmados, agrégalos al área de `staging`:
```bash
git add .
```
O, si prefieres agregar archivos específicos:
```bash
git add src/components/Notification.tsx
```

#### 5️⃣ Crear un `commit` con mensaje profesional
Se recomienda seguir una convención de mensajes de `commit` para mantener un historial claro y descriptivo. Algunas convenciones comunes incluyen:
*   `feat:` Para nuevas funcionalidades.
*   `fix:` Para correcciones de errores.
*   `refactor:` Para mejoras internas del código.
*   `docs:` Para cambios en la documentación.
*   `style:` Para cambios visuales o de formato.
*   `chore:` Para tareas internas o de mantenimiento.

*Ejemplo:*
```bash
git commit -m "feat: agregar sistema de notificaciones en tiempo real"
```

#### 6️⃣ Subir la rama al repositorio remoto
Una vez que los cambios han sido confirmados localmente, sube tu rama al repositorio remoto:
```bash
git push origin feature/nombre-funcionalidad
```

#### 7️⃣ Crear un Pull Request
Desde la interfaz de GitHub, crea un Pull Request con las siguientes consideraciones:
*   **Base:** `main` (o `dev` si se utiliza una rama de integración).
*   **Comparar con:** Tu rama `feature/*`.
*   Agrega una **descripción clara y concisa** de los cambios realizados.
*   Espera la **aprobación** de al menos un revisor.

#### 8️⃣ Resolver comentarios (si existen)
Si el revisor solicita cambios o mejoras, realiza los ajustes necesarios en tu código, agrégalos al `staging`, crea un nuevo `commit` y sube los cambios. El Pull Request se actualizará automáticamente:
```bash
# Realizar ajustes en el código
git add .
git commit -m "fix: ajustes solicitados en revisión"
git push origin feature/nombre-funcionalidad
```

#### 9️⃣ Merge del Pull Request
Una vez que el Pull Request ha sido aprobado y todas las conversaciones resueltas, procede a realizar el `merge` desde GitHub. Se recomienda utilizar la opción **"Squash and merge"** para mantener un historial de `commits` limpio y lineal en la rama `main`.

---

## 📦 Instalación y Uso

> **🛡️ Nota de Seguridad:** Utilizamos `pnpm` como gestor de paquetes principal para evitar vulnerabilidades de dependencias fantasma (hoisting) y mantener un entorno de desarrollo seguro.

1.  **Clonar el repositorio:**
    ```bash
    git clone https://github.com/Danielsteve18/KairoTask.git
    cd KairoTask
    ```
2.  **Instalar dependencias:**
    ```bash
    pnpm install
    ```
3.  **Configurar Agent Skills (Para IA):**
    Para que los agentes de IA (Cursor, Copilot, etc.) entiendan la arquitectura del proyecto, instala las habilidades base de desarrollo:
    ```bash
    pnpm dlx skills add vercel/next-agent-skills addyosmani/web-quality-skills microsoft/playwright-agent-skills
    pnpm dlx ai-agent-skills install frontend-design
    ```
4.  **Configurar variables de entorno:**
    Renombra `.env.example` a `.env.local` y añade las credenciales de Supabase (URL y API Key) y BillionMail.
5.  **Iniciar el servidor de desarrollo:**
    *(¡Atento al arte ASCII en la terminal!)*
    ```bash
    pnpm dev
    ```

---

## 👥 Equipo de Desarrollo (Universidad Del Pacífico)

*   **Daniel Steve Montaño** - *Full-stack Developer & Arquitectura*
*   **Luisa Fernanda Lucio** - *Desarrollo / QA*
*   **Didier Andres Congo** - *QA & Automatización*

**Asesor:** Daniel Bustos

---
Construido con dedicación, café, y un enfoque "AI-Driven".
