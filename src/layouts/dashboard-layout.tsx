import { useState, type ReactElement, type ReactNode } from "react";

import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/shared/DashboardTopbar";

export interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): ReactElement {
  // State — below the lg breakpoint the sidebar is an off-canvas drawer.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
