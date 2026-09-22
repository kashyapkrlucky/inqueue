import type { Page } from "@playwright/test";

const guestUser = {
  id: "guest-1",
  email: "guest@atlas-id.vercel.app",
  username: "atlas_guest",
  avatar: "https://atlas-id.vercel.app/avatars/1.png",
  name: "Atlas Guest",
};

const emptyStats = {
  total: 0,
  todo: 0,
  in_progress: 0,
  done: 0,
  low: 0,
  medium: 0,
  high: 0,
  weeklyStats: [],
};

/**
 * Stubs the auth server (atlas-id, :3000) and api server (atlas-apps, :3001)
 * at the network boundary so specs can drive the real frontend — routing,
 * Zustand stores, actual DOM — without a live backend. Tasks created via the
 * UI are held in memory for the life of the test so a create-then-list
 * assertion reflects what was actually submitted.
 */
export async function mockBackend(page: Page) {
  const tasks: Record<string, unknown>[] = [];
  let nextId = 1;

  await page.route("**/api/v1/public/guest", async (route) => {
    await route.fulfill({
      json: { data: { user: guestUser }, status: true },
    });
  });

  await page.route("**/api/v1/public/logout", async (route) => {
    await route.fulfill({ json: { data: { loggedOut: true }, status: true } });
  });

  await page.route("**/api/tasks/stats", async (route) => {
    await route.fulfill({ json: { data: emptyStats, status: true } });
  });

  await page.route("**/api/tasks/recent", async (route) => {
    await route.fulfill({
      json: { data: { recent: [], upcoming: [] }, status: true },
    });
  });

  await page.route("**/api/tasks/labels", async (route) => {
    await route.fulfill({ json: { data: [], status: true } });
  });

  await page.route("**/api/tasks?*", async (route) => {
    if (route.request().method() !== "GET") return route.fallback();
    await route.fulfill({
      json: { data: tasks, totalPages: 1, status: true },
    });
  });

  await page.route("**/api/tasks", async (route) => {
    const request = route.request();
    if (request.method() !== "POST") return route.fallback();

    const body = request.postDataJSON() as Record<string, unknown>;
    const now = new Date().toISOString();
    const task = {
      _id: `task-${nextId++}`,
      createdAt: now,
      updatedAt: now,
      user: guestUser,
      status: "todo",
      priority: "medium",
      ...body,
    };
    tasks.unshift(task);

    await route.fulfill({ json: { data: task, status: true } });
  });
}
