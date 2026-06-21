"use client";

import { useLocale } from "next-intl";
import { setCookie } from "@/lib/cookie";
import { Globe } from "lucide-react";
import { useRouter } from "next/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const toggle = () => {
    const next = locale === "es" ? "en" : "es";
    setCookie("NEXT_LOCALE", next, 365);
    router.refresh();
  };

  return (
    <button
      onClick={toggle}
      className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all hover:bg-white/5"
      style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
      title={locale === "es" ? "Switch to English" : "Cambiar a Español"}
    >
      <Globe className="w-4 h-4" />
    </button>
  );
}
