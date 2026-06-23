"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Loader2, Check, Lock, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { PasswordModal } from "./PasswordModal";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Tu nombre debe tener al menos 2 caracteres")
      .max(60, "Nombre demasiado largo"),
    email: z
      .string()
      .min(1, "El email es requerido")
      .email("Ingresa un email válido"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
      .regex(/[0-9]/, "Debe contener al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    acceptTerms: z.literal(true, {
      message: "Debes aceptar los términos de uso",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const passwordSet = watch("password");

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);
    setSuccessMessage(null);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
        },
        emailRedirectTo: `${getBaseUrl()}/login`,
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        setServerError(
          "Este email ya tiene una cuenta. ¿Olvidaste tu contraseña?"
        );
      } else {
        setServerError("Error al crear la cuenta. Intenta de nuevo.");
      }
      return;
    }

    setSuccessMessage(
      "¡Cuenta creada! Revisa tu email para confirmar tu registro antes de ingresar."
    );

    // Redirige al login tras 3 segundos
    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  function handlePasswordSave(password: string) {
    setValue("password", password, { shouldValidate: true });
    setValue("confirmPassword", password, { shouldValidate: true });
  }

  if (successMessage) {
    return (
      <div
        role="status"
        className="rounded-lg px-4 py-5 text-sm text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/25 flex items-start gap-3"
      >
        <Check className="w-5 h-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{successMessage}</p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Error de servidor */}
        {serverError && (
          <div
            role="alert"
            className="rounded-lg px-4 py-2.5 text-sm text-red-400 bg-red-400/10 border border-red-400/20"
          >
            {serverError}
          </div>
        )}

        {/* Nombre completo */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-name"
            className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest"
          >
            Nombre completo
          </label>
          <input
            id="register-name"
            type="text"
            autoComplete="name"
            placeholder="Tu nombre"
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? "register-name-error" : undefined}
            {...register("fullName")}
            className={`
              w-full rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC]
              bg-black border transition-colors duration-200 outline-none
              placeholder:text-[#475569]
              focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
              ${errors.fullName ? "border-red-500/60" : "border-white/10 hover:border-white/20"}
            `}
          />
          {errors.fullName && (
            <p id="register-name-error" role="alert" className="text-xs text-red-400">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="register-email"
            className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest"
          >
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="tu@email.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "register-email-error" : undefined}
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
            <p id="register-email-error" role="alert" className="text-xs text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Contraseña Modal Trigger & Hidden Inputs */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest">
            Contraseña
          </label>
          
          {/* Inputs invisibles para react-hook-form */}
          <input type="hidden" {...register("password")} />
          <input type="hidden" {...register("confirmPassword")} />
          
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className={`
              w-full rounded-lg px-4 py-2.5 text-sm flex items-center justify-between
              border transition-colors duration-200 outline-none cursor-pointer
              focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
              ${
                passwordSet
                  ? "bg-[#22C55E]/10 border-[#22C55E]/30 text-[#22C55E] hover:bg-[#22C55E]/20"
                  : "bg-black border-white/10 text-[#F8FAFC] hover:border-white/20"
              }
            `}
          >
            <span className="flex items-center gap-2">
              {passwordSet ? (
                <ShieldCheck className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4 text-[#94A3B8]" />
              )}
              {passwordSet ? "Contraseña segura configurada" : "Configurar contraseña"}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 text-[#94A3B8]">
              {passwordSet ? "Editar" : "Requerido"}
            </span>
          </button>
          
          {(errors.password || errors.confirmPassword) && (
            <p role="alert" className="text-xs text-red-400">
              {errors.password?.message ||
                errors.confirmPassword?.message ||
                "Debes configurar una contraseña válida."}
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
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
                Creando cuenta...
              </>
            ) : (
              "Crear mi cuenta"
            )}
          </button>
        </div>

        {/* Términos */}
        <div className="space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register("acceptTerms")}
              className="mt-0.5 w-4 h-4 rounded border-white/20 bg-black text-[#22C55E] accent-[#22C55E] focus:ring-[#22C55E]/20 focus:ring-2 cursor-pointer"
            />
            <span className="text-xs text-[#475569] leading-relaxed select-none">
              Acepto los{" "}
              <a
                href="/terms"
                target="_blank"
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors underline-offset-4 hover:underline"
              >
                términos de uso
              </a>{" "}
              y la{" "}
              <a
                href="/privacy"
                target="_blank"
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors underline-offset-4 hover:underline"
              >
                política de privacidad
              </a>
              .
            </span>
          </label>
          {errors.acceptTerms && (
            <p role="alert" className="text-xs text-red-400">{errors.acceptTerms.message}</p>
          )}
        </div>
      </form>

      <PasswordModal
        isOpen={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
        onSave={handlePasswordSave}
      />
    </>
  );
}
