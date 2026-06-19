## Resumen

Implementación del **Pomodoro Timer** con la técnica clásica (25/5/15) + persistencia de sesiones en Supabase.

## Cambios incluidos

### Migración SQL
- Nueva tabla `pomodoro_sessions` con RLS por usuario autenticado

### Estado (Zustand)
- `store/usePomodoroStore.ts` — Timer con fases focus/break/long_break, ciclo count, tick cada 1s

### Hooks (TanStack Query)
- `hooks/usePomodoroSessions.ts` — fetch de sesiones del día, stats semanales, mutation para guardar sesión completada

### Componentes
- `components/pomodoro/PomodoroTimer.tsx` — Timer circular SVG con anillo de progreso animado, controles play/pause/reset/skip, notificaciones nativas al completar fase
- `components/pomodoro/PomodoroStats.tsx` — Tarjetas de métricas (hoy, completados, ciclos) + gráfica de barras de los últimos 7 días

### Páginas
- `app/(dashboard)/metrics/page.tsx` — Reemplaza ComingSoon con layout Pomodoro (timer + stats)

### Sidebar
- Renombrado "Métricas" → "Pomodoro" en el DashboardSidebar

## Flujo

1. 25 min enfoque → 5 min descanso → cada 4 ciclos descanso largo de 15 min
2. Al completar un enfoque, la sesión se guarda automáticamente en Supabase
3. Las estadísticas se actualizan en tiempo real via TanStack Query
4. Notificaciones del navegador al cambiar de fase

## Dependencias nuevas

- `zustand` (para estado del timer en memoria)
