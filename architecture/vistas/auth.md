# Vista: Autenticación (Login, Registro y Recuperación)

## Descripción General
Conjunto de vistas enfocadas en la gestión de identidad del usuario. Deben ser rápidas, seguras y claras, manejadas en el backend por Supabase Auth.

## Elementos UI / Componentes Principales
### 1. Iniciar Sesión (Login)
* Formulario con Email y Contraseña.
* Enlace a "¿Olvidaste tu contraseña?".
* Botón de inicio de sesión (con estado de carga/spinner).
* Opción de OAuth (opcional a futuro, ej: "Iniciar sesión con Google/GitHub").

### 2. Registro (Sign Up)
* Formulario solicitando: Nombre Completo, Email (idealmente institucional) y Contraseña.
* Medidor de seguridad de contraseña.
* Mensaje de éxito informando que se ha enviado un correo de verificación (vía BillionMail).

### 3. Recuperar Contraseña
* Campo único para ingresar el correo electrónico.
* Mensaje de confirmación de envío de enlace mágico (Magic Link) o token de reseteo.

## Interacciones y UX
* **Validación en tiempo real:** Los campos deben mostrar errores de formato de email o contraseñas cortas instantáneamente, antes de enviar el formulario.
* Transiciones suaves entre el formulario de login y registro usando NextUI.

## Rutas Asociadas
* `/auth/login`
* `/auth/register`
* `/auth/forgot-password`
