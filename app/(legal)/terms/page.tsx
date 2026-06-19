import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Uso — KairoTask",
  description: "Términos y condiciones para el uso de la plataforma KairoTask.",
};

export default function TermsPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Términos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-8">Última actualización: Junio 2026</p>

      <h2>1. Aceptación de los Términos</h2>
      <p>
        Al acceder y utilizar la plataforma KairoTask (&quot;la Plataforma&quot;), aceptas cumplir con estos Términos de Uso. 
        Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar la Plataforma.
      </p>

      <h2>2. Descripción del Servicio</h2>
      <p>
        KairoTask es una plataforma colaborativa de gestión ágil de proyectos y tareas diseñada para equipos de trabajo. 
        El servicio incluye, entre otras funcionalidades: tableros Kanban, temporizador Pomodoro, colaboración en tiempo real, 
        gestión de miembros y notificaciones.
      </p>

      <h2>3. Registro y Cuenta</h2>
      <p>
        Para utilizar la Plataforma, debes crear una cuenta proporcionando información veraz y completa. 
        Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades 
        que ocurran bajo tu cuenta.
      </p>

      <h2>4. Uso Aceptable</h2>
      <p>Te comprometes a no utilizar la Plataforma para:</p>
      <ul>
        <li>Realizar actividades ilegales o no autorizadas</li>
        <li>Infringir derechos de propiedad intelectual de terceros</li>
        <li>Distribuir malware, virus o cualquier código dañino</li>
        <li>Intentar acceder a cuentas de otros usuarios sin autorización</li>
        <li>Sobrecargar o interferir con la infraestructura del servicio</li>
      </ul>

      <h2>5. Propiedad Intelectual</h2>
      <p>
        El código, diseño, logotipos y contenido visual de KairoTask son propiedad de sus creadores. 
        Los datos y contenido que los usuarios ingresan en la plataforma les pertenecen a ellos.
      </p>

      <h2>6. Limitación de Responsabilidad</h2>
      <p>
        KairoTask se proporciona &quot;tal cual&quot; sin garantías de ningún tipo. 
        No nos responsabilizamos por daños directos o indirectos derivados del uso de la Plataforma, 
        incluyendo pérdida de datos o interrupción del servicio.
      </p>

      <h2>7. Modificaciones</h2>
      <p>
        Nos reservamos el derecho de modificar estos términos en cualquier momento. 
        Los cambios serán notificados a través de la Plataforma y entrarán en vigor inmediatamente después de su publicación.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Si tienes preguntas sobre estos términos, puedes contactarnos a través de los canales del proyecto en 
        <a href="https://github.com/Danielsteve18/KairoTask" target="_blank" rel="noopener noreferrer"> GitHub</a>.
      </p>
    </article>
  );
}
