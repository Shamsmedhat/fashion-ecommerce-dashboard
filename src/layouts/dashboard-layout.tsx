import type { ReactElement, ReactNode } from "react";

import { DashboardSidebar } from "@/components/shared/DashboardSidebar";
import { DashboardTopbar } from "@/components/shared/DashboardTopbar";

export interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps): ReactElement {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
