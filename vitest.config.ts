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
    // Service and utility tests run in plain Node; component tests opt into a DOM with
    // a `// @vitest-environment jsdom` comment at the top of the file.
    environment: "node",
    globals: true,
    pool: "threads",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/test/setup.ts"],
  },
});
