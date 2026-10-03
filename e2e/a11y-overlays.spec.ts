import { test, expect } from "@playwright/test";

test.describe("Accessibility overlay regressions", () => {
  test("mobile nav opens and closes with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/listings", { waitUntil: "networkidle" });

    const menu = page.locator('button[aria-controls="mobile-nav"]');
    await expect(menu).toBeVisible();
    // Wait until the client Navbar has hydrated (SSR button is inert until then).
    await expect
      .poll(async () =>
        menu.evaluate((el) => typeof (el as HTMLButtonElement).onclick === "object" || el.isConnected),
      )
      .toBeTruthy();
    await menu.click();

    await expect(menu).toHaveAttribute("aria-expanded", "true");
    const drawer = page.locator("#mobile-nav");
    await expect(drawer).toBeVisible();
    await expect(drawer).toHaveAttribute("role", "dialog");
    await expect(drawer).toHaveAttribute("aria-label", "منوی موبایل");

    await page.keyboard.press("Escape");
    await expect(drawer).toHaveCount(0);
    await expect(menu).toHaveAttribute("aria-expanded", "false");
  });

  test("listings search has an accessible name", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/listings", { waitUntil: "domcontentloaded" });
    const searches = page.getByRole("textbox", { name: /جستجوی فایل/ });
    await expect(searches.first()).toBeVisible();
    expect(await searches.count()).toBeGreaterThan(0);
  });
});
