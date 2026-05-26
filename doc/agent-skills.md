# 🤖 Configuración de Agent Skills (AI-Driven Development)

En **KairoTask** adoptamos una metodología de ingeniería moderna impulsada por Inteligencia Artificial (*AI-Driven Development*). En lugar de usar instrucciones de texto planas y genéricas (como archivos `.cursorrules` antiguos), implementamos el **ecosistema de Agent Skills**.

Las *Agent Skills* (habilidades de agente) son directorios estructurados y empaquetados que proporcionan a los asistentes de IA (Cursor, Cline, Codex, Claude Code, etc.) un cerebro técnico especializado en frameworks específicos, patrones de diseño de alta fidelidad, y aserciones de calidad. 

---

## 📂 ¿Cómo funciona el Ecosistema de Skills?

Cuando instalas una *skill*, se descarga directamente en un directorio centralizado de tu proyecto:
*   `.agents/skills/`

Los asistentes de IA modernos autodescubren esta carpeta de forma dinámica. En lugar de alucinar o escribir código desactualizado, el agente lee el archivo `SKILL.md` (y esquemas asociados) del framework correspondiente, obligándole a programar bajo estándares estrictos y mejores prácticas reales.

---

## 🚀 Comandos de Instalación de Skills para KairoTask

Asegurando el uso estricto de `pnpm` y usando `dlx` para ejecutar al vuelo las herramientas oficiales de instalación, ejecuta los siguientes comandos en la raíz de tu proyecto para preparar a tu asistente de desarrollo:

### 1. El Core: Next.js y React (App Router)
Le enseña al agente a programar utilizando Server Actions, React Server Components (RSC) y las nuevas convenciones de enrutamiento de Next.js sin mezclar arquitecturas antiguas.
```bash
pnpm dlx skills add vercel/next-agent-skills
```

### 2. Frontend y Diseño UI (Tailwind, NextUI, GSAP)
Proporciona al agente reglas rigurosas de maquetación, consistencia de componentes UX, responsive design de 4 breakpoints y prevención de fugas de memoria con GSAP.
```bash
pnpm dlx ai-agent-skills install frontend-design
```

### 3. Calidad Web, Rendimiento y Accesibilidad (por Addy Osmani)
Crucial para asegurar que todo el JSX generado sea semántico, cumpla estándares de accesibilidad universal (a11y) y mantenga el bundle ligero para soportar alta concurrencia.
```bash
pnpm dlx skills add addyosmani/web-quality-skills
```

### 4. Automatización y QA (Playwright)
Enseña al agente a generar scripts de pruebas E2E robustos usando selectores resilientes (como `getByRole`) en lugar de depender de clases CSS dinámicas o frágiles de Tailwind.
```bash
pnpm dlx skills add microsoft/playwright-agent-skills
```

### 5. Base de Datos Optimizada (PostgreSQL)
Asegura que el agente diseñe esquemas eficientes de base de datos relacional, optimice los índices y maneje de manera limpia las conexiones persistentes en Next.js.
```bash
pnpm dlx skills add postgres-agent-skills
```

---

## 🛠️ Estructura de Carpetas Generada

Una vez ejecutados los comandos, tu espacio de trabajo contará con la siguiente estructura, la cual los asistentes mapearán automáticamente:

```text
KairoTask/
│
├── .agents/
│   └── skills/
│       ├── vercel__next-agent-skills/
│       ├── frontend-design/
│       ├── addyosmani__web-quality-skills/
│       ├── microsoft__playwright-agent-skills/
│       └── postgres-agent-skills/
│
├── .cursor/skills/     <-- Enlaces simbólicos generados automáticamente
└── .claude/skills/     <-- Enlaces simbólicos para otros asistentes de IA
```

---

> [!TIP]
> **Beneficio Inmediato:** Al delegarle una tarea a tu copiloto o agente de IA en este workspace (por ejemplo, "refactoriza la carga de tareas de Kanban"), el agente detectará automáticamente la skill `vercel__next-agent-skills` y `frontend-design`, generando código limpio basado en Server Components optimizados de Next.js 15 y hooks de GSAP sin necesidad de que se lo expliques en tu prompt.
