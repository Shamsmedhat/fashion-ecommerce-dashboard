import { env } from "../config/env";
import { useAuthStore } from "../store/auth.store";

// Fire-and-forget revalidation of storefront ISR cache tags.
// Never blocks the UI and never throws — failures are logged only.
export function revalidateStorefront(tags: string[]): void {
  if (!env.STOREFRONT_URL || tags.length === 0) return;

  // Dedicated fetch — must NOT use apiFetch (it prefixes the backend API_URL).
  const token = useAuthStore.getState().token;

  void fetch(`${env.STOREFRONT_URL}/api/revalidate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ tags }),
  })
    .then((res) => {
      if (!res.ok) {
        console.error(`Storefront revalidation failed: ${res.status} ${res.statusText}`);
      }
    })
    .catch((error) => {
      console.error("Storefront revalidation request failed", error);
    });
}
