"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getBaseUrl } from "@/lib/getBaseUrl";

const forgotSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  async function onSubmit(values: ForgotFormValues) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${getBaseUrl()}/login`,
    });

    if (error) {
      setServerError("Ocurrió un error al enviar el email. Intenta de nuevo.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-5 text-center">
        <div className="flex justify-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(34,197,94,0.1)" }}
          >
            <CheckCircle2 className="w-7 h-7" style={{ color: "#22C55E" }} />
          </div>
        </div>
        <div>
          <p className="text-lg font-semibold text-[#F8FAFC] mb-1">Email enviado</p>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Revisa tu bandeja de entrada. Si el email está registrado, recibirás un enlace
            para restablecer tu contraseña.
          </p>
        </div>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-[#22C55E] hover:text-[#16A34A] transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Error */}
      {serverError && (
        <div
          role="alert"
          className="rounded-lg px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20"
        >
          {serverError}
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="forgot-email"
          className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest"
        >
          Email
        </label>
        <div className="relative">
          <Mail
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#475569" }}
          />
          <input
            id="forgot-email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "forgot-email-error" : undefined}
            {...register("email")}
            className={`
              w-full rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC]
              bg-black border transition-colors duration-200 outline-none
              placeholder:text-[#475569]
              focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
              ${errors.email ? "border-red-500/60" : "border-white/10 hover:border-white/20"}
            `}
          />
        </div>
        {errors.email && (
          <p id="forgot-email-error" role="alert" className="text-xs text-red-400 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="
          w-full rounded-lg px-4 py-2.5 text-sm font-semibold
          bg-[#22C55E] text-[#020617]
          hover:bg-[#16A34A] active:scale-[0.98]
          transition-all duration-200
          disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
          flex items-center justify-center gap-2
          cursor-pointer
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#22C55E]
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar enlace de recuperación"
        )}
      </button>
    </form>
  );
}
