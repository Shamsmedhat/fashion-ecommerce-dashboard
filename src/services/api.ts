import { env } from "../config/env";
import { useAuthStore } from "../store/auth.store";
import { AppError, type AppErrorType } from "../utils/app-errors";

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${env.API_URL}${path}`;

  // Body handling — FormData is sent as-is (browser sets the multipart boundary);
  // everything else is JSON-encoded.
  const isFormData = options.body instanceof FormData;
  const hasBody = options.body !== undefined;

  // Headers — inject the bearer token and a JSON content-type unless sending FormData.
  const token = useAuthStore.getState().token;
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    ...options,
    headers,
    body: !hasBody
      ? undefined
      : isFormData
        ? (options.body as FormData)
        : JSON.stringify(options.body),
  });

  if (!res.ok) {
    const message = (await safeReadMessage(res)) ?? res.statusText ?? "Request failed";

    // The API rejected the token we sent (expired or revoked): the session is over.
    // Clearing it makes the dashboard shell send the user back to the login page.
    if (res.status === 401 && token) useAuthStore.getState().clearAuth();

    throw new AppError(message, res.status, errorTypeFromStatus(res.status));
  }

  // 204 No Content (deletes) — no body to parse.
  if (res.status === 204) return undefined as T;

  return (await res.json()) as T;
}

function errorTypeFromStatus(status: number): AppErrorType {
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  return "general";
}

async function safeReadMessage(res: Response): Promise<string | null> {
  try {
    const data = (await res.json()) as { message?: unknown };
    return typeof data?.message === "string" ? data.message : null;
  } catch {
    return null;
  }
}
