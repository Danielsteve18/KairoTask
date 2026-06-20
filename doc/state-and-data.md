# ⚡ Zustand y TanStack Query: Gestión de Estado y Sincronización

Para mantener la máxima eficiencia de rendimiento, **KairoTask** separa de manera estricta la gestión de datos locales en memoria y la caché del servidor.

- **Zustand:** Maneja el estado global del cliente (panel de notificaciones, Pomodoro timer, búsqueda global).
- **TanStack Query (React Query):** Gestiona el estado del servidor (fetching, almacenamiento en caché, revalidación y mutaciones).

---

## 🚀 1. Configuración de TanStack Query

### Crear Proveedor de Consultas (`components/query-provider.tsx`):

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1 minuto
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

Envuelve este proveedor dentro del `app/layout.tsx` global.

---

## 🧠 2. Uso de Zustand para el Estado del Cliente

### Stores actuales:

#### Notificaciones (`store/useNotificationStore.ts`):
```typescript
import { create } from "zustand";

interface NotificationState {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
}));
```

#### Pomodoro (`store/usePomodoroStore.ts`):
```typescript
interface PomodoroState {
  mode: "focus" | "break" | "long_break";
  secondsLeft: number;
  isRunning: boolean;
  // ... acciones start, pause, reset, complete
}
```

#### Búsqueda Global (`store/useSearchStore.ts`):
```typescript
interface SearchState {
  isOpen: boolean;
  query: string;
  open: () => void;
  close: () => void;
  setQuery: (query: string) => void;
}
```

---

## 🎣 3. TanStack Query Hooks

Cada hook vive en `hooks/` y sigue el patrón:

```typescript
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

// Query
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("projects").select("*");
      if (error) throw error;
      return data;
    },
  });
}

// Mutation con invalidación
export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateProjectInput) => { ... },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
```

### Hooks disponibles en `hooks/`:

| Hook | Query Key | Propósito |
|------|-----------|-----------|
| `useProjects` | `["projects"]` | CRUD de proyectos con conteo de tareas/miembros |
| `useTasks` | `["tasks", projectId]` | CRUD de tareas con filtros y Realtime |
| `useProjectMembers` | `["project-members", projectId]` | Miembros + roles |
| `useTaskComments` | `["comments", taskId]` | Comentarios en tareas |
| `useNotifications` | `["notifications"]` | Notificaciones del usuario |
| `useNotificationPreferences` | `["notification_preferences"]` | Preferencias de notificación |
| `usePomodoroSessions` | `["pomodoro-sessions"]` | Sesiones de enfoque |
| `useTaskAttachments` | `["task-attachments", taskId]` | Archivos adjuntos |
| `useGlobalSearch` | `["global-search", query]` | Búsqueda global |
| `useActivityLog` | `["activity-log", projectId]` | Feed de actividad |

---

> [!TIP]
> **TanStack Query Devtools:** Al levantar el proyecto localmente (`pnpm dev`), verás un logo flotante de React Query en la esquina de la pantalla. Úsalo para inspeccionar las consultas activas, sus payloads en caché y forzar re-refetchings de prueba.
