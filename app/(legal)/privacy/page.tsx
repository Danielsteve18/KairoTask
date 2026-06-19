import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — KairoTask",
  description: "Política de privacidad y tratamiento de datos personales en KairoTask.",
};

export default function PrivacyPage() {
  return (
    <article className="prose prose-invert max-w-none">
      <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-2">Política de Privacidad</h1>
      <p className="text-sm text-muted-foreground mb-8">Última actualización: Junio 2026</p>

      <h2>1. Información que Recopilamos</h2>
      <p>Cuando utilizas KairoTask, podemos recopilar la siguiente información:</p>
      <ul>
        <li><strong>Información de cuenta:</strong> nombre completo, correo electrónico y contraseña (almacenada de forma segura mediante Supabase Auth).</li>
        <li><strong>Datos de uso:</strong> proyectos, tareas, comentarios y configuraciones que creas dentro de la plataforma.</li>
        <li><strong>Datos de sesión:</strong> duración de sesiones Pomodoro y métricas de productividad.</li>
        <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador y sistema operativo con fines de seguridad y rendimiento.</li>
      </ul>

      <h2>2. Cómo Usamos tu Información</h2>
      <p>Utilizamos la información recopilada para:</p>
      <ul>
        <li>Proveer, mantener y mejorar la Plataforma</li>
        <li>Autenticar tu identidad y proteger tu cuenta</li>
        <li>Enviar notificaciones relacionadas con tu actividad en la plataforma</li>
        <li>Generar métricas de productividad personales</li>
        <li>Cumplir con obligaciones legales y regulatorias</li>
      </ul>

      <h2>3. Almacenamiento y Seguridad</h2>
      <p>
        Tus datos se almacenan en servidores seguros de Supabase (PostgreSQL) con cifrado en tránsito (HTTPS/WSS) 
        y en reposo. Implementamos Row Level Security (RLS) para garantizar que solo tú y los miembros de tus 
        proyectos puedan acceder a tu información.
      </p>

      <h2>4. Compartición de Datos</h2>
      <p>
        No vendemos tu información personal a terceros. Podemos compartir datos limitados con proveedores de 
        servicios esenciales (Supabase para base de datos y autenticación, Vercel para hosting) que están 
        contractualmente obligados a proteger tu información.
      </p>

      <h2>5. Tus Derechos</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li>Acceder a los datos personales que tenemos sobre ti</li>
        <li>Solicitar la corrección de datos inexactos</li>
        <li>Solicitar la eliminación de tu cuenta y datos asociados</li>
        <li>Exportar tus datos en formato estructurado</li>
        <li>Retirar tu consentimiento en cualquier momento</li>
      </ul>

      <h2>6. Retención de Datos</h2>
      <p>
        Conservamos tus datos mientras mantengas una cuenta activa. Si eliminas tu cuenta, tus datos personales 
        se eliminan en un plazo de 30 días. Los datos agregados y anonimizados pueden retenerse con fines analíticos.
      </p>

      <h2>7. Cookies</h2>
      <p>
        KairoTask utiliza cookies estrictamente necesarias para la autenticación y el funcionamiento del servicio 
        (cookies de sesión). No utilizamos cookies de rastreo ni publicitarias.
      </p>

      <h2>8. Cambios a esta Política</h2>
      <p>
        Podemos actualizar esta política periódicamente. Notificaremos cambios significativos a través de la 
        Plataforma o por correo electrónico.
      </p>

      <h2>9. Contacto</h2>
      <p>
        Para ejercer tus derechos de privacidad o resolver cualquier duda, abre un issue en 
        <a href="https://github.com/Danielsteve18/KairoTask" target="_blank" rel="noopener noreferrer"> nuestro repositorio</a>.
      </p>
    </article>
  );
}
