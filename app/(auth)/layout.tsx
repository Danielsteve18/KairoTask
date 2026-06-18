import { CyberNodesBackground } from "@/components/custom/CyberNodesBackground";
import { AuthBackLink } from "@/components/auth/AuthBackLink";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Fondo interactivo de nodos ASCII - Identidad dev-centric */}
      <div className="absolute inset-0">
        <CyberNodesBackground />
      </div>

      {/* Gradiente radial centrado detrás del card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Link de retorno animado — Client Component mínimo */}
      <AuthBackLink />

      {/* Contenido de la página */}
      <div className="relative z-10 w-full max-w-md px-4">
        {children}
      </div>
    </div>
  );
}

