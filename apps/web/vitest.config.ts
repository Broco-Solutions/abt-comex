import { defineConfig } from "vitest/config"
import { fileURLToPath } from "node:url"

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
      "next/image": fileURLToPath(
        new URL("./test/next-image.tsx", import.meta.url)
      ),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["**/*.test.{ts,tsx}", "**/*.a11y.tsx"],
    exclude: ["e2e/**", "node_modules/**", ".next/**"],
    reporters: ["default"],
  },
})
