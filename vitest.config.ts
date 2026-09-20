import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const projectDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(projectDir, "./src"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    pool: "threads",
    include: ["src/**/*.test.ts"],
  },
});
