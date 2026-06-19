"use client";

import React, { useEffect, useState, useRef } from "react";
import { KanbanBoard } from "@/components/project/KanbanBoard";
import {
  ArrowLeft, Settings, Users, Activity, GitBranch,
  Loader2, AlertCircle, X, Check, Clock, UserCircle,
  Palette, Save, Trash2,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useTasks } from "@/hooks/useTasks";
import { useProjectMembers } from "@/hooks/useProjectMembers";

// ── Types ────────────────────────────────────────────────────────────────────
interface ProjectMeta {
  id: string;
  name: string;
  description: string | null;
  status: string;
  progress: number;
  color: string;
  owner_id: string;
}

type PanelId = "activity" | "members" | "settings" | null;

// ── Constants ────────────────────────────────────────────────────────────────
const PROJECT_STATUSES = [
  { value: "active",  label: "Activo",      color: "#22C55E" },
  { value: "review",  label: "En revisión", color: "#A855F7" },
  { value: "pending", label: "Pendiente",   color: "#F59E0B" },
  { value: "done",    label: "Completado",  color: "#94A3B8" },
];

const PALETTE_COLORS = [
  "#22C55E", "#A855F7", "#F59E0B", "#3B82F6",
  "#EC4899", "#EF4444", "#06B6D4", "#F97316",
];

const STATUS_DOT: Record<string, string> = {
  backlog:     "#475569",
  "in-progress": "#F59E0B",
  review:      "#A855F7",
  done:        "#22C55E",
};

