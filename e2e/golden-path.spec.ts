import { test, expect } from "@playwright/test";
import { mockBackend } from "./mockBackend";

test.beforeEach(async ({ page }) => {
  await mockBackend(page);
});

test("guest can log in, land on the dashboard, and create a task", async ({
  page,
}) => {
  await page.goto("/login");

  await page.getByText("Continue as Guest").click();

  await expect(page.getByText("Welcome, Atlas Guest")).toBeVisible();

  await page.getByRole("link", { name: "Tasks" }).click();
  await expect(page).toHaveURL(/\/tasks$/);

  await page.getByRole("button", { name: "Add Task" }).click();

  await page.getByLabel("Content").fill("Ship the E2E suite");
  await page.getByLabel("Due Date").fill("2026-12-01");

  await page.getByRole("button", { name: "Create" }).click();

  await expect(page.getByText("Ship the E2E suite")).toBeVisible();
});

test("unauthenticated visitors are redirected away from protected routes", async ({
  page,
}) => {
  await page.goto("/tasks");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Continue as Guest")).toBeVisible();
});
