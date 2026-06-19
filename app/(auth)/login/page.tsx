import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | KairoTask",
  description: "Accede a tu espacio de trabajo en KairoTask.",
};

export default function LoginPage() {
  return (
    <AuthCard
      eyebrow="> kairo.auth.login"
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para acceder a tu espacio de trabajo."
      footerText="¿No tienes cuenta?"
      footerLinkText="Crea una gratis"
      footerLinkHref="/register"
    >
      <LoginForm />
    </AuthCard>
  );
}
