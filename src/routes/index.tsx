import { createFileRoute, redirect } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    const { token, user } = useAuthStore.getState();
    if (token && user?.role === "admin") {
      throw redirect({ to: "/dashboard" });
    }
    throw redirect({ to: "/auth/login" });
  },
});
