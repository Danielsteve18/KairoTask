"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Lock, ShieldCheck, KeyRound } from "lucide-react";

interface PasswordModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (password: string) => void;
}

export function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (!password) return { score: 0, label: "", color: "transparent" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Muy débil", color: "#EF4444" };
  if (score === 2) return { score, label: "Débil", color: "#F97316" };
  if (score === 3) return { score, label: "Moderada", color: "#EAB308" };
  if (score === 4) return { score, label: "Fuerte", color: "#22C55E" };
  return { score, label: "Muy fuerte", color: "#10B981" };
}

export function PasswordModal({
  isOpen,
  onOpenChange,
  onSave,
}: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reset inputs when modal opens
  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setConfirm("");
      setShowPassword(false);
    }
  }, [isOpen]);

  const strength = getPasswordStrength(password);
  
  // Reglas de validación
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const doPasswordsMatch = password === confirm && password.length > 0;
  
  const isValid = hasMinLength && hasUppercase && hasNumber && doPasswordsMatch;

  function handleSave() {
    if (isValid) {
      onSave(password);
      onOpenChange(false);
    }
  }

  function generateSecurePassword() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let gen = "";
    for (let i = 0; i < 16; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Asegurarse de que cumpla los requisitos
    if (!/[A-Z]/.test(gen)) gen += "A";
    if (!/[0-9]/.test(gen)) gen += "1";
    
    setPassword(gen);
    setConfirm(gen);
    setShowPassword(true); // Mostrarla para que el usuario la vea
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#09090B] border-white/10 text-white sm:max-w-md p-6">
        <DialogHeader className="mb-4">
          <div className="w-10 h-10 rounded-full bg-[#22C55E]/10 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-[#22C55E]" />
          </div>
          <DialogTitle className="text-xl tracking-tight text-[#F8FAFC]">
            Contraseña segura
          </DialogTitle>
          <DialogDescription className="text-[#94A3B8]">
            Crea o genera una contraseña segura para tu bóveda de KairoTask.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Escribe tu contraseña"
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
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#94A3B8] uppercase tracking-widest">
              Confirmar contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repítela"
              className={`
                w-full rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC]
                bg-black border transition-colors duration-200 outline-none
                placeholder:text-[#475569]
                focus:border-[#22C55E] focus:ring-2 focus:ring-[#22C55E]/20
                ${
                  confirm.length > 0 && !doPasswordsMatch
                    ? "border-red-500/60"
                    : "border-white/10 hover:border-white/20"
                }
              `}
            />
          </div>

          {/* Requisitos y Fuerza */}
          <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 space-y-3 mt-2">
            {/* Fuerza visual */}
            <div className="space-y-1.5">
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      background:
                        i < strength.score ? strength.color : "#27272A",
                    }}
                  />
                ))}
              </div>
              {password && (
                <p className="text-xs text-right" style={{ color: strength.color }}>
                  {strength.label}
                </p>
              )}
            </div>

            {/* Checklist */}
            <ul className="text-xs space-y-1.5 text-[#94A3B8]">
              <li className={`flex items-center gap-2 ${hasMinLength ? "text-[#22C55E]" : ""}`}>
                <div className={`w-1 h-1 rounded-full ${hasMinLength ? "bg-[#22C55E]" : "bg-[#475569]"}`} />
                Mínimo 8 caracteres
              </li>
              <li className={`flex items-center gap-2 ${hasUppercase ? "text-[#22C55E]" : ""}`}>
                <div className={`w-1 h-1 rounded-full ${hasUppercase ? "bg-[#22C55E]" : "bg-[#475569]"}`} />
                Al menos una letra mayúscula
              </li>
              <li className={`flex items-center gap-2 ${hasNumber ? "text-[#22C55E]" : ""}`}>
                <div className={`w-1 h-1 rounded-full ${hasNumber ? "bg-[#22C55E]" : "bg-[#475569]"}`} />
                Al menos un número
              </li>
              <li className={`flex items-center gap-2 ${doPasswordsMatch ? "text-[#22C55E]" : ""}`}>
                <div className={`w-1 h-1 rounded-full ${doPasswordsMatch ? "bg-[#22C55E]" : "bg-[#475569]"}`} />
                Las contraseñas coinciden
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={generateSecurePassword}
              className="text-xs text-[#94A3B8] hover:text-[#22C55E] transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Generar contraseña
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid}
              className="
                rounded-lg px-4 py-2 text-sm font-semibold
                bg-[#22C55E] text-[#020617]
                hover:bg-[#16A34A] active:scale-[0.98]
                transition-all duration-200 cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Confirmar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
