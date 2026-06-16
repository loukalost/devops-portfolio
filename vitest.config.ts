import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Pure-logic unit tests: no DOM needed.
    environment: "node",
    include: ["tests/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // lcov for SonarQube (quality.yml workflow), text for the terminal.
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/lib/**", "src/config/**"],
    },
  },
  resolve: {
    alias: {
      // Mirror tsconfig.json's "@/*" -> "src/*" alias.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
