import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { useSessionGuard } from "@/features/auth/hooks/use-session-guard";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    const { token, user } = useAuthStore.getState();
    if (!token || user?.role !== "admin") {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: DashboardShell,
});

function DashboardShell() {
  // Hooks — the session can end while the dashboard is open, so it is watched here too.
  useSessionGuard();

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
