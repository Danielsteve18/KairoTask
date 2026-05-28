# 📂 Repositorios a Clonar y Configurar

El ecosistema de **KairoTask** requiere el repositorio de la aplicación principal para el core colaborativo, así como herramientas complementarias especializadas en subcarpetas para procesar activos interactivos de consola y visuales.

A continuación, se detallan los repositorios que debes clonar para tener el entorno completo listo para el desarrollo.

---

## ⏳ 1. Repositorio Principal: KairoTask

Este es el repositorio central del proyecto que contiene la aplicación Next.js, la lógica de negocio, tableros Kanban, APIs de persistencia y la suite de pruebas Playwright.

### Paso a paso para clonar y preparar:

1.  **Clonar el proyecto:**
    Abre tu terminal favorita en el directorio donde organizas tus proyectos de desarrollo y ejecuta:
    ```bash
    git clone https://github.com/Danielsteve18/KairoTask.git
    ```
2.  **Acceder al directorio:**
    ```bash
    cd KairoTask
    ```
3.  **Instalar dependencias con PNPM:**
    ```bash
    pnpm install
    ```

---

## 🎨 2. Repositorio Auxiliar: ASCII Studio

`ascii-studio` es una potente herramienta escrita en Python/C++ diseñada para convertir secuencias de video e imágenes en arte y animaciones basadas en caracteres ASCII. 

Dado que es una herramienta de preprocesamiento y generación de assets de diseño (no un paquete npm), **no** se instala directamente en las dependencias de Node.js. En su lugar, la clonamos en una carpeta de herramientas anexa dentro del workspace para procesar allí los videos promocionales y luego mover los frames exportados a la carpeta `public/` de Next.js.

### Paso a paso para clonar y preparar:

1.  **Crear la carpeta de herramientas (dentro del raíz de KairoTask):**
    Asegúrate de estar en la raíz de `KairoTask` y ejecuta:
    ```bash
    mkdir tools
    ```
2.  **Clonar ascii-studio dentro de tools:**
    ```bash
    git clone https://github.com/vansh-nagar/ascii-studio.git tools/ascii-studio
    ```
3.  **Configurar ascii-studio:**
    *   La herramienta requiere **Python 3** y algunas dependencias de procesamiento de imágenes (`OpenCV`, `Pillow`).
    *   Navega a su directorio e instala los requerimientos:
        ```bash
        cd tools/ascii-studio
        pip install -r requirements.txt
        ```
    *   *Nota: Puedes consultar la documentación oficial de [ascii-studio](https://github.com/vansh-nagar/ascii-studio) si necesitas configurar el motor C++ opcional para mayor velocidad.*

---

## 🛠️ Resumen de la Estructura en el Workspace

Tras clonar ambos repositorios, tu estructura de workspace local debe lucir así para que todos los scripts y rutas relativas funcionen adecuadamente:

```text
KairoTask/                    <-- Repositorio Principal (Core App)
│
├── public/                   <-- Aquí se moverán los frames ASCII y assets 3D
├── src/                      <-- Código fuente Next.js
├── doc/                      <-- Documentación oficial (.md)
│
└── tools/
    └── ascii-studio/         <-- Repositorio Auxiliar (Procesamiento de Video)
```

---

> [!IMPORTANT]
> Nunca realices commits de los videos pesados en bruto de la carpeta `tools/ascii-studio` al repositorio de KairoTask. Asegúrate de que los archivos multimedia temporales grandes estén debidamente cubiertos en el `.gitignore`.
