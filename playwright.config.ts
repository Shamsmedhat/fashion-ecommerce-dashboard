import { defineConfig, devices } from "@playwright/test";

// The suite drives the real dashboard against the real API, which runs on a throwaway
// in-memory database seeded with the demo catalogue (backend: `yarn dev:memory`).
const API_PORT = 3100;
const APP_PORT = 5183;
const backendDir = process.env.BACKEND_DIR ?? "../fashion-ecommerce-backend";

export default defineConfig({
  testDir: "./e2e",
  // One worker: every test shares the same seeded database.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${APP_PORT}`,
    locale: "en-US",
    trace: "retain-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "node scripts/dev-memory.js",
      cwd: backendDir,
      env: {
        PORT: String(API_PORT),
        NODE_ENV: "test",
        CORS_ORIGINS: `http://localhost:${APP_PORT}`,
      },
      url: `http://localhost:${API_PORT}/api/v1/categories/main`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: `yarn vite --port ${APP_PORT} --strictPort`,
      env: {
        VITE_API_URL: `http://localhost:${API_PORT}/api/v1`,
        // No storefront runs during the tests, so cache revalidation is switched off.
        VITE_STOREFRONT_URL: "",
      },
      url: `http://localhost:${APP_PORT}`,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
