# Agent Skills — KairoTask

Adoptamos **Agent Skills** para que la IA genere código alineado con nuestro stack y convenciones. Cada skill es un directorio con `SKILL.md` que el asistente lee automáticamente.

## Stack objetivo

| Área | Skills instaladas | Creador |
|------|------------------|---------|
| React / Next.js | `vercel-react-best-practices`, `vercel-composition-patterns`, `web-design-guidelines` | [Vercel Labs](https://github.com/vercel-labs/agent-skills) |
| TanStack Query | `tanstack-query` | [TanStack](https://github.com/tanstack-skills/tanstack-skills) |
| Supabase / Postgres | `supabase`, `supabase-postgres-best-practices` | [Supabase](https://github.com/supabase/agent-skills) |
| E2E Testing | `playwright-cli` | [Microsoft](https://github.com/microsoft/playwright-cli) |
| i18n | `i18n-expert` | [daymade](https://github.com/daymade/claude-code-skills) |
| Web Quality (a11y, SEO, perf) | `accessibility`, `best-practices`, `core-web-vitals`, `performance`, `seo`, `web-quality-audit` | [Addy Osmani](https://github.com/addyosmani/web-quality-skills) |
| Diseño UI | `ui-ux-pro-max`, `impeccable` | AI Agent Skills |

## Comandos de instalación (referencia)

```bash
pnpm dlx skills add "vercel-labs/agent-skills@<skill>" -y
pnpm dlx skills add "tanstack-skills/tanstack-skills@<skill>" -y
pnpm dlx skills add "supabase/agent-skills@<skill>" -y
pnpm dlx skills add "microsoft/playwright-cli@<skill>" -y
pnpm dlx skills add "daymade/claude-code-skills@<skill>" -y
pnpm dlx skills add "addyosmani/web-quality-skills" -y
pnpm dlx ai-agent-skills install frontend-design
```

## Skills instaladas (16)

```
.agents/skills/
├── accessibility/
├── best-practices/
├── core-web-vitals/
├── i18n-expert/
├── impeccable/
├── performance/
├── playwright-cli/
├── seo/
├── supabase/
├── supabase-postgres-best-practices/
├── tanstack-query/
├── ui-ux-pro-max/
├── vercel-composition-patterns/
├── vercel-react-best-practices/
├── web-design-guidelines/
└── web-quality-audit/
```
