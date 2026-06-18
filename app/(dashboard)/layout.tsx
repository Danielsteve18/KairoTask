import { DashboardSidebar } from "@/components/layout/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-black">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 shrink-0 flex items-center px-6 border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-[#475569]">
            <span className="text-[#22C55E]">~/</span>
            <span>kairo</span>
            <span className="text-[#22C55E]">/</span>
            <span className="text-[#F8FAFC]">workspace</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Status indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span className="text-[10px] font-mono font-medium text-[#22C55E] uppercase tracking-widest">
                Live
              </span>
            </div>

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 flex items-center justify-center text-[#22C55E] text-xs font-bold">
              U
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
