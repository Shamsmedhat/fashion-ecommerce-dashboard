import path from "node:path";
import { fileURLToPath } from "node:url";

import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { assertRequiredEnv } from "./src/config/required-env";

const projectDir = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Fail the build rather than ship a bundle with empty API URLs.
  if (command === "build") assertRequiredEnv(loadEnv(mode, projectDir, "VITE_"));

  return {
    resolve: {
      alias: {
        "@": path.resolve(projectDir, "./src"),
      },
    },
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
      babel({ presets: [reactCompilerPreset()] }),
    ],
  };
});
