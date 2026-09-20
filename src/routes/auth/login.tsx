import { createFileRoute, redirect } from "@tanstack/react-router";

import { LoginForm } from "@/features/auth/components/LoginForm";
import { AuthLayout } from "@/layouts/auth-layout";
import { useAuthStore } from "@/store/auth.store";

export const Route = createFileRoute("/auth/login")({
  beforeLoad: () => {
    const { token, user } = useAuthStore.getState();
    if (token && user?.role === "admin") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
