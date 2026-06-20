"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Moon, Globe, Shield, Trash2, ChevronRight, Save, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useNotificationPreferences, useSavePreferences } from "@/hooks/useNotificationPreferences";

interface ToggleProps { enabled: boolean; onChange: (v: boolean) => void; }

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none"
      style={{ background: enabled ? "var(--dash-accent)" : "var(--dash-border)" }}
      aria-checked={enabled}
      role="switch"
    >
      <span
        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300"
        style={{ transform: enabled ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

interface SettingSectionProps { title: string; children: React.ReactNode; }
function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border p-6 mb-5"
      style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
    >
      <h2 className="text-xs font-semibold uppercase tracking-widest font-mono mb-5" style={{ color: "var(--dash-text-muted)" }}>
        {title}
      </h2>
      <div className="space-y-5">{children}</div>
    </motion.div>
  );
}

interface SettingRowProps { label: string; description: string; children: React.ReactNode; }
function SettingRow({ label, description, children }: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--dash-text)" }}>{label}</p>
        <p className="text-xs mt-0.5" style={{ color: "var(--dash-text-muted)" }}>{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { data: prefs } = useNotificationPreferences();
  const savePrefs = useSavePreferences();

  const [notifEmail,   setNotifEmail]   = useState(true);
  const [notifPush,    setNotifPush]    = useState(false);
  const [notifTask,    setNotifTask]    = useState(true);
  const [notifMention, setNotifMention] = useState(true);

  // Sync local state once prefs load
  useEffect(() => {
    if (prefs) {
      setNotifEmail(prefs.email);
      setNotifPush(prefs.push);
      setNotifTask(prefs.task_assignment);
      setNotifMention(prefs.mentions);
    }
  }, [prefs]);

  // Apariencia
  const [compactMode, setCompactMode] = useState(false);
  const [animations,  setAnimations]  = useState(true);

  // Peligro
  const [deleting,    setDeleting]    = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    await savePrefs.mutateAsync({
      email: notifEmail,
      push: notifPush,
      task_assignment: notifTask,
      mentions: notifMention,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    if (confirmText !== "ELIMINAR") return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
          <span style={{ color: "var(--dash-accent)" }}>$</span> kairo settings --config
        </p>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
          Ajustes
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
          Personaliza tu experiencia en KairoTask.
        </p>
      </div>

      {/* Notificaciones */}
      <SettingSection title="🔔 Notificaciones">
        <SettingRow label="Notificaciones por email" description="Recibe resúmenes y alertas en tu bandeja de entrada.">
          <Toggle enabled={notifEmail} onChange={setNotifEmail} />
        </SettingRow>
        <SettingRow label="Notificaciones push" description="Alertas en tiempo real en el navegador.">
          <Toggle enabled={notifPush} onChange={setNotifPush} />
        </SettingRow>
        <SettingRow label="Asignación de tareas" description="Notificar cuando te asignan una tarea nueva.">
          <Toggle enabled={notifTask} onChange={setNotifTask} />
        </SettingRow>
        <SettingRow label="Menciones" description="Notificar cuando alguien te menciona en un comentario.">
          <Toggle enabled={notifMention} onChange={setNotifMention} />
        </SettingRow>
      </SettingSection>

      {/* Apariencia */}
      <SettingSection title="🎨 Apariencia">
        <SettingRow label="Modo compacto" description="Reduce el espaciado de la UI para más densidad de información.">
          <Toggle enabled={compactMode} onChange={setCompactMode} />
        </SettingRow>
        <SettingRow label="Animaciones" description="Habilitar micro-animaciones y transiciones en la interfaz.">
          <Toggle enabled={animations} onChange={setAnimations} />
        </SettingRow>
        <SettingRow label="Tema" description="El toggle principal está en el Top Bar del Dashboard (☀️/🌙).">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}>
            <Moon className="w-3.5 h-3.5" />
            Top Bar
          </div>
        </SettingRow>
      </SettingSection>

      {/* Idioma */}
      <SettingSection title="🌐 Idioma y Región">
        <SettingRow label="Idioma de la interfaz" description="Actualmente disponible en Español.">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)", background: "var(--dash-bg)" }}>
            <Globe className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Español
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--dash-text-muted)" }} />
          </div>
        </SettingRow>
      </SettingSection>

      {/* Seguridad */}
      <SettingSection title="🔐 Seguridad">
        <SettingRow label="Cambiar contraseña" description="Envía un enlace de restablecimiento a tu email.">
          <button
            onClick={async () => {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (user?.email) {
                await supabase.auth.resetPasswordForEmail(user.email);
                alert("Revisa tu email para restablecer tu contraseña.");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)", background: "var(--dash-bg)" }}
          >
            <Shield className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Restablecer
          </button>
        </SettingRow>
      </SettingSection>

      {/* Guardar */}
      <motion.button
        onClick={handleSave}
        disabled={saving || saved || isSaving}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold mb-6 transition-all duration-200 disabled:opacity-70"
        style={{ background: "var(--dash-accent)", color: "#020617" }}
      >
        {saving || isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
          : saved ? <><CheckCircle2 className="w-4 h-4" /> ¡Guardado!</>
          : <><Save className="w-4 h-4" /> Guardar preferencias</>}
      </motion.button>

      {/* Zona de peligro */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl border p-6"
        style={{ borderColor: "rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.04)" }}
      >
        <h2 className="text-xs font-semibold uppercase tracking-widest font-mono mb-1 text-red-400">
          ⚠️ Zona de Peligro
        </h2>
        <p className="text-xs text-red-400/70 mb-4">Estas acciones son irreversibles. Procede con cuidado.</p>

        {!deleting ? (
          <button
            onClick={() => setDeleting(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar cuenta
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-400">Escribe <strong>ELIMINAR</strong> para confirmar:</p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="ELIMINAR"
              className="w-full rounded-lg px-4 py-2 text-sm outline-none border border-red-500/30 bg-transparent text-red-400 placeholder:text-red-400/30"
            />
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={confirmText !== "ELIMINAR"}
                className="px-4 py-2 rounded-lg text-sm font-bold bg-red-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-all"
              >
                Confirmar eliminación
              </button>
              <button
                onClick={() => { setDeleting(false); setConfirmText(""); }}
                className="px-4 py-2 rounded-lg text-sm border transition-all"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
