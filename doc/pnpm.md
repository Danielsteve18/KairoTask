# 📦 Instalación y Configuración de PNPM

`pnpm` (Performant npm) es el gestor de paquetes principal elegido para **KairoTask**. Se prefiere a `npm` o `yarn` debido a su velocidad extrema, eficiencia en el almacenamiento mediante un almacén direccionable por contenido global, y su estricta resolución de dependencias que evita las dependencias fantasma (*hoisting*).

---

## 🛠️ Requisitos Previos

Antes de instalar `pnpm`, debes asegurarte de tener **Node.js** instalado en tu sistema.

1.  **Descargar Node.js:**
    *   Visita el sitio oficial: [nodejs.org](https://nodejs.org/).
    *   Descarga la versión recomendada **LTS** (Long Term Support).
    *   Sigue el instalador estándar para tu sistema operativo (Windows, macOS o Linux).
2.  **Verificar la instalación:**
    Abre tu terminal y ejecuta:
    ```bash
    node --version
    ```
    *(Asegúrate de que devuelva una versión compatible, p. ej. v18+ o v20+)*.

---

## 🚀 Cómo Instalar PNPM

Dependiendo de tu sistema operativo y preferencias, puedes instalar `pnpm` utilizando alguno de los siguientes métodos oficiales:

### Método 1: Usando Corepack (Recomendado y Oficial de Node.js)
Las versiones recientes de Node.js vienen con Corepack integrado por defecto. Solo necesitas habilitarlo:

```bash
corepack enable
```

Si deseas asegurar que usas la última versión de `pnpm` a través de corepack:
```bash
corepack prepare pnpm@latest --activate
```

---

### Método 2: Instalador Autónomo (Stand-alone CLI)

#### 🖥️ En Windows (PowerShell):
Abre PowerShell y ejecuta:
```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

#### 🍎 En macOS y 🐧 Linux (curl):
Abre tu terminal y ejecuta:
```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

### Método 3: Instalación Global a través de NPM (Fácil)
Si ya tienes Node.js y `npm` instalados en tu máquina, puedes instalarlo globalmente ejecutando:

```bash
npm install -g pnpm
```

---

## 🔍 Verificar la Instalación

Una vez instalado, cierra tu terminal actual, abre una nueva sesión y comprueba que `pnpm` esté disponible en el `PATH`:

```bash
pnpm --version
```
*(Debería imprimir el número de versión instalada, p. ej., 10.x.x o superior).*

---

## 💡 Comandos Esenciales de PNPM

Aquí tienes una referencia rápida de equivalencias si vienes de `npm`:

| Acción | Comando NPM | Comando PNPM |
| :--- | :--- | :--- |
| **Instalar dependencias del proyecto** | `npm install` | `pnpm install` |
| **Añadir una dependencia de producción** | `npm install <paquete>` | `pnpm add <paquete>` |
| **Añadir una dependencia de desarrollo** | `npm install -D <paquete>` | `pnpm add -D <paquete>` |
| **Eliminar un paquete** | `npm uninstall <paquete>` | `pnpm remove <paquete>` |
| **Ejecutar un script de package.json** | `npm run dev` | `pnpm dev` o `pnpm run dev` |
| **Ejecutar comandos sin instalar (npx)** | `npx <comando>` | `pnpm dlx <comando>` |

---

> [!NOTE]
> Para KairoTask, **siempre** debes ejecutar `pnpm install` antes de levantar tu servidor de desarrollo para asegurar un árbol de dependencias consistente y limpio.
