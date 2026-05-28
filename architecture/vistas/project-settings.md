# Vista: Configuración del Proyecto y Miembros

## Descripción General
Una vista administrativa dedicada a los dueños (Owners) o Administradores del proyecto. Permite gestionar quién tiene acceso al tablero y modificar propiedades globales del proyecto.

## Elementos UI / Componentes Principales
1. **Ajustes Generales:**
   * Campo para editar el Nombre del Proyecto.
   * Área de texto para modificar la Descripción.
2. **Gestión de Miembros (El Equipo):**
   * Input tipo buscador con un botón "Invitar" para añadir miembros por su correo electrónico.
   * Lista en formato tabla de los miembros actuales.
   * Para cada miembro en la lista: Un selector (Dropdown) para cambiar su rol (Visor, Miembro, Administrador) y un botón (icono de papelera) para expulsarlo del proyecto.
3. **Zona de Peligro (Danger Zone):**
   * Botón de contorno rojo para "Archivar Proyecto" (lo oculta del Dashboard pero no borra la data).
   * Botón relleno de rojo para "Eliminar Proyecto" (acción destructiva, requiere confirmación).

## Interacciones y UX
* Al invitar a un usuario, si el correo no está registrado en el sistema, debería indicar que se le ha enviado un correo invitándolo a unirse a KairoTask (vía BillionMail).
* Modal de doble confirmación ("¿Estás completamente seguro?") al intentar eliminar un proyecto, para evitar pérdida accidental de datos.

## Rutas Asociadas
* `/projects/[id]/settings`
