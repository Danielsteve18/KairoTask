"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El email es requerido")
    .email("Ingresa un email válido"),
  password: z
    .string()
    .min(1, "La contraseña es requerida")
    .min(6, "Mínimo 6 caracteres"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      // Mensajes de error humanizados
      if (error.message.includes("Invalid login credentials")) {
        setServerError("Email o contraseña incorrectos. Intenta de nuevo.");
      } else if (error.message.includes("Email not confirmed")) {
        setServerError(
          "Debes confirmar tu email antes de ingresar. Revisa tu bandeja de entrada."
        );
      } else {
        setServerError("Ocurrió un error al ingresar. Intenta de nuevo.");
      }
      return;
    }

    router.push(redirectTo);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Error de servidor */}
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
          htmlFor="login-email"
          className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest"
        >
          Email
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="tu@email.com"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "login-email-error" : undefined}
          {...register("email")}
          className={`
            w-full rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] 
            bg-black border transition-colors duration-200 outline-none
            placeholder:text-[#475569]
            focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
            ${errors.email ? "border-red-500/60" : "border-white/10 hover:border-white/20"}
          `}
        />
        {errors.email && (
          <p id="login-email-error" role="alert" className="text-xs text-red-400 mt-1">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-password"
          className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest"
        >
          Contraseña
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "login-password-error" : undefined}
            {...register("password")}
            className={`
              w-full rounded-lg px-4 py-2.5 pr-11 text-sm text-[#F8FAFC]
              bg-black border transition-colors duration-200 outline-none
              placeholder:text-[#475569]
              focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
              ${errors.password ? "border-red-500/60" : "border-white/10 hover:border-white/20"}
            `}
          />
          <button
            type="button"
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors duration-200 cursor-pointer"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="login-password-error" role="alert" className="text-xs text-red-400 mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Forgot password */}
      <div className="flex justify-end -mt-2">
        <Link
          href="/forgot-password"
          className="text-xs text-[#94A3B8] hover:text-[#22C55E] transition-colors font-mono"
        >
          ¿Olvidaste tu contraseña?
        </Link>
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
          mt-2
        "
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Ingresando...
          </>
        ) : (
          "Entrar al proyecto"
        )}
      </button>
    </form>
  );
}
