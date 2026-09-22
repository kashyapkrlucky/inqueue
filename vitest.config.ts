import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./vitest.setup.ts",
    css: true,
    // e2e/**: Playwright specs, run via `npm run test:e2e`, not vitest.
    exclude: ["**/node_modules/**", "e2e/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/main.tsx",
        "src/vite-env.d.ts",
        "src/test/**",
      ],
      // Floor, not a target: set just under the current measured coverage so
      // CI fails on regressions rather than on the (large) pre-existing gap.
      // Raise these as more of the component tree gets test coverage — see
      // improvement.txt section 2.
      thresholds: {
        statements: 25,
        branches: 20,
        functions: 18,
        lines: 25,
      },
    },
  },
});
