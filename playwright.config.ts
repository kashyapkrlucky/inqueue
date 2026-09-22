import { defineConfig, devices } from "@playwright/test";

// These specs drive the real app end to end through the browser (routing,
// Zustand stores, the actual DOM) but stub the auth/api servers at the
// network boundary with page.route(), rather than depending on
// atlas-id/atlas-apps being up. That keeps them fast, deterministic, and
// runnable in CI (which has no way to reach those services), at the cost of
// not exercising the real backend contract — see e2e/README.md.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:5173",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI,
  },
});
