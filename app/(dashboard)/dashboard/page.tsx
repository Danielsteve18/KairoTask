"use client";

import { useTranslations } from "next-intl";
import { FolderKanban, Users, CheckCircle2, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { GlobalActivityFeed } from "@/components/project/GlobalActivityFeed";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

export default function DashboardPage() {
  const td = useTranslations("dashboard");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const { projects, isLoading } = useProjects();

  const activeProjects = (projects ?? []).filter((p) => p.status === "active").length;
  const totalTasks = (projects ?? []).reduce((a, p) => a + (p.tasks?.total || 0), 0);
  const doneTasks = (projects ?? []).reduce((a, p) => a + (p.tasks?.done || 0), 0);
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="p-6 md:p-8 min-h-full space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-mono mb-1 uppercase tracking-widest" style={{ color: "var(--dash-text-muted)" }}>
          <span style={{ color: "var(--dash-accent)" }}>$</span> ~/dashboard
        </p>
        <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--dash-text)" }}>
          {td("title")}
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--dash-text-muted)" }}>
          {td("subtitle")}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: td("activeProjects"), value: activeProjects, icon: FolderKanban, color: "#22C55E" },
          { label: td("totalTasks"), value: totalTasks, icon: Activity, color: "#A855F7" },
          { label: td("completedTasks"), value: doneTasks, icon: CheckCircle2, color: "#22C55E" },
          { label: td("performance"), value: `${completionRate}%`, icon: TrendingUp, color: "#F59E0B" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4 flex items-center gap-4 border"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${stat.color}18`, border: `1px solid ${stat.color}30` }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: "var(--dash-text)" }}>{stat.value}</p>
              <p className="text-xs font-mono" style={{ color: "var(--dash-text-muted)" }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick links */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <FolderKanban className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            {td("quickAccess")}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/projects"
              className="flex flex-col items-center gap-2 p-5 rounded-xl border transition-all hover:bg-white/5"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <FolderKanban className="w-6 h-6" style={{ color: "#22C55E" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--dash-text)" }}>{tn("projects")}</span>
              <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                {(projects ?? []).length} {tn("projects").toLowerCase()}
              </span>
            </Link>
            <Link
              href="/team"
              className="flex flex-col items-center gap-2 p-5 rounded-xl border transition-all hover:bg-white/5"
              style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
            >
              <Users className="w-6 h-6" style={{ color: "#A855F7" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--dash-text)" }}>{tn("team")}</span>
              <span className="text-[10px] font-mono" style={{ color: "var(--dash-text-muted)" }}>
                {tc("noResults")}
              </span>
            </Link>
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: "var(--dash-text)" }}>
            <Activity className="w-4 h-4" style={{ color: "var(--dash-accent)" }} />
            {td("recentActivity")}
          </h2>
          <div
            className="rounded-xl border p-3 max-h-80 overflow-y-auto"
            style={{ background: "var(--dash-surface)", borderColor: "var(--dash-border)" }}
          >
            <ErrorBoundary>
              <GlobalActivityFeed />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
}
