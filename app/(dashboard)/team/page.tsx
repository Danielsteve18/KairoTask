"use client";

import React, { useState, useEffect } from "react";
import { useProjectMembers } from "@/hooks/useProjectMembers";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Search,
  Mail,
  FolderKanban,
  Shield,
  Loader2,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface GroupedMember {
  userId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  sharedProjects: {
    id: string;
    name: string;
    color: string;
    role: string;
    memberRecordId: string;
  }[];
}

export default function TeamPage() {
  const { teamMembers, isLoadingTeam, teamError, updateMemberRole, removeMember } = useProjectMembers();
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  // 1. Agrupar miembros del proyecto por ID de usuario único
  const grouped = new Map<string, GroupedMember>();

  (teamMembers || []).forEach((m) => {
    if (!m.profile) return;
    const uid = m.user_id;
    if (!grouped.has(uid)) {
      grouped.set(uid, {
        userId: uid,
        email: m.profile.email,
        fullName: m.profile.full_name,
        avatarUrl: m.profile.avatar_url,
        sharedProjects: [],
      });
    }

    if (m.project) {
      grouped.get(uid)!.sharedProjects.push({
        id: m.project.id,
        name: m.project.name,
        color: m.project.color,
        role: m.role,
        memberRecordId: m.id,
      });
    }
  });

  // 2. Filtrar para excluir al usuario actual de la lista de colaboradores
  const collaboratorsList = Array.from(grouped.values()).filter(
    (c) => c.userId !== currentUserId
  );

  // 3. Filtrar por la consulta de búsqueda
  const filteredCollaborators = collaboratorsList.filter((colab) => {
    const nameMatch = colab.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false;
    const emailMatch = colab.email.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch || emailMatch;
  });

  // IDs de proyectos que el usuario actual puede gestionar (owner)
  const ownedProjectIds = new Set(
    (teamMembers || [])
      .filter(m => m.user_id === currentUserId && m.role === "owner")
      .map(m => m.project_id)
  );

  // Calcular métricas
  const totalCollaborators = collaboratorsList.length;
  const uniqueProjectsCount = ownedProjectIds.size;

  if (isLoadingTeam) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] gap-3">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--dash-accent)" }} />
        <span className="text-sm font-mono text-[var(--dash-text-muted)]">
          cargando directorio de equipo…
        </span>
      </div>
    );
  }

  if (teamError) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[50vh] gap-4">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-sm font-mono text-[var(--dash-text-muted)]">
          Error al cargar el equipo: {teamError.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full">
      {/* Cabecera */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
            <span style={{ color: "var(--dash-accent)" }}>$</span> kairo team --list-collaborators
          </p>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
            Mi Equipo
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
            Directorio consolidado de colaboradores y proyectos compartidos.
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--dash-text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg pl-9 pr-4 py-2 text-sm outline-none border transition-all duration-200"
            style={{
              background: "var(--dash-surface)",
              borderColor: "var(--dash-border)",
              color: "var(--dash-text)",
            }}
            onFocus={e => (e.target.style.borderColor = "var(--dash-accent)")}
            onBlur={e => (e.target.style.borderColor = "var(--dash-border)")}
          />
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div
          className="rounded-2xl border p-5 flex items-center gap-4"
          style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2"
            style={{ borderColor: "rgba(34,197,94,0.2)", background: "rgba(34,197,94,0.08)", color: "var(--dash-accent)" }}
          >
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black" style={{ color: "var(--dash-text)" }}>{totalCollaborators}</p>
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
              Colaboradores
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border p-5 flex items-center gap-4"
          style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2"
            style={{ borderColor: "rgba(168,85,247,0.2)", background: "rgba(168,85,247,0.08)", color: "#A855F7" }}
          >
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black" style={{ color: "var(--dash-text)" }}>{uniqueProjectsCount}</p>
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
              Proyectos Activos
            </p>
          </div>
        </div>

        <div
          className="rounded-2xl border p-5 flex items-center gap-4 sm:col-span-2 lg:col-span-1"
          style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center border-2"
            style={{ borderColor: "rgba(245,158,11,0.2)", background: "rgba(245,158,11,0.08)", color: "#F59E0B" }}
          >
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black" style={{ color: "var(--dash-text)" }}>
              {grouped.size > 0 ? "Workspace" : "Individual"}
            </p>
            <p className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--dash-text-muted)" }}>
              Modo Colaborativo
            </p>
          </div>
        </div>
      </div>

      {/* Directorio de Miembros */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
      >
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--dash-border)" }}>
          <h2 className="text-sm font-semibold uppercase tracking-widest font-mono" style={{ color: "var(--dash-text-muted)" }}>
            Lista de Colaboradores
          </h2>
          <span className="text-xs font-mono text-[var(--dash-text-muted)]">
            Mostrando {filteredCollaborators.length} de {totalCollaborators}
          </span>
        </div>

        {filteredCollaborators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 gap-4 text-center">
            <Users className="w-12 h-12" style={{ color: "var(--dash-text-muted)" }} />
            <div>
              <p className="font-bold text-sm" style={{ color: "var(--dash-text)" }}>
                {searchQuery ? "Sin resultados para tu búsqueda." : "No tienes colaboradores en el equipo."}
              </p>
              <p className="text-xs mt-1 max-w-sm" style={{ color: "var(--dash-text-muted)" }}>
                {searchQuery
                  ? "Prueba ingresando otro nombre o dirección de correo electrónico."
                  : "Crea o abre un proyecto e invita colaboradores ingresando su correo en el panel de miembros."}
              </p>
            </div>
            {!searchQuery && (
              <Link
                href="/projects"
                className="mt-2 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all border hover:bg-[var(--dash-surface-hover)]"
                style={{ borderColor: "var(--dash-border)", color: "var(--dash-text)" }}
              >
                Ir a proyectos <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--dash-border)" }}>
            <AnimatePresence>
              {filteredCollaborators.map((colab) => {
                const initials = colab.fullName
                  ? colab.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
                  : colab.email[0].toUpperCase();

                return (
                  <motion.div
                    key={colab.userId}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-white/[0.01] transition-colors"
                  >
                    {/* Info de Perfil */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black border-2 shrink-0 select-none"
                        style={{
                          background: "rgba(34,197,94,0.08)",
                          borderColor: "rgba(34,197,94,0.2)",
                          color: "var(--dash-accent)",
                        }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: "var(--dash-text)" }}>
                          {colab.fullName || "Sin nombre configurado"}
                        </p>
                        <p className="text-xs font-mono flex items-center gap-1.5" style={{ color: "var(--dash-text-muted)" }}>
                          <Mail className="w-3.5 h-3.5 shrink-0" />
                          {colab.email}
                        </p>
                      </div>
                    </div>

                    {/* Proyectos compartidos */}
                    <div className="flex flex-wrap items-center gap-2 max-w-md">
                      {colab.sharedProjects.map((p) => {
                        const canManage = ownedProjectIds.has(p.id) && p.role !== "owner";
                        return (
                          <div
                            key={p.memberRecordId}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-all"
                            style={{
                              borderColor: p.color + "30",
                              background: p.color + "08",
                              color: p.color,
                            }}
                          >
                            <Link
                              href={`/projects/${p.id}`}
                              className="flex items-center gap-1.5 hover:opacity-85"
                            >
                              <span className="w-1.5 h-1.5 rounded-full" style={{ background: p.color }} />
                              {p.name}
                            </Link>
                            <span className="text-[9px] uppercase opacity-60 font-semibold ml-0.5">
                              ({p.role === "owner" ? "dueño" : p.role === "collaborator" ? "colab" : "lector"})
                            </span>
                            {canManage && (
                              <>
                                <select
                                  value={p.role}
                                  onChange={async (e) => {
                                    try {
                                      await updateMemberRole.mutateAsync({
                                        memberId: p.memberRecordId,
                                        role: e.target.value as "collaborator" | "viewer",
                                      });
                                    } catch (err: unknown) {
                                      alert(err instanceof Error ? err.message : "Error al actualizar rol.");
                                    }
                                  }}
                                  className="text-[9px] font-mono bg-transparent border rounded px-0.5 py-0 outline-none cursor-pointer ml-0.5"
                                  style={{ borderColor: p.color + "40", color: p.color }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="collaborator">Colab.</option>
                                  <option value="viewer">Lector</option>
                                </select>
                                <button
                                  onClick={async () => {
                                    if (confirm(`¿Remover a ${colab.email} de ${p.name}?`)) {
                                      try {
                                        await removeMember.mutateAsync(p.memberRecordId);
                                      } catch (err: unknown) {
                                        alert(err instanceof Error ? err.message : "Error al remover.");
                                      }
                                    }
                                  }}
                                  className="p-0.5 rounded hover:bg-red-400/10 transition-colors ml-0.5"
                                  style={{ color: "#EF4444" }}
                                  title="Remover"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
