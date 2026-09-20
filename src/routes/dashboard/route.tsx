import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

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
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
