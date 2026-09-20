import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuthStore } from "@/store/auth.store";
import { AppError } from "@/utils/app-errors";
import { getErrorMessage } from "@/utils/catch-error";
import { loginService } from "../services/auth.service";
import type { LoginFields } from "../schemas/auth.schema";

export function useLogin() {
  // Navigation
  const navigate = useNavigate();

  // Store
  const setAuth = useAuthStore((state) => state.setAuth);

  // Hooks
  const { t } = useTranslation();

  // Mutation
  const { isPending, mutate } = useMutation({
    mutationFn: (fields: LoginFields) => loginService(fields),
    onSuccess: (data) => {
      // Admin gate — never store a token for non-admin users.
      if (data.data.user.role !== "admin") {
        toast.error(t("login-admin-required"));
        return;
      }
      setAuth(data.token, data.data.user);
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      if (error instanceof AppError && error.statusCode === 429) {
        toast.error(t("login-rate-limited"));
        return;
      }
      toast.error(getErrorMessage(error));
    },
  });

  return { isPending, login: mutate };
}
