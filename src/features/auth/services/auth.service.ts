import { apiFetch } from "@/services/api";
import type { LoginFields } from "../schemas/auth.schema";
import type { LoginResponse, MeResponse } from "../types/auth";

// Detect Egyptian phone numbers (start with "01"); everything else is treated as email.
function isPhone(identifier: string): boolean {
  return /^01\d*/.test(identifier.trim());
}

export async function loginService(fields: LoginFields): Promise<LoginResponse> {
  const identifier = fields.identifier.trim();
  const body = isPhone(identifier)
    ? { phone: identifier, password: fields.password }
    : { email: identifier, password: fields.password };

  return apiFetch<LoginResponse>("/users/login", {
    method: "POST",
    body,
  });
}

// Protected endpoint: answers 401 when the stored token has expired or been revoked.
export async function getMeService(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/users/me");
}

export async function logoutService(): Promise<void> {
  // Best-effort server cookie clear — the client store is the source of truth.
  try {
    await apiFetch<{ status: string }>("/users/logout");
  } catch {
    // Ignore — logout must succeed client-side regardless of the server call.
  }
}
