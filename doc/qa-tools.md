# 🧪 Ecosistema de QA y Rendimiento: Postman, JMeter y TestRail

Para garantizar la estabilidad y cumplir con los requerimientos no funcionales de **KairoTask** (como soportar de manera óptima picos de hasta **50,000 usuarios concurrentes**), establecemos un ecosistema de Aseguramiento de Calidad (QA) riguroso que complementa las pruebas funcionales de Playwright.

---

## 🛰️ 1. Postman: Pruebas de API e Integración

**Postman** se utiliza de manera exclusiva para testear el backend, validando que los endpoints rest y servicios de datos respondan con la estructura y tiempos correctos.

### Alcance del Testing de API en KairoTask:
*   **Autenticación:** Flujos de Login, Registro, Recuperación de Contraseña y validación de tokens de sesión.
*   **Gestión de Proyectos:** CRUD de proyectos, invitaciones de colaboradores, asignación de roles y permisos.
*   **Tablero Kanban:** Creación de tareas, comentarios, movimientos de estados e historial de modificaciones.

### Integración en CI/CD (Newman):
Las colecciones de pruebas de Postman se exportan en formato JSON a la carpeta `tests/postman/` y se ejecutan automáticamente en cada PR utilizando la CLI de **Newman**:
```bash
pnpm dlx newman run tests/postman/kairo-api-tests.json -e tests/postman/dev-environment.json
```

---

## ⚡ 2. JMeter y Gatling: Pruebas de Carga y Concurrencia

Uno de los mayores desafíos arquitectónicos de KairoTask es soportar **50,000 usuarios concurrentes**. Para validar si la base de datos PostgreSQL, los balanceadores y los sockets toleran este volumen, se realizan pruebas de estrés e inyección de carga.

### JMeter (Basado en Interfaz y XML):
*   Ideal para configurar flujos complejos y simular miles de peticiones HTTP en bucle.
*   **Script de prueba:** Guardado en `tests/jmeter/kairo_stress_test.jmx`.
*   **Ejecución sin interfaz gráfica (CLI recomendado para máximo rendimiento):**
    ```bash
    jmeter -n -t tests/jmeter/kairo_stress_test.jmx -l tests/jmeter/results.jtl -e -o tests/jmeter/report/
    ```

### Gatling (Basado en Código Scala/Java/Kotlin):
*   Preferido por desarrolladores debido a su enfoque de *Infrastructure as Code*.
*   Utiliza una arquitectura asíncrona basada en actores (Netty), permitiendo simular decenas de miles de usuarios virtuales con un consumo mínimo de RAM local.

---

## 📊 3. TestRail: Gestión y Centralización de Casos de Prueba

Para evitar que los resultados de pruebas manuales y automatizadas queden aislados en reportes locales, utilizamos **TestRail** como nuestro panel de visibilidad centralizada.

### Flujo de Trabajo en TestRail:
1.  **Diseño de Casos de Prueba:** Los ingenieros de QA escriben los casos de prueba manuales para escenarios exploratorios (p. ej., comportamiento visual de animaciones de GSAP en navegadores raros).
2.  **Integración con Playwright:** Playwright se conecta a la API de TestRail mediante un Reporter oficial. Al finalizar las pruebas automáticas en el servidor CI, los resultados de Playwright se inyectan y marcan como `Passed` o `Failed` directamente en el panel de TestRail.
3.  **Generación de Reportes:** Proporciona métricas claras de cobertura de calidad al asesor del proyecto y al equipo de desarrollo antes de dar luz verde a los despliegues a producción.
