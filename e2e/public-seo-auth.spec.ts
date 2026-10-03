import { test, expect } from "@playwright/test";

/**
 * Public browsing + SEO smoke journeys.
 * Relies on seeded / fixture store from webServer env.
 */
test.describe("Public journeys", () => {
  test("home → listings is reachable", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("main")).toBeVisible();
    await page.goto("/listings");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("blog index is public and has search label", async ({ page }) => {
    await page.goto("/blog");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const search = page.getByLabel(/جستجو/);
    await expect(search).toBeVisible();
  });

  test("login page is reachable and noindex is present", async ({ page }) => {
    await page.goto("/login");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots || "").toMatch(/noindex/i);
  });
});

test.describe("SEO endpoints", () => {
  test("sitemap.xml excludes /properties and /login", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBeTruthy();
    const xml = await response.text();
    expect(xml).toContain("/listings");
    expect(xml).not.toContain("/properties");
    expect(xml).not.toMatch(/\/login</);
  });

  test("robots.txt blocks private panels", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.ok()).toBeTruthy();
    const text = await response.text();
    expect(text).toContain("Disallow: /admin");
    expect(text).toContain("Disallow: /agent");
    expect(text).toContain("Disallow: /client");
    expect(text).toContain("Sitemap:");
  });
});

test.describe("Auth role gates", () => {
  test("unauthenticated /agent/dashboard redirects to login", async ({ page }) => {
    await page.goto("/agent/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated /admin/dashboard redirects to login", async ({ page }) => {
    await page.goto("/admin/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated /client/dashboard redirects to login", async ({ page }) => {
    await page.goto("/client/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});
