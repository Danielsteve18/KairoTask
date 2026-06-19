import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { DashboardBreadcrumb } from "@/components/layout/DashboardBreadcrumb";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "var(--dash-bg)" }}>
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header
          className="h-16 shrink-0 flex items-center px-6 border-b backdrop-blur-sm"
          style={{ borderColor: "var(--dash-border)", background: "color-mix(in srgb, var(--dash-bg) 80%, transparent)" }}
        >
          {/* Breadcrumb Dinámico */}
          <DashboardBreadcrumb />

          {/* Search trigger */}
          <button
            onClick={() => document.dispatchEvent(new KeyboardEvent("keydown", { metaKey: true, key: "k" }))}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all hover:opacity-80 mx-3"
            style={{
              borderColor: "var(--dash-border)",
              color: "var(--dash-text-muted)",
              background: "var(--dash-bg)",
            }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <span className="hidden sm:inline text-[10px] uppercase tracking-wider">Buscar</span>
            <kbd className="hidden md:inline-flex text-[9px] px-1 py-0.5 rounded border" style={{ borderColor: "var(--dash-border)" }}>
              {navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"}
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-[#22C55E] uppercase tracking-widest">
                Live
              </span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User menu dropdown */}
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal />
    </div>
  );
}
