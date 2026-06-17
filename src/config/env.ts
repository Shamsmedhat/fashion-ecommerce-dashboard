export const env = {
  API_URL: import.meta.env.VITE_API_URL ?? "",
  STOREFRONT_URL: import.meta.env.VITE_STOREFRONT_URL ?? "",
} as const;

