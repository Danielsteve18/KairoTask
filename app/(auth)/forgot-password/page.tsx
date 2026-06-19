import { AuthCard } from "@/components/auth/AuthCard";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña | KairoTask",
  description: "Recibe un enlace para restablecer tu contraseña en KairoTask.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      eyebrow="> kairo.auth.forgot-password"
      title="¿Olvidaste tu contraseña?"
      subtitle="Ingresa tu email y te enviaremos un enlace para restablecerla."
      footerText="¿Recordaste tu contraseña?"
      footerLinkText="Inicia sesión"
      footerLinkHref="/login"
    >
      <ForgotPasswordForm />
    </AuthCard>
  );
}
