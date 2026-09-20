import { apiFetch } from "@/services/api";
import type { LoginFields } from "../schemas/auth.schema";
import type { LoginResponse } from "../types/auth";

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

export async function logoutService(): Promise<void> {
  // Best-effort server cookie clear — the client store is the source of truth.
  try {
    await apiFetch<{ status: string }>("/users/logout");
  } catch {
    // Ignore — logout must succeed client-side regardless of the server call.
  }
}
