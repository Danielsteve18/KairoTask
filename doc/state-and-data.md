# ⚡ Zustand y TanStack Query: Gestión de Estado y Sincronización

Para mantener la máxima eficiencia de rendimiento, **KairoTask** separa de manera estricta la gestión de datos locales en memoria y la caché del servidor.

*   **Zustand:** Maneja el estado global del cliente (menús colapsados, filtros del Kanban activos, preferencias del usuario).
*   **TanStack Query (React Query):** Gestiona el estado del servidor (fetching, almacenamiento en caché, revalidación y sincronización en tiempo real de tareas y proyectos con PostgreSQL).

---

## 🛠️ Instalación y Dependencias

Instala ambas librerías junto con las herramientas oficiales de desarrollo recomendadas por TanStack utilizando `pnpm`:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools zustand
```

---

## 🚀 1. Configuración de TanStack Query en Next.js

Para evitar que los datos de las consultas de caché se mezclen entre múltiples renderizados del servidor (SSR), creamos una instancia fresca de `QueryClient` para cada petición.

### Crear Proveedor de Consultas (`src/app/query-provider.tsx`):
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
            staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
            refetchOnWindowFocus: false, // Evita peticiones innecesarias al cambiar de pestaña
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
*(Envuelve este proveedor dentro del `layout.tsx` global junto a NextUI).*

---

## 🧠 2. Uso de Zustand para el Estado del Cliente

Zustand destaca por su simplicidad (sin necesidad de complejos proveedores o Boilerplate de Contexts) y rendimiento al evitar re-renders innecesarios.

### Ejemplo de Configuración de Tienda para Filtros del Kanban (`src/store/useKanbanStore.ts`):
```typescript
import { create } from "zustand";

interface KanbanState {
  searchQuery: string;
  selectedPriority: "low" | "medium" | "high" | "all";
  setSearchQuery: (query: string) => void;
  setSelectedPriority: (priority: "low" | "medium" | "high" | "all") => void;
  resetFilters: () => void;
}

export const useKanbanStore = create<KanbanState>((set) => ({
  searchQuery: "",
  selectedPriority: "all",
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedPriority: (priority) => set({ selectedPriority: priority }),
  resetFilters: () => set({ searchQuery: "", selectedPriority: "all" }),
}));
```

### Consumir el estado en un componente React:
```tsx
"use client";

import { useKanbanStore } from "@/store/useKanbanStore";

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useKanbanStore();

  return (
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Buscar tareas..."
    />
  );
}
```

---

> [!TIP]
> **TanStack Query Devtools:** Al levantar el proyecto localmente (`pnpm dev`), verás un pequeño logo flotante de React Query en la esquina de la pantalla. Úsalo para inspeccionar las consultas activas, sus payloads en caché y forzar re-refetchings de prueba.
