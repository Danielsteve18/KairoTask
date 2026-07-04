"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Moon, Globe, Shield, Trash2, ChevronRight, Save, Loader2, CheckCircle2, Plus, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { useRouter } from "next/navigation";
import { useNotificationPreferences, useSavePreferences } from "@/hooks/useNotificationPreferences";
import { useWebhooks, useCreateWebhook, useDeleteWebhook, useToggleWebhook } from "@/hooks/useWebhooks";
import { useProjects } from "@/hooks/useProjects";

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
  const t = useTranslations("settings");
  const tc = useTranslations("common");
  const { data: prefs } = useNotificationPreferences();
  const savePrefs = useSavePreferences();

  const [localPrefs, setLocalPrefs] = useState<{
    email: boolean; push: boolean; task_assignment: boolean; mentions: boolean;
  } | null>(null);

  const effective = localPrefs ?? prefs ?? { email: true, push: false, task_assignment: true, mentions: true };

  // Webhooks
  const { data: webhooks } = useWebhooks();
  const createWebhook = useCreateWebhook();
  const deleteWebhook = useDeleteWebhook();
  const toggleWebhook = useToggleWebhook();
  const { projects } = useProjects();
  const [showAddWebhook, setShowAddWebhook] = useState(false);
  const [whProject, setWhProject] = useState("");
  const [whName, setWhName] = useState("");
  const [whUrl, setWhUrl] = useState("");
  const [whEvents, setWhEvents] = useState<string[]>(["task.created"]);
  const WH_EVENT_OPTIONS = [
    { value: "task.created", label: "Tarea creada" },
    { value: "task.updated", label: "Tarea actualizada" },
    { value: "task.deleted", label: "Tarea eliminada" },
    { value: "task.completed", label: "Tarea completada" },
    { value: "sprint.created", label: "Sprint creado" },
    { value: "member.added", label: "Miembro añadido" },
  ];

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
    await savePrefs.mutateAsync(effective);
    setLocalPrefs(null);
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
          {t("title")}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
          {t("subtitle")}
        </p>
      </div>

      {/* Notificaciones */}
      <SettingSection title={"🔔 " + t("notifications")}>
        <SettingRow label={t("emailNotifications")} description={t("emailNotificationsDesc")}>
          <Toggle enabled={effective.email} onChange={(v) => setLocalPrefs((p) => ({ ...(p ?? prefs ?? { email: true, push: false, task_assignment: true, mentions: true }), email: v }))} />
        </SettingRow>
        <SettingRow label={t("pushNotifications")} description={t("pushNotificationsDesc")}>
          <Toggle enabled={effective.push} onChange={(v) => setLocalPrefs((p) => ({ ...(p ?? prefs ?? { email: true, push: false, task_assignment: true, mentions: true }), push: v }))} />
        </SettingRow>
        <SettingRow label={t("taskAssignment")} description={t("taskAssignmentDesc")}>
          <Toggle enabled={effective.task_assignment} onChange={(v) => setLocalPrefs((p) => ({ ...(p ?? prefs ?? { email: true, push: false, task_assignment: true, mentions: true }), task_assignment: v }))} />
        </SettingRow>
        <SettingRow label={t("mentions")} description={t("mentionsDesc")}>
          <Toggle enabled={effective.mentions} onChange={(v) => setLocalPrefs((p) => ({ ...(p ?? prefs ?? { email: true, push: false, task_assignment: true, mentions: true }), mentions: v }))} />
        </SettingRow>
      </SettingSection>

      {/* Webhooks */}
      <SettingSection title={"🔗 " + t("webhooks")}>
        <div className="space-y-3">
          {(!webhooks || webhooks.length === 0) ? (
            <p className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>
              {t("noWebhooks")}
            </p>
          ) : (
            webhooks.map((wh) => (
              <div key={wh.id}
                className="flex items-center justify-between gap-3 p-3 rounded-lg border"
                style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)" }}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate" style={{ color: "var(--dash-text)" }}>{wh.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full" style={{
                      background: wh.is_active ? "rgba(34,197,94,0.12)" : "rgba(148,163,184,0.12)",
                      color: wh.is_active ? "#22C55E" : "var(--dash-text-muted)",
                    }}>
                      {wh.is_active ? t("active") : t("inactive")}
                    </span>
                  </div>
                  <p className="text-[11px] font-mono truncate mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
                    {wh.url}
                  </p>
                  {wh.project && (
                    <span className="text-[10px] font-mono" style={{ color: wh.project.color }}>
                      {wh.project.name}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggleWebhook.mutate({ id: wh.id, is_active: !wh.is_active })}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all"
                    style={{
                      borderColor: wh.is_active ? "rgba(34,197,94,0.3)" : "var(--dash-border)",
                      color: wh.is_active ? "#22C55E" : "var(--dash-text-muted)",
                    }}
                    title={wh.is_active ? "Desactivar" : "Activar"}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => { if (confirm(`¿Eliminar webhook "${wh.name}"?`)) deleteWebhook.mutate(wh.id); }}
                    className="w-7 h-7 rounded-lg flex items-center justify-center border transition-all hover:border-red-500/30 hover:text-red-400"
                    style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {!showAddWebhook ? (
          <button
            onClick={() => setShowAddWebhook(true)}
            className="mt-3 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono border transition-all hover:bg-white/5 w-full justify-center"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
          >
            <Plus className="w-3.5 h-3.5" /> {t("addWebhook")}
          </button>
        ) : (
          <div className="mt-3 p-4 rounded-lg border space-y-3" style={{ borderColor: "var(--dash-border)", background: "var(--dash-bg)" }}>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("project")}</label>
              <select value={whProject} onChange={(e) => setWhProject(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}>
                <option value="">{t("selectProject")}</option>
                {(projects ?? []).map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("name")}</label>
              <input value={whName} onChange={(e) => setWhName(e.target.value)}
                placeholder="Mi webhook"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("url")}</label>
              <input value={whUrl} onChange={(e) => setWhUrl(e.target.value)}
                placeholder="https://ejemplo.com/webhook"
                className="w-full px-3 py-2 rounded-lg border text-sm outline-none font-mono"
                style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("events")}</label>
              <div className="flex flex-wrap gap-1.5">
                {WH_EVENT_OPTIONS.map((ev) => {
                  const selected = whEvents.includes(ev.value);
                  return (
                    <button key={ev.value} type="button" onClick={() => {
                      setWhEvents((prev) =>
                        selected ? prev.filter((v) => v !== ev.value) : [...prev, ev.value]
                      );
                    }}
                      className="px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all"
                      style={{
                        background: selected ? "rgba(34,197,94,0.12)" : "transparent",
                        borderColor: selected ? "rgba(34,197,94,0.3)" : "var(--dash-border)",
                        color: selected ? "#22C55E" : "var(--dash-text-muted)",
                      }}>
                      {ev.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={async () => {
                  if (!whProject || !whName.trim() || !whUrl.trim() || whEvents.length === 0) return;
                  await createWebhook.mutateAsync({
                    project_id: whProject,
                    name: whName.trim(),
                    url: whUrl.trim(),
                    events: whEvents,
                  });
                  setWhProject(""); setWhName(""); setWhUrl(""); setWhEvents(["task.created"]);
                  setShowAddWebhook(false);
                }}
                disabled={createWebhook.isPending || !whProject || !whName.trim() || !whUrl.trim() || whEvents.length === 0}
                className="flex-1 py-2 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                style={{ background: "var(--dash-accent)", color: "#020617" }}
              >
                {createWebhook.isPending ? tc("loading") : t("createWebhook")}
              </button>
              <button onClick={() => setShowAddWebhook(false)}
                className="px-4 py-2 rounded-lg text-xs font-mono border transition-all"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}>
                {tc("cancel")}
              </button>
            </div>
          </div>
        )}
      </SettingSection>

      {/* Apariencia */}
      <SettingSection title={"🎨 " + t("appearance")}>
        <SettingRow label={t("compactMode")} description={t("compactModeDesc")}>
          <Toggle enabled={compactMode} onChange={setCompactMode} />
        </SettingRow>
        <SettingRow label={t("animations")} description={t("animationsDesc")}>
          <Toggle enabled={animations} onChange={setAnimations} />
        </SettingRow>
        <SettingRow label={t("theme")} description={t("themeDesc")}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}>
            <Moon className="w-3.5 h-3.5" />
            Top Bar
          </div>
        </SettingRow>
      </SettingSection>

      {/* Idioma */}
      <SettingSection title={"🌐 " + t("language")}>
        <SettingRow label={t("languageDesc")} description={t("availableSpanish")}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)", background: "var(--dash-bg)" }}>
            <Globe className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            Español
            <ChevronRight className="w-3.5 h-3.5" style={{ color: "var(--dash-text-muted)" }} />
          </div>
        </SettingRow>
      </SettingSection>

      {/* Seguridad */}
      <SettingSection title={"🔐 " + t("security")}>
        <SettingRow label={t("changePassword")} description={t("changePasswordDesc")}>
          <button
            onClick={async () => {
              const supabase = createClient();
              const { data: { user } } = await supabase.auth.getUser();
              if (user?.email) {
                await supabase.auth.resetPasswordForEmail(user.email, {
                  redirectTo: `${getBaseUrl()}/auth/update-password`,
                });
                alert("Revisa tu email para restablecer tu contraseña.");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all"
            style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)", background: "var(--dash-bg)" }}
          >
            <Shield className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            {t("reset")}
          </button>
        </SettingRow>
      </SettingSection>

      {/* Guardar */}
      <motion.button
        onClick={handleSave}
        disabled={saving || saved || savePrefs.isPending}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold mb-6 transition-all duration-200 disabled:opacity-70"
        style={{ background: "var(--dash-accent)", color: "#020617" }}
      >
        {saving || savePrefs.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("saving")}</>
          : saved ? <><CheckCircle2 className="w-4 h-4" /> {t("saved")}</>
          : <><Save className="w-4 h-4" /> {t("savePreferences")}</>}
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
          {"⚠️ " + t("dangerZone")}
        </h2>
        <p className="text-xs text-red-400/70 mb-4">{t("dangerZoneDesc")}</p>

        {!deleting ? (
          <button
            onClick={() => setDeleting(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            {t("deleteAccount")}
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-400">{t("deleteAccountConfirm")}</p>
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
                {t("confirmDelete")}
              </button>
              <button
                onClick={() => { setDeleting(false); setConfirmText(""); }}
                className="px-4 py-2 rounded-lg text-sm border transition-all"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
              >
                {tc("cancel")}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
