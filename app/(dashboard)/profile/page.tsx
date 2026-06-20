"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Save, Loader2, CheckCircle2, User, Mail, Calendar, Shield, Copy, Check } from "lucide-react";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import { uploadAvatar } from "@/lib/supabase/storage";

export default function ProfilePage() {
  const [fullName, setFullName]     = useState("");
  const [email, setEmail]           = useState("");
  const [joinedAt, setJoinedAt]     = useState("");
  const [userId, setUserId]         = useState("");
  const [avatarUrl, setAvatarUrl]   = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);
  const [saving, setSaving]         = useState(false);
  const [saved, setSaved]           = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [copiedId, setCopiedId]     = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user;
      if (u) {
        setFullName(u.user_metadata?.full_name ?? "");
        setEmail(u.email ?? "");
        setUserId(u.id);
        setJoinedAt(
          new Date(u.created_at).toLocaleDateString("es-CO", {
            year: "numeric", month: "long", day: "numeric",
          })
        );

        const { data: profile } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", u.id)
          .single();

        if (profile?.avatar_url) setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    });
  }, []);

  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() ?? "U";

  const handleAvatarUpload = async (file: File) => {
    const url = await uploadAvatar(file, userId);
    setAvatarUrl(url);

    const supabase = createClient();
    await supabase.from("profiles").update({ avatar_url: url }).eq("id", userId);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: err } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    });
    if (!err) {
      await supabase.from("profiles").update({ full_name: fullName }).eq("id", userId);
    }
    setSaving(false);
    if (err) {
      setError("Error al guardar los cambios. Intenta de nuevo.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(userId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--dash-accent)" }} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
          <span style={{ color: "var(--dash-accent)" }}>$</span> kairo profile --edit
        </p>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
          Mi Perfil
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
          Gestiona tu información personal y datos de cuenta.
        </p>
      </div>

      {/* Avatar Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border p-6 mb-6"
        style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
      >
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <AvatarUpload
            currentUrl={avatarUrl}
            userName={fullName}
            userId={userId}
            onUpload={handleAvatarUpload}
          />
          <div>
            <p className="font-bold text-lg" style={{ color: "var(--dash-text)" }}>
              {fullName || "Sin nombre"}
            </p>
            <p className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
              {email}
            </p>
            <p className="text-xs mt-2 px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 border font-mono"
              style={{ color: "var(--dash-accent)", borderColor: "rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.08)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              Activo
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border p-6 space-y-5 mb-6"
        style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--dash-text-muted)" }}>
          Información Personal
        </h2>

        {/* Nombre */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
            <User className="w-3.5 h-3.5" /> Nombre completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border transition-all duration-200"
            style={{
              background: "var(--dash-bg)",
              borderColor: "var(--dash-border)",
              color: "var(--dash-text)",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--dash-accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--dash-border)")}
          />
        </div>

        {/* Email — solo lectura */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
            <Mail className="w-3.5 h-3.5" /> Email
          </label>
          <input
            type="email"
            value={email}
            readOnly
            className="w-full rounded-lg px-4 py-2.5 text-sm outline-none border cursor-not-allowed opacity-60"
            style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
          />
          <p className="text-xs" style={{ color: "var(--dash-text-muted)" }}>
            El email no puede modificarse desde aquí.
          </p>
        </div>
      </motion.div>

      {/* Metadata */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl border p-6 mb-6"
        style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
      >
        <h2 className="text-sm font-semibold uppercase tracking-widest font-mono mb-4" style={{ color: "var(--dash-text-muted)" }}>
          Datos de Cuenta
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm" style={{ color: "var(--dash-text-muted)" }}>
              <Calendar className="w-4 h-4" /> Miembro desde
            </span>
            <span className="text-sm font-mono" style={{ color: "var(--dash-text)" }}>{joinedAt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm" style={{ color: "var(--dash-text-muted)" }}>
              <Shield className="w-4 h-4" /> ID de usuario
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono" style={{ color: "var(--dash-text)" }}>
                {userId.slice(0, 8) + "..."}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 rounded-md transition-colors"
                style={{ 
                  color: copiedId ? "var(--dash-accent)" : "var(--dash-text-muted)",
                  background: copiedId ? "rgba(34,197,94,0.1)" : "transparent"
                }}
                onMouseEnter={e => {
                  if (!copiedId) (e.currentTarget as HTMLElement).style.background = "var(--dash-surface-hover)";
                }}
                onMouseLeave={e => {
                  if (!copiedId) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
                title="Copiar ID"
              >
                {copiedId ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <div className="rounded-lg px-4 py-2.5 text-sm text-red-400 bg-red-400/10 border border-red-400/20 mb-4">
          {error}
        </div>
      )}

      {/* Save Button */}
      <motion.button
        onClick={handleSave}
        disabled={saving || saved}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        style={{ background: "var(--dash-accent)", color: "#020617" }}
      >
        {saving ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Guardando...</>
        ) : saved ? (
          <><CheckCircle2 className="w-4 h-4" /> ¡Guardado!</>
        ) : (
          <><Save className="w-4 h-4" /> Guardar cambios</>
        )}
      </motion.button>
    </div>
  );
}
