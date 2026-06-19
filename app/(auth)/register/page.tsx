import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | KairoTask",
  description: "Únete a KairoTask y gestiona tus proyectos con tu equipo en tiempo real.",
};

export default function RegisterPage() {
  return (
    <AuthCard
      eyebrow="> kairo.auth.register"
      title="Crea tu cuenta"
      subtitle="Únete a KairoTask y empieza a gestionar proyectos con tu equipo."
      footerText="¿Ya tienes cuenta?"
      footerLinkText="Inicia sesión"
      footerLinkHref="/login"
    >
      <RegisterForm />
    </AuthCard>
  );
}
