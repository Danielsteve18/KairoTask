"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, LayoutDashboard } from "lucide-react";

export default function ConfirmedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNew = searchParams.get("first") === "true";

  const [onboardingDone] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("onboarding_completed") === "true" : false
  );
  const [onboardingDismissed] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("onboarding_dismissed") === "true" : false
  );

  const showTour = isNew || (!onboardingDone && !onboardingDismissed);

  function handleStartTour() {
    localStorage.setItem("onboarding_pending", "true");
    router.push("/dashboard?tour=true");
  }

  function handleGoToDashboard() {
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md text-center space-y-6"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
          </div>
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-[#F8FAFC]">
            Email confirmado
          </h1>
          <p className="text-sm text-[#94A3B8] leading-relaxed">
            Tu cuenta está lista. Bienvenido a KairoTask.
          </p>
        </div>

        {showTour ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <button
              onClick={handleStartTour}
              className="
                w-full rounded-lg px-4 py-2.5 text-sm font-semibold
                bg-[#22C55E] text-[#020617]
                hover:bg-[#16A34A] active:scale-[0.98]
                transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
              "
            >
              Comenzar tour guiado
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleGoToDashboard}
              className="
                w-full rounded-lg px-4 py-2.5 text-sm font-medium
                border border-white/10 text-[#94A3B8]
                hover:border-white/20 hover:text-[#F8FAFC]
                transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
              "
            >
              Ir al dashboard
              <LayoutDashboard className="w-4 h-4" />
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={handleGoToDashboard}
            className="
              w-full rounded-lg px-4 py-2.5 text-sm font-semibold
              bg-[#22C55E] text-[#020617]
              hover:bg-[#16A34A] active:scale-[0.98]
              transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer
            "
          >
            Ir al dashboard
            <LayoutDashboard className="w-4 h-4" />
          </motion.button>
        )}

        <p className="text-[10px] text-[#475569] font-mono">
          $ kairo.auth.confirmed
        </p>
      </motion.div>
    </div>
  );
}
