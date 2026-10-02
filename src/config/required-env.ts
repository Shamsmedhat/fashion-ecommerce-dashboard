// Build-time variables the app cannot run without. Vite inlines them into the bundle, so a
// build that lacks them ships with empty URLs and sends every API call to the dashboard's
// own origin (which answers POST with 405).
export const REQUIRED_ENV = ["VITE_API_URL", "VITE_STOREFRONT_URL"] as const;

export function findMissingEnv(env: Record<string, string | undefined>): string[] {
  return REQUIRED_ENV.filter((name) => !env[name]?.trim());
}

export function assertRequiredEnv(env: Record<string, string | undefined>): void {
  const missing = findMissingEnv(env);
  if (missing.length === 0) return;

  throw new Error(
    `Missing required environment variable(s): ${missing.join(", ")}. ` +
      "Set them in .env locally or in the hosting provider's project settings, then rebuild.",
  );
}
