"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ShieldCheck, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Mínimo 8 caracteres");
      return;
    }
    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setIsSubmitting(false);

    if (updateError) {
      console.error("[update-password] error:", updateError.message);
      setError("Error al actualizar la contraseña. Intenta de nuevo.");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 3000);
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="w-full max-w-md text-center space-y-5">
          <div className="flex justify-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-[#22C55E]/10">
              <CheckCircle2 className="w-7 h-7 text-[#22C55E]" />
            </div>
          </div>
          <p className="text-lg font-semibold text-[#F8FAFC]">
            Contraseña actualizada
          </p>
          <p className="text-sm text-[#94A3B8]">
            Tu contraseña se ha actualizado correctamente. Redirigiendo al inicio de sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-[#22C55E]/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-6 h-6 text-[#22C55E]" />
          </div>
          <h1 className="text-xl font-semibold text-[#F8FAFC]">
            Actualizar contraseña
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg px-4 py-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20"
            >
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="
                  w-full rounded-lg px-4 py-2.5 pr-11 text-sm text-[#F8FAFC]
                  bg-black border border-white/10 transition-colors duration-200 outline-none
                  placeholder:text-[#475569]
                  focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
                "
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#475569] hover:text-[#94A3B8] transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest">
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repite la contraseña"
              className="
                w-full rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC]
                bg-black border border-white/10 transition-colors duration-200 outline-none
                placeholder:text-[#475569]
                focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
              "
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full rounded-lg px-4 py-2.5 text-sm font-semibold
              bg-[#22C55E] text-[#020617]
              hover:bg-[#16A34A] active:scale-[0.98]
              transition-all duration-200 cursor-pointer
              disabled:opacity-60 disabled:cursor-not-allowed
              flex items-center justify-center gap-2
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Actualizando...
              </>
            ) : (
              "Actualizar contraseña"
            )}
          </button>

          <div className="text-center">
            <Link
              href="/login"
              className="text-xs text-[#94A3B8] hover:text-[#22C55E] transition-colors"
            >
              Volver a inicio de sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
