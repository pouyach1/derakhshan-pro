import { test, expect } from "@playwright/test";

test.describe("Accessibility overlay regressions", () => {
  test("mobile nav opens and closes with Escape", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/listings");

    const menu = page.getByRole("button", { name: /باز کردن منو/ });
    await expect(menu).toBeVisible();
    await menu.click();
    await expect(page.getByRole("dialog", { name: /منوی موبایل/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: /منوی موبایل/ })).toHaveCount(0);
  });

  test("listings search has an accessible name", async ({ page }) => {
    await page.goto("/listings");
    await expect(page.getByLabel(/جستجوی فایل/)).toBeVisible();
  });
});
