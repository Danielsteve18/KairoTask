# 🎭 Playwright: Aseguramiento de Calidad y Pruebas E2E

**Playwright** (desarrollado por Microsoft) es nuestra herramienta principal de Aseguramiento de Calidad (QA) para pruebas funcionales de extremo a extremo (*End-to-End*). Es veloz, se ejecuta de manera nativa en navegadores chromium, firefox y webkit reales sobre WebSockets, y reemplaza de forma absoluta suites pesadas o desactualizadas como Selenium o Cypress.

---

## 🛠️ Inicialización de Playwright en KairoTask

Para inyectar el entorno oficial con la estructura correcta de carpetas y los archivos de configuración nativos, ejecutamos el siguiente comando interactivo dentro de la raíz de la aplicación:

```bash
pnpm create playwright
```

### Opciones seleccionadas durante el instalador:
1.  **¿Deseas usar TypeScript?** ➡️ Sí (*TypeScript*).
2.  **¿Dónde colocar tus pruebas?** ➡️ `tests` (carpeta raíz).
3.  **¿Añadir un flujo de trabajo para GitHub Actions (CI/CD)?** ➡️ Sí.
4.  **¿Instalar navegadores de Playwright?** ➡️ Sí (esto descarga los binarios de prueba optimizados sin interferir con tus navegadores personales).

---

## 🚀 Comandos Esenciales de Ejecución

Playwright incluye una suite visual interactiva excelente y generadores automáticos de código de prueba. Ejecuta las siguientes tareas desde tu terminal:

### Ejecutar todas las pruebas (Modo Consola):
```bash
pnpm playwright test
```

### Abrir la UI Interactiva (Visual Runner):
La herramienta más potente de Playwright. Te permite ver visualmente la ejecución de cada paso de la prueba, examinar la consola, la red en tiempo real y hacer *debugging* con facilidad:
```bash
pnpm exec playwright test --ui
```

### Depurar una prueba específica (Inspector):
Detiene el script de prueba y te permite avanzar paso a paso visualizando el estado del navegador:
```bash
pnpm exec playwright test --debug
```

### Generar pruebas automáticamente (Codegen):
Abre un navegador interactivo donde cada click y entrada de texto que realices se convertirá automáticamente en un script estructurado de Playwright:
```bash
pnpm exec playwright codegen http://localhost:3000
```

---

## 📏 Estándar de Selección de Elementos (Locators)

Siguiendo las mejores prácticas de accesibilidad y las directrices de nuestras **AI Skills**:
*   **❌ EVITA:** Selectores CSS basados en clases de Tailwind (p. ej. `page.locator('.bg-blue-500.rounded-lg')`), ya que cambian con la estética de la app y rompen las pruebas frecuentemente.
*   **✅ USA:** Selectores semánticos basados en roles de accesibilidad aria (`getByRole`, `getByLabel`, `getByPlaceholder` o `getByText`).

### Ejemplo de Prueba Robusta (`tests/auth.spec.ts`):
```typescript
import { test, expect } from "@playwright/test";

test("Debería permitir al usuario iniciar sesión exitosamente", async ({ page }) => {
  // 1. Navegar a la página de login
  await page.goto("/login");

  // 2. Llenar campos con selectores resilientes
  await page.getByLabel("Correo Electrónico").fill("demo@kairotask.edu.co");
  await page.getByLabel("Contraseña").fill("password123");

  // 3. Hacer click en el botón de acción
  await page.getByRole("button", { name: "Ingresar" }).click();

  // 4. Verificar redirección al dashboard
  await expect(page).toHaveURL("/dashboard");
  await expect(page.getByRole("heading", { name: "Mis Proyectos" })).toBeVisible();
});
```

---

> [!NOTE]
> Al configurar tu servidor de integración continua (CI) en GitHub Actions, cada Pull Request ejecutará automáticamente la suite completa de Playwright. Ninguna funcionalidad se fusionará en `main` si tiene pruebas rotas.
