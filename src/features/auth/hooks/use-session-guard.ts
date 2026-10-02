import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { queryKeys } from "@/config/query-keys";
import { STALE_TIMES } from "@/config/query.config";
import { useAuthStore } from "@/store/auth.store";
import { getMeService } from "../services/auth.service";

// Keeps the dashboard closed to anyone without a live admin session.
// The route guard only sees that a token is stored; this asks the API whether it still works.
export function useSessionGuard(): void {
  // Navigation
  const navigate = useNavigate();

  // Queries
  const queryClient = useQueryClient();

  // Store
  const token = useAuthStore((state) => state.token);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  // Query — most dashboard reads are public endpoints, so an expired token would otherwise go
  // unnoticed until the first save. A 401 here makes apiFetch clear the session.
  const { data } = useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => getMeService(),
    enabled: Boolean(token),
    retry: false,
    staleTime: STALE_TIMES.LONG,
  });

  // Variables
  const role = data?.data.user.role;

  // Effects — the account may have lost its admin role since it logged in.
  useEffect(() => {
    if (role && role !== "admin") clearAuth();
  }, [role, clearAuth]);

  // Effects — leave as soon as the session is gone, whichever request ended it.
  useEffect(() => {
    if (token) return;
    queryClient.clear();
    void navigate({ to: "/auth/login" });
  }, [token, navigate, queryClient]);
}