const STATUS_LABEL: Record<string, string> = {
  backlog:     "Backlog",
  "in-progress": "En Progreso",
  review:      "Revisión",
  done:        "Completado",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function relativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "ahora";
  if (m < 60) return `hace ${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `hace ${h}h`;
  const d = Math.floor(h / 24);
  return `hace ${d}d`;
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId }                   = React.use(params);
  const [project, setProject]           = useState<ProjectMeta | null>(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [activePanel, setActivePanel]   = useState<PanelId>(null);
  const [userEmail, setUserEmail]       = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [ownerEmail, setOwnerEmail]     = useState<string>("");
  const [ownerName, setOwnerName]       = useState<string>("");
  const panelRef                        = useRef<HTMLDivElement>(null);

  // Invite states
  const [inviteEmail, setInviteEmail]     = useState("");
  const [inviteError, setInviteError]     = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState(false);

  // Settings form state
  const [settingsName, setSettingsName]         = useState("");
  const [settingsDesc, setSettingsDesc]         = useState("");
  const [settingsStatus, setSettingsStatus]     = useState("");
  const [settingsColor, setSettingsColor]       = useState("");
  const [isSaving, setIsSaving]                 = useState(false);
  const [saveError, setSaveError]               = useState<string | null>(null);

  // Tasks & Members Hooks
  const { tasks } = useTasks(projectId);
  const {
    members,
    isLoadingMembers,
    addMember,
    updateMemberRole,
    removeMember,
  } = useProjectMembers(projectId);

  const isOwner = project?.owner_id === currentUserId;

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviteError(null);
    setInviteSuccess(false);
    try {
      await addMember.mutateAsync({ email: inviteEmail.trim() });
      setInviteEmail("");
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err: any) {
      setInviteError(err.message || "Error al invitar al miembro.");
    }
  };

  const togglePanel = (panel: PanelId) =>
    setActivePanel((prev) => (prev === panel ? null : panel));

  // Close panel on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    if (activePanel) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activePanel]);

  // Fetch project metadata + current user
  useEffect(() => {
    const supabase = createClient();
    let cancelled  = false;

    async function load() {
      setIsLoading(true);
      setFetchError(null);

      const [{ data: proj, error: projErr }, { data: { user } }] = await Promise.all([
        supabase
          .from("projects")
          .select("id, name, description, status, progress, color, owner_id")
          .eq("id", projectId)
          .single(),
        supabase.auth.getUser(),
      ]);

      if (cancelled) return;

      if (projErr || !proj) {
        setFetchError("No se pudo cargar el proyecto.");
      } else {
        setProject(proj as ProjectMeta);
        setSettingsName(proj.name);
        setSettingsDesc(proj.description ?? "");
        setSettingsStatus(proj.status);
        setSettingsColor(proj.color);

        // Fetch owner details
        if (proj.owner_id) {
          const { data: oProfile } = await supabase
            .from("profiles")
            .select("email, full_name")
            .eq("id", proj.owner_id)
            .single();
          if (oProfile && !cancelled) {
            setOwnerEmail(oProfile.email);
            setOwnerName(oProfile.full_name || "");
          }
        }
      }
      setUserEmail(user?.email ?? "");
      setCurrentUserId(user?.id ?? "");
      setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [projectId]);

  // Save settings
  const handleSaveSettings = async () => {
    if (!project || !settingsName.trim()) return;
    setIsSaving(true);
    setSaveError(null);

    const supabase = createClient();
    const updates  = {
      name:        settingsName.trim(),
      description: settingsDesc.trim() || null,
      status:      settingsStatus,
      color:       settingsColor,
    };

    const { error } = await supabase
      .from("projects")
      .update(updates)
      .eq("id", project.id);

    if (error) {
      setSaveError(error.message);
    } else {
      setProject((p) => p ? { ...p, ...updates } : p);
      setActivePanel(null);
    }
    setIsSaving(false);
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full gap-3">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#22C55E" }} />
        <span className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
          cargando proyecto…
        </span>
      </div>
    );
  }

  if (fetchError || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="w-8 h-8" style={{ color: "#EF4444" }} />
        <p className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
          {fetchError ?? "Proyecto no encontrado."}
        </p>
        <Link href="/projects" className="text-xs font-mono underline" style={{ color: "#22C55E" }}>
          ← volver a proyectos
        </Link>
      </div>
    );
  }

  const accentColor = project.color ?? "#22C55E";
  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);

  const currentStatusCfg = PROJECT_STATUSES.find((s) => s.value === project.status);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b border-white/10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 text-xs font-mono text-[#475569] mb-4">
          <Link href="/projects" className="flex items-center gap-1.5 hover:text-[#94A3B8] transition-colors">
            <ArrowLeft className="w-3 h-3" />
            proyectos
          </Link>
          <span style={{ color: accentColor }}>/</span>
          <span className="text-[#F8FAFC] truncate max-w-[200px]">{project.name}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          {/* Name + status */}
          <div>
            <h1 className="text-xl font-black text-[#F8FAFC] tracking-tight">{project.name}</h1>
            <p className="text-xs font-mono mt-1 flex items-center gap-2">
              <GitBranch className="w-3 h-3 text-[#475569]" />
              <span style={{ color: currentStatusCfg?.color ?? "#475569" }}>
                {currentStatusCfg?.label ?? project.status}
              </span>
              {typeof project.progress === "number" && (
                <>
                  <span className="ml-2" style={{ color: accentColor }}>●</span>
                  <span style={{ color: accentColor }}>{project.progress}% completado</span>
                </>
              )}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2" ref={panelRef}>
            {/* Progress bar */}
            {typeof project.progress === "number" && (
              <div className="h-1.5 w-32 rounded-full bg-white/5 overflow-hidden hidden md:block">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: accentColor, boxShadow: `0 0 10px ${accentColor}60` }}
                />
              </div>
            )}

            {/* ── Activity button ── */}
            <div className="relative">
              <button
                onClick={() => togglePanel("activity")}
                title="Actividad"
                className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                style={{
                  borderColor: activePanel === "activity" ? accentColor + "60" : "rgba(255,255,255,0.1)",
                  color:       activePanel === "activity" ? accentColor : "#475569",
                  background:  activePanel === "activity" ? accentColor + "15" : "transparent",
                }}
              >
                <Activity className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activePanel === "activity" && (
                  <motion.div
                    key="activity-panel"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-11 z-30 w-72 rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--dash-border)" }}>
                      <span className="text-xs font-mono font-semibold" style={{ color: "var(--dash-text)" }}>
                        Actividad reciente
                      </span>
                      <button onClick={() => setActivePanel(null)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-3 max-h-72 overflow-y-auto">
                      {recentTasks.length === 0 ? (
                        <div className="flex flex-col items-center py-8 gap-2">
                          <Clock className="w-6 h-6" style={{ color: "var(--dash-text-muted)" }} />
                          <p className="text-xs font-mono text-center" style={{ color: "var(--dash-text-muted)" }}>
                            No hay actividad aún.<br />Crea tu primera tarea.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {recentTasks.map((task) => (
                            <div key={task.id} className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
                              <span
                                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                                style={{
                                  background: STATUS_DOT[task.status] ?? "#475569",
                                  boxShadow:  `0 0 5px ${STATUS_DOT[task.status] ?? "#475569"}`,
                                }}
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-medium truncate" style={{ color: "var(--dash-text)" }}>
                                  {task.title}
                                </p>
                                <p className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                                  {STATUS_LABEL[task.status] ?? task.status} · {relativeTime(task.updated_at)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Members button ── */}
            <div className="relative">
              <button
                onClick={() => togglePanel("members")}
                title="Miembros"
                className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                style={{
                  borderColor: activePanel === "members" ? accentColor + "60" : "rgba(255,255,255,0.1)",
                  color:       activePanel === "members" ? accentColor : "#475569",
                  background:  activePanel === "members" ? accentColor + "15" : "transparent",
                }}
              >
                <Users className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activePanel === "members" && (
                  <motion.div
                    key="members-panel"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-11 z-30 w-64 rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--dash-border)" }}>
                      <span className="text-xs font-mono font-semibold" style={{ color: "var(--dash-text)" }}>Miembros</span>
                      <button onClick={() => setActivePanel(null)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Owner list item */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: accentColor, background: accentColor + "20" }}
                          >
                            <UserCircle className="w-5 h-5" style={{ color: accentColor }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: "var(--dash-text)" }}>
                              {ownerName || ownerEmail || "Dueño"}
                            </p>
                            <p className="text-[10px] truncate" style={{ color: "var(--dash-text-muted)" }}>
                              {ownerEmail}
                            </p>
                          </div>
                        </div>
                        <span
                          className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border shrink-0"
                          style={{ color: accentColor, borderColor: accentColor + "40", background: accentColor + "15" }}
                        >
                          Dueño
                        </span>
                      </div>

                      {/* Collaborators list */}
                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {isLoadingMembers ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
                          </div>
                        ) : members.length === 0 ? (
                          <p className="text-[10px] font-mono text-center" style={{ color: "var(--dash-text-muted)" }}>
                            No hay colaboradores agregados.
                          </p>
                        ) : (
                          members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
                                  style={{ borderColor: "var(--dash-border)", background: "var(--dash-surface-hover)" }}
                                >
                                  <span className="text-[10px] font-mono text-center">
                                    {(member.profile?.full_name || member.profile?.email || "C")[0].toUpperCase()}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-semibold truncate" style={{ color: "var(--dash-text)" }}>
                                    {member.profile?.full_name || member.profile?.email}
                                  </p>
                                  <p className="text-[10px] truncate" style={{ color: "var(--dash-text-muted)" }}>
                                    {member.profile?.email}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                {isOwner ? (
                                  <>
                                    <select
                                      value={member.role}
                                      onChange={async (e) => {
                                        try {
                                          await updateMemberRole.mutateAsync({
                                            memberId: member.id,
                                            role: e.target.value as any,
                                          });
                                        } catch (err: any) {
                                          alert(err.message);
                                        }
                                      }}
                                      className="text-[10px] font-mono bg-[#020617] border rounded px-1 py-0.5 outline-none cursor-pointer"
                                      style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                                    >
                                      <option value="collaborator">Colab.</option>
                                      <option value="viewer">Lector</option>
                                    </select>
                                    <button
                                      onClick={async () => {
                                        if (confirm(`¿Remover a ${member.profile?.email} del proyecto?`)) {
                                          try {
                                            await removeMember.mutateAsync(member.id);
                                          } catch (err: any) {
                                            alert(err.message);
                                          }
                                        }
                                      }}
                                      className="p-1 rounded text-red-400 hover:bg-red-400/10 transition-colors"
                                      title="Remover"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                                    {member.role === "collaborator" ? "Colab." : "Lector"}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Invite form (only visible to project owner) */}
                      {isOwner && (
                        <form onSubmit={handleInviteMember} className="pt-3 border-t space-y-2" style={{ borderColor: "var(--dash-border)" }}>
                          <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                            Invitar nuevo miembro
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="email"
                              value={inviteEmail}
                              onChange={(e) => setInviteEmail(e.target.value)}
                              placeholder="email@dominio.com"
                              className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none border transition-all duration-200 min-w-0"
                              style={{
                                background: "var(--dash-bg)",
                                borderColor: "var(--dash-border)",
                                color: "var(--dash-text)",
                              }}
                              onFocus={e => (e.target.style.borderColor = accentColor)}
                              onBlur={e => (e.target.style.borderColor = "var(--dash-border)")}
                            />
                            <button
                              type="submit"
                              disabled={addMember.isPending}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                              style={{ background: accentColor, color: "#020617" }}
                            >
                              {addMember.isPending ? "Añadiendo..." : "Añadir"}
                            </button>
                          </div>
                          {inviteError && (
                            <p className="text-[10px] text-red-400 font-mono mt-1 leading-normal">{inviteError}</p>
                          )}
                          {inviteSuccess && (
                            <p className="text-[10px] text-green-400 font-mono mt-1">¡Invitación agregada con éxito!</p>
                          )}
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ── Settings button ── */}
            <div className="relative">
              <button
                onClick={() => togglePanel("settings")}
                title="Configuración"
                className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                style={{
                  borderColor: activePanel === "settings" ? accentColor + "60" : "rgba(255,255,255,0.1)",
                  color:       activePanel === "settings" ? accentColor : "#475569",
                  background:  activePanel === "settings" ? accentColor + "15" : "transparent",
                }}
              >
                <Settings className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {activePanel === "settings" && (
                  <motion.div
                    key="settings-panel"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute right-0 top-11 z-30 w-80 rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--dash-border)" }}>
                      <span className="text-xs font-mono font-semibold flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
                        <Settings className="w-3.5 h-3.5" style={{ color: accentColor }} />
                        Ajustes del proyecto
                      </span>
                      <button onClick={() => setActivePanel(null)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                          Nombre
                        </label>
                        <input
                          value={settingsName}
                          onChange={(e) => setSettingsName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none transition-all"
                          style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                          onFocus={(e)  => (e.currentTarget.style.borderColor = accentColor)}
                          onBlur={(e)   => (e.currentTarget.style.borderColor = "var(--dash-border)")}
                        />
                      </div>

                      {/* Description */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                          Descripción
                        </label>
                        <textarea
                          value={settingsDesc}
                          onChange={(e) => setSettingsDesc(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all resize-none"
                          style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                          onFocus={(e)  => (e.currentTarget.style.borderColor = accentColor)}
                          onBlur={(e)   => (e.currentTarget.style.borderColor = "var(--dash-border)")}
                        />
                      </div>

                      {/* Status */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
                          Estado
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {PROJECT_STATUSES.map((s) => (
                            <button
                              key={s.value}
                              type="button"
                              onClick={() => setSettingsStatus(s.value)}
                              className="px-2 py-1.5 rounded-lg border text-[11px] font-mono transition-all"
                              style={{
                                color:       settingsStatus === s.value ? s.color : "var(--dash-text-muted)",
                                background:  settingsStatus === s.value ? s.color + "18" : "var(--dash-bg)",
                                borderColor: settingsStatus === s.value ? s.color + "50" : "var(--dash-border)",
                              }}
                            >
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Color */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1" style={{ color: "var(--dash-text-muted)" }}>
                          <Palette className="w-3 h-3" /> Color del proyecto
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {PALETTE_COLORS.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSettingsColor(c)}
                              className="w-6 h-6 rounded-full border-2 transition-all"
                              style={{
                                background:  c,
                                borderColor: settingsColor === c ? "#fff" : "transparent",
                                boxShadow:   settingsColor === c ? `0 0 8px ${c}` : "none",
                                transform:   settingsColor === c ? "scale(1.15)" : "scale(1)",
                              }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Error */}
                      <AnimatePresence>
                        {saveError && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-[11px] font-mono flex items-center gap-1"
                            style={{ color: "#EF4444" }}
                          >
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {saveError}
                          </motion.p>
                        )}
                      </AnimatePresence>

                      {/* Save */}
                      <button
                        onClick={handleSaveSettings}
                        disabled={isSaving || !settingsName.trim()}
                        className="w-full py-2 rounded-lg text-sm font-mono font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        style={{
                          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                          color:      "#fff",
                          boxShadow:  `0 0 18px ${accentColor}40`,
                        }}
                      >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? "Guardando…" : "Guardar cambios"}
                      </button>

                      {/* Danger zone */}
                      <div className="pt-1 border-t" style={{ borderColor: "var(--dash-border)" }}>
                        <button
                          disabled
                          className="w-full py-2 rounded-lg text-xs font-mono border border-dashed flex items-center justify-center gap-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ borderColor: "#EF444440", color: "#EF4444" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Eliminar proyecto — próximamente
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── Kanban Board ── */}
      <div className="flex-1 overflow-hidden p-6">
        <KanbanBoard projectId={project.id} />
      </div>
    </div>
  );
}
