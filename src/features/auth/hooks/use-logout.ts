import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { useAuthStore } from "@/store/auth.store";
import { logoutService } from "../services/auth.service";

export function useLogout() {
  // Navigation
  const navigate = useNavigate();

  // Store
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Queries
  const queryClient = useQueryClient();

  // Functions
  function logout() {
    void logoutService();
    clearAuth();
    queryClient.clear();
    navigate({ to: "/auth/login" });
  }

  return { logout };
}
