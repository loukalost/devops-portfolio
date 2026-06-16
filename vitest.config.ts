import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  test: {
    // Pure-logic unit tests: no DOM needed.
    environment: "node",
    include: ["tests/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // lcov for SonarQube (quality.yml workflow), text for the terminal.
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**"],
      exclude: [
        "src/generated/**", // Prisma client (generated)
        "src/components/ui/**", // vendored Magic UI / shadcn components
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    alias: {
      // Mirror tsconfig.json's "@/*" -> "src/*" alias.
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
