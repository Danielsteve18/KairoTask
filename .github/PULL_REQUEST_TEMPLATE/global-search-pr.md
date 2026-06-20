## Resumen

Búsqueda global tipo palette (Cmd+K) en el dashboard + fix de 4 errores de lint del compilador de React 19.

## Cambios incluidos

### Búsqueda Global (Cmd+K)

- **`store/useSearchStore.ts`** — Estado global del modal (abierto/cerrado, query) con Zustand
- **`hooks/useGlobalSearch.ts`** — TanStack Query que precarga proyectos, tareas y miembros; filtra client-side con debounce 300ms
- **`components/search/GlobalSearchModal.tsx`** — Modal overlay con:
  - Atajo `Cmd+K` / `Ctrl+K` desde cualquier página
  - Input auto-focus, navegación por teclado (↑↓ Enter Escape)
  - Resultados agrupados: Proyectos, Tareas, Miembros
  - Iconos por tipo, descripción preview, indicador de selección
  - Navegación al hacer click o Enter (router.push)
- **`app/(dashboard)/layout.tsx`** — Botón de búsqueda con hint ⌘K en la top bar + montaje del modal

### Fix de errores de lint (React 19 Compiler)

| Archivo | Línea | Antes | Después |
|---------|-------|-------|---------|
| `hooks/useTasks.ts:47` | `useRef(Math.random()...).current` | `useId()` |
| `hooks/useTaskComments.ts:25` | `useRef(Math.random()...).current` | `useId()` |
| `hooks/useProjectMembers.ts:30` | `useRef(Math.random()...).current` | `useId()` |
| `hooks/useActivityLog.ts:50` | `useRef(Math.random()...).current` | `useId()` |
| `hooks/useProjects.ts:19` | `createClient()` sin memo | `useMemo(() => createClient(), [])` |

El error era: *"Cannot call impure function during render"* — `Math.random()` es impura y React 19 la rechaza durante el render. `useId()` de React 18+ es el API correcta para IDs únicos por instancia.

## TypeScript + Lint

- **TS:** 0 errores
- **Lint:** 0 errores nuevos (los 172 warnings son pre-existentes en skills/terceros)
