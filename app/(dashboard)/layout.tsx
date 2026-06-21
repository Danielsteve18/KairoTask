import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { UserMenu } from "@/components/layout/UserMenu";
import { ThemeToggle } from "@/components/custom/ThemeToggle";
import { DashboardBreadcrumb } from "@/components/layout/DashboardBreadcrumb";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { GlobalSearchModal } from "@/components/search/GlobalSearchModal";
import { SearchTrigger } from "@/components/search/SearchTrigger";
import { LanguageSwitcher } from "@/components/custom/LanguageSwitcher";

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
          <SearchTrigger />

          <div className="ml-auto flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-[#22C55E] uppercase tracking-widest">
                Live
              </span>
            </div>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Notifications */}
            <NotificationBell />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User menu dropdown */}
            <UserMenu />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Global Search Modal (Cmd+K) */}
      <GlobalSearchModal />
    </div>
  );
}
