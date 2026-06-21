"use client";

import React, { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { KanbanBoard } from "@/components/project/KanbanBoard";
import { ActivityFeed } from "@/components/project/ActivityFeed";
import { SprintPanel } from "@/components/project/SprintPanel";
import { CalendarView } from "@/components/project/CalendarView";
import { GanttChart } from "@/components/project/GanttChart";
import { AnalyticsPanel } from "@/components/project/AnalyticsPanel";
import { ExportImportModal } from "@/components/project/ExportImportModal";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import { CardSkeleton } from "@/components/ui/Skeleton";
import {
  ArrowLeft, Settings, Users, Activity, GitBranch,
  Loader2, AlertCircle, X, UserCircle,
  Palette, Save, Trash2, Hash, AtSign,
  Sprout, Calendar, BarChart3, GanttChartSquare,
  Download, Rows3, Kanban,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { useProjects } from "@/hooks/useProjects";
import dynamic from "next/dynamic";

const CustomFieldsManager = dynamic(
  () => import("@/components/project/CustomFieldsManager").then((m) => m.CustomFieldsManager),
  { loading: () => <CardSkeleton />, ssr: false }
);

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
type ViewTab = "kanban" | "sprints" | "calendar" | "gantt" | "analytics";

const PROJECT_STATUSES = (tStatus: (key: string) => string) => [
  { value: "active",  label: tStatus("active"),  color: "#22C55E" },
  { value: "review",  label: tStatus("review"),  color: "#A855F7" },
  { value: "pending", label: tStatus("pending"), color: "#F59E0B" },
  { value: "done",    label: tStatus("done"),    color: "#94A3B8" },
];

const PALETTE_COLORS = [
  "#22C55E", "#A855F7", "#F59E0B", "#3B82F6",
  "#EC4899", "#EF4444", "#06B6D4", "#F97316",
];

const VIEW_TABS = (tv: (key: string) => string): { id: ViewTab; label: string; icon: React.ElementType }[] => [
  { id: "kanban", label: tv("kanban"), icon: Kanban },
  { id: "sprints", label: tv("sprints"), icon: Sprout },
  { id: "calendar", label: tv("calendar"), icon: Calendar },
  { id: "gantt", label: tv("gantt"), icon: GanttChartSquare },
  { id: "analytics", label: tv("analytics"), icon: BarChart3 },
];

export default function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const t = useTranslations("project");
  const tp = useTranslations("projects");
  const ts = useTranslations("projects.status");
  const tc = useTranslations("common");
  const { projectId }                   = React.use(params);
  const [project, setProject]           = useState<ProjectMeta | null>(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [fetchError, setFetchError]     = useState<string | null>(null);
  const [activePanel, setActivePanel]   = useState<PanelId>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [ownerEmail, setOwnerEmail]     = useState<string>("");
  const [ownerName, setOwnerName]       = useState<string>("");
  const [activeView, setActiveView]     = useState<ViewTab>("kanban");
  const [showExportImport, setShowExportImport] = useState(false);
  const panelRef                        = useRef<HTMLDivElement>(null);

  const [inviteMode, setInviteMode]         = useState<"email" | "id">("email");
  const [inviteValue, setInviteValue]       = useState("");
  const [inviteError, setInviteError]       = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess]   = useState(false);

  const [settingsName, setSettingsName]         = useState("");
  const [settingsDesc, setSettingsDesc]         = useState("");
  const [settingsStatus, setSettingsStatus]     = useState("");
  const [settingsColor, setSettingsColor]       = useState("");
  const [isSaving, setIsSaving]                 = useState(false);
  const [saveError, setSaveError]               = useState<string | null>(null);

  const [isDeleting, setIsDeleting]             = useState(false);
  const [confirmDeleteText, setConfirmDeleteText] = useState("");
  const router = useRouter();
  const { deleteProject } = useProjects();

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
    if (!inviteValue.trim()) return;
    setInviteError(null);
    setInviteSuccess(false);
    try {
      const payload = inviteMode === "email"
        ? { email: inviteValue.trim() }
        : { userId: inviteValue.trim() };
      await addMember.mutateAsync(payload);
      setInviteValue("");
      setInviteSuccess(true);
      setTimeout(() => setInviteSuccess(false), 3000);
    } catch (err: unknown) {
      setInviteError(err instanceof Error ? err.message : t("inviteError"));
    }
  };

  const togglePanel = (panel: PanelId) =>
    setActivePanel((prev) => (prev === panel ? null : panel));

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setActivePanel(null);
      }
    };
    if (activePanel) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [activePanel]);

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
        setFetchError(t("loadError"));
      } else {
        setProject(proj as ProjectMeta);
        setSettingsName(proj.name);
        setSettingsDesc(proj.description ?? "");
        setSettingsStatus(proj.status);
        setSettingsColor(proj.color);

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
      setCurrentUserId(user?.id ?? "");
      setIsLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, [projectId]);

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

  const handleDeleteProject = async () => {
    if (!project) return;
    setIsDeleting(true);
    try {
      await deleteProject.mutateAsync(project.id);
      router.push("/projects");
    } catch {
      setIsDeleting(false);
      setConfirmDeleteText("");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full gap-3">
        <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#22C55E" }} />
        <span className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
          {tc("loading")}
        </span>
      </div>
    );
  }

  if (fetchError || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <AlertCircle className="w-8 h-8" style={{ color: "#EF4444" }} />
        <p className="text-sm font-mono" style={{ color: "var(--dash-text-muted)" }}>
          {fetchError ?? t("notFound")}
        </p>
        <Link href="/projects" className="text-xs font-mono underline" style={{ color: "#22C55E" }}>
          {t("backToProjects")}
        </Link>
      </div>
    );
  }

  const accentColor = project.color ?? "#22C55E";
  const projectStatuses = PROJECT_STATUSES(ts);
  const currentStatusCfg = projectStatuses.find((s) => s.value === project.status);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Top Bar ── */}
      <div className="shrink-0 px-6 pt-6 pb-4 border-b" style={{ borderColor: "var(--dash-border)" }}>
        <div className="flex items-center gap-3 text-xs font-mono mb-4" style={{ color: "#475569" }}>
            <Link href="/projects" className="flex items-center gap-1.5 hover:text-[#94A3B8] transition-colors">
              <ArrowLeft className="w-3 h-3" />
              {t("backLink")}
            </Link>
          <span style={{ color: accentColor }}>/</span>
          <span className="truncate max-w-[200px]" style={{ color: "var(--dash-text)" }}>{project.name}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>{project.name}</h1>
            <p className="text-xs font-mono mt-1 flex items-center gap-2">
              <GitBranch className="w-3 h-3" style={{ color: "#475569" }} />
              <span style={{ color: currentStatusCfg?.color ?? "#475569" }}>
                {currentStatusCfg?.label ?? ts(project.status)}
              </span>
              {typeof project.progress === "number" && (
                <>
                  <span className="ml-2" style={{ color: accentColor }}>●</span>
                  <span style={{ color: accentColor }}>{t("completedProgress", { progress: project.progress })}</span>
                </>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2" ref={panelRef}>
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

            {/* Export / Import */}
            <button
              onClick={() => setShowExportImport(true)}
              title={t("exportImport")}
              className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "#475569" }}
            >
              <Download className="w-4 h-4" />
            </button>

            {/* Activity button */}
            <div className="relative">
              <button
                onClick={() => togglePanel("activity")}
                title={t("activityTitle")}
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
                    className="absolute right-0 top-11 z-30 w-72 rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--dash-border)" }}>
                      <span className="text-xs font-mono font-semibold" style={{ color: "var(--dash-text)" }}>
                        {t("activity")}
                      </span>
                      <button onClick={() => setActivePanel(null)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="p-3 max-h-72 overflow-y-auto">
                      <ActivityFeed projectId={projectId} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Members button */}
            <div className="relative">
              <button
                onClick={() => togglePanel("members")}
                title={t("membersTitle")}
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
                    className="absolute right-0 top-11 z-30 w-64 rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--dash-border)" }}>
                      <span className="text-xs font-mono font-semibold" style={{ color: "var(--dash-text)" }}>{t("members")}</span>
                      <button onClick={() => setActivePanel(null)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-full border-2 flex items-center justify-center shrink-0"
                            style={{ borderColor: accentColor, background: accentColor + "20" }}>
                            <UserCircle className="w-5 h-5" style={{ color: accentColor }} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: "var(--dash-text)" }}>
                              {ownerName || ownerEmail || t("owner")}
                            </p>
                            <p className="text-[10px] truncate" style={{ color: "var(--dash-text-muted)" }}>{ownerEmail}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full border shrink-0"
                          style={{ color: accentColor, borderColor: accentColor + "40", background: accentColor + "15" }}>
                          {t("owner")}
                        </span>
                      </div>

                      <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {isLoadingMembers ? (
                          <div className="flex items-center justify-center py-4">
                            <Loader2 className="w-4 h-4 animate-spin" style={{ color: accentColor }} />
                          </div>
                        ) : members.length === 0 ? (
                          <p className="text-[10px] font-mono text-center" style={{ color: "var(--dash-text-muted)" }}>
                            {t("noCollaborators")}
                          </p>
                        ) : (
                          members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full border flex items-center justify-center shrink-0"
                                  style={{ borderColor: "var(--dash-border)", background: "var(--dash-surface-hover)" }}>
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
                                            role: e.target.value as "collaborator" | "viewer",
                                          });
                                        } catch (err: unknown) {
                                          alert(err instanceof Error ? err.message : t("updateRoleError"));
                                        }
                                      }}
                                      className="text-[10px] font-mono bg-[#020617] border rounded px-1 py-0.5 outline-none cursor-pointer"
                                      style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}
                                    >
                                      <option value="collaborator">{t("roleColab")}</option>
                                      <option value="viewer">{t("roleViewer")}</option>
                                    </select>
                                    <button
                                      onClick={async () => {
                                        if (confirm(t("removeConfirm", { email: member.profile?.email ?? "", project: project?.name ?? "" }))) {
                                          try { await removeMember.mutateAsync(member.id); } catch (err: unknown) {
                                            alert(err instanceof Error ? err.message : t("removeError"));
                                          }
                                        }
                                      }}
                                      className="p-1 rounded text-red-400 hover:bg-red-400/10 transition-colors"
                                      title={t("remove")}
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                                    {member.role === "collaborator" ? t("roleColab") : t("roleViewer")}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {isOwner && (
                        <form onSubmit={handleInviteMember} className="pt-3 border-t space-y-2" style={{ borderColor: "var(--dash-border)" }}>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
                              {t("inviteMember")}
                            </p>
                            <div className="flex items-center gap-0.5 rounded-lg border overflow-hidden" style={{ borderColor: "var(--dash-border)" }}>
                              <button type="button" onClick={() => setInviteMode("email")}
                                className="px-2 py-1 text-[9px] font-mono flex items-center gap-1 transition-all"
                                style={{ background: inviteMode === "email" ? accentColor + "20" : "transparent", color: inviteMode === "email" ? accentColor : "var(--dash-text-muted)" }}>
                                <AtSign className="w-2.5 h-2.5" /> Email
                              </button>
                              <button type="button" onClick={() => setInviteMode("id")}
                                className="px-2 py-1 text-[9px] font-mono flex items-center gap-1 transition-all"
                                style={{ background: inviteMode === "id" ? accentColor + "20" : "transparent", color: inviteMode === "id" ? accentColor : "var(--dash-text-muted)" }}>
                                <Hash className="w-2.5 h-2.5" /> ID
                              </button>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <input type={inviteMode === "email" ? "email" : "text"} value={inviteValue}
                              onChange={(e) => setInviteValue(e.target.value)}
                              placeholder={inviteMode === "email" ? "email@dominio.com" : "ID de usuario"}
                              className="flex-1 rounded-lg px-3 py-1.5 text-xs outline-none border transition-all duration-200 min-w-0"
                              style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                              onFocus={e => (e.target.style.borderColor = accentColor)}
                              onBlur={e => (e.target.style.borderColor = "var(--dash-border)")} />
                            <button type="submit" disabled={addMember.isPending}
                              className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50"
                              style={{ background: accentColor, color: "#020617" }}>
                              {addMember.isPending ? t("adding") : t("addMember")}
                            </button>
                          </div>
                          {inviteError && <p className="text-[10px] text-red-400 font-mono mt-1 leading-normal">{inviteError}</p>}
                          {inviteSuccess && <p className="text-[10px] text-green-400 font-mono mt-1">{t("inviteSuccess")}</p>}
                        </form>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings button */}
            <div className="relative">
              <button
                onClick={() => togglePanel("settings")}
                title={t("settingsTitle")}
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
                    className="absolute right-0 top-11 z-30 w-80 rounded-xl border shadow-2xl overflow-hidden"
                    style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--dash-border)" }}>
                      <span className="text-xs font-mono font-semibold flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
                        <Settings className="w-3.5 h-3.5" style={{ color: accentColor }} />
                        {t("settings")}
                      </span>
                      <button onClick={() => setActivePanel(null)} className="w-5 h-5 flex items-center justify-center rounded hover:bg-white/5" style={{ color: "var(--dash-text-muted)" }}>
                        <X className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("name")}</label>
                        <input value={settingsName} onChange={(e) => setSettingsName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border text-sm font-medium outline-none transition-all"
                          style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--dash-border)")} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("description")}</label>
                        <textarea value={settingsDesc} onChange={(e) => setSettingsDesc(e.target.value)} rows={2}
                          className="w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all resize-none"
                          style={{ background: "var(--dash-bg)", borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--dash-border)")} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>{t("status")}</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {projectStatuses.map((s) => (
                            <button key={s.value} type="button" onClick={() => setSettingsStatus(s.value)}
                              className="px-2 py-1.5 rounded-lg border text-[11px] font-mono transition-all"
                              style={{
                                color: settingsStatus === s.value ? s.color : "var(--dash-text-muted)",
                                background: settingsStatus === s.value ? s.color + "18" : "var(--dash-bg)",
                                borderColor: settingsStatus === s.value ? s.color + "50" : "var(--dash-border)",
                              }}>
                              {s.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1" style={{ color: "var(--dash-text-muted)" }}>
                          <Palette className="w-3 h-3" /> {t("color")}
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {PALETTE_COLORS.map((c) => (
                            <button key={c} type="button" onClick={() => setSettingsColor(c)}
                              className="w-6 h-6 rounded-full border-2 transition-all"
                              style={{
                                background: c,
                                borderColor: settingsColor === c ? "#fff" : "transparent",
                                boxShadow: settingsColor === c ? `0 0 8px ${c}` : "none",
                                transform: settingsColor === c ? "scale(1.15)" : "scale(1)",
                              }} />
                          ))}
                        </div>
                      </div>

                      {saveError && (
                        <p className="text-[11px] font-mono flex items-center gap-1" style={{ color: "#EF4444" }}>
                          <AlertCircle className="w-3 h-3" /> {saveError}
                        </p>
                      )}

                      <button onClick={handleSaveSettings} disabled={isSaving || !settingsName.trim()}
                        className="w-full py-2 rounded-lg text-sm font-mono font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`, color: "#fff", boxShadow: `0 0 18px ${accentColor}40` }}>
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {isSaving ? t("saving") : t("saveChanges")}
                      </button>

                      <div className="pt-1 border-t" style={{ borderColor: "var(--dash-border)" }}>
                        {!isDeleting ? (
                          <button onClick={() => setIsDeleting(true)}
                            className="w-full py-2 rounded-lg text-xs font-mono border border-dashed flex items-center justify-center gap-2 transition-all hover:bg-red-500/5"
                            style={{ borderColor: "#EF444440", color: "#EF4444" }}>
                            <Trash2 className="w-3.5 h-3.5" /> {t("deleteProject")}
                          </button>
                        ) : (
                          <div className="space-y-3 py-2">
                            <p className="text-xs font-mono text-red-400">{t("deleteConfirm")}</p>
                            <p className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>{t("deleteTypeConfirm")}</p>
                            <input type="text" value={confirmDeleteText} onChange={(e) => setConfirmDeleteText(e.target.value)}
                              placeholder="ELIMINAR"
                              className="w-full rounded-lg px-4 py-2 text-sm outline-none border bg-transparent text-red-400 placeholder:text-red-400/30"
                              style={{ borderColor: "#EF444440" }} />
                            <div className="flex gap-2">
                              <button onClick={() => { setIsDeleting(false); setConfirmDeleteText(""); }}
                                className="flex-1 py-2 rounded-lg border text-xs font-mono transition-all hover:bg-white/5"
                                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text-muted)" }}>
                                {tc("cancel")}
                              </button>
                              <button onClick={handleDeleteProject} disabled={confirmDeleteText !== "ELIMINAR"}
                                className="flex-1 py-2 rounded-lg text-xs font-mono font-semibold bg-red-600 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-red-700 transition-all">
                                {deleteProject.isPending ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : tc("delete")}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* ── View Tabs ── */}
      <div className="shrink-0 px-6 pt-3 pb-2 flex items-center gap-1 border-b overflow-x-auto"
        style={{ borderColor: "var(--dash-border)" }}
      >
        {VIEW_TABS(t).map((tab) => {
          const Icon = tab.icon;
          const isActive = activeView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all whitespace-nowrap"
              style={{
                background: isActive ? "rgba(34,197,94,0.12)" : "transparent",
                color: isActive ? "#22C55E" : "var(--dash-text-muted)",
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-hidden p-6">
        <ErrorBoundary>
          {activeView === "kanban" && (
            <KanbanBoard projectId={project.id} />
          )}
          {activeView === "sprints" && (
            <div className="max-w-2xl mx-auto">
              <SprintPanel projectId={project.id} />
              <div className="mt-6 border-t" style={{ borderColor: "var(--dash-border)" }}>
                <CustomFieldsManager projectId={project.id} />
              </div>
            </div>
          )}
          {activeView === "calendar" && (
            <CalendarView projectId={project.id} />
          )}
          {activeView === "gantt" && (
            <div className="max-w-4xl mx-auto">
              <GanttChart projectId={project.id} />
            </div>
          )}
          {activeView === "analytics" && (
            <div className="max-w-2xl mx-auto">
              <AnalyticsPanel projectId={project.id} />
            </div>
          )}
        </ErrorBoundary>
      </div>

      {/* Export/Import Modal */}
      <ExportImportModal
        isOpen={showExportImport}
        onClose={() => setShowExportImport(false)}
        projectId={project.id}
        projectName={project.name}
      />
    </div>
  );
}
