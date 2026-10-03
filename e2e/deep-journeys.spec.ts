import { test, expect } from "@playwright/test";
import { loginAs, readE2EMeta, apiAs } from "./helpers/auth";

test.describe("Property gallery / lightbox", () => {
  test("property detail opens gallery lightbox with next/prev and Escape close", async ({
    page,
  }) => {
    const meta = readE2EMeta();
    await page.goto(`/listings/${meta.propertyA.id}`, { waitUntil: "networkidle" });

    const openGallery = page.getByRole("button", { name: new RegExp(`مشاهده گالری ${meta.propertyA.title}`) }).first();
    await expect(openGallery).toBeVisible();
    await openGallery.click();

    const dialog = page.getByRole("dialog", { name: `گالری ${meta.propertyA.title}` });
    await expect(dialog).toBeVisible();

    await page.getByRole("button", { name: "تصویر بعدی" }).click();
    await expect(dialog.locator("[aria-live='polite']")).toContainText(/۲|2/);

    await page.getByRole("button", { name: "تصویر قبلی" }).click();
    await expect(dialog.locator("[aria-live='polite']")).toContainText(/۱|1/);

    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  });
});

test.describe("Admin workspace journeys", () => {
  test("admin dashboard shows closed deal from fixture", async ({ page, context }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.admin.id,
      phone: meta.admin.phone,
      name: "مدیر تست",
      role: "admin",
    });
    await page.goto("/admin/dashboard", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/admin\/dashboard/);
    // No dedicated deal-create UI exists — verify dashboard surfaces closed deals.
    await expect(page.getByText("معامله الف")).toBeVisible();
  });

  test("admin creates deal via staff API and it appears on dashboard", async ({
    page,
    context,
  }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.admin.id,
      phone: meta.admin.phone,
      name: "مدیر تست",
      role: "admin",
    });

    const title = `معامله E2E ${Date.now().toString(36)}`;
    const created = await apiAs(page, "/api/deals", {
      method: "POST",
      data: {
        title,
        price: 8_500_000_000,
        dealType: "sale",
        status: "closed",
        propertyId: meta.propertyA.id,
        agentId: meta.agentA.agentId,
      },
    });
    expect(created.ok(), "Admin deal create must succeed").toBeTruthy();

    await page.goto("/admin/dashboard", { waitUntil: "networkidle" });
    await expect(page.getByText(title)).toBeVisible();
  });
});

test.describe("Admin blog publish journey", () => {
  test("create draft → publish → public article → unpublish", async ({
    page,
    context,
    request,
  }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.admin.id,
      phone: meta.admin.phone,
      name: "مدیر تست",
      role: "admin",
    });

    const stamp = Date.now().toString(36);
    const title = `مقاله E2E ${stamp}`;
    const slug = `e2e-article-${stamp}`;

    await page.goto("/admin/blog/new", { waitUntil: "networkidle" });
    await expect(page.getByText("NEW ARTICLE")).toBeVisible();

    await page.locator('input[name="title"]').fill(title);
    await page.locator('input[name="slug"]').fill(slug);
    await page.locator('textarea[name="excerpt"]').fill("خلاصه تست انتشار");
    await page.locator('textarea[name="content"]').fill(
      "متن کامل مقاله تست برای پوشش مسیر انتشار و لغو انتشار.",
    );

    const draftResponse = page.waitForResponse(
      (res) =>
        res.url().includes("/api/blog") &&
        !res.url().match(/\/api\/blog\/[^/]+/) &&
        res.request().method() === "POST",
    );
    await page.getByRole("button", { name: "ذخیره پیش‌نویس" }).click();
    const draftRes = await draftResponse;
    expect(draftRes.ok(), "Draft create API must succeed").toBeTruthy();
    await expect(page).toHaveURL(/\/admin\/blog\/[^/]+$/);
    await expect(page.getByText("EDIT ARTICLE")).toBeVisible();
    await expect(page.locator('input[name="title"]')).toHaveValue(title);

    // Controlled content textarea can remount empty after create → edit navigation.
    const content = page.locator('textarea[name="content"]');
    await expect(content).toBeVisible();
    if (!(await content.inputValue()).trim()) {
      await content.fill("متن کامل مقاله تست برای پوشش مسیر انتشار و لغو انتشار.");
    }

    const publishBtn = page.getByRole("button", { name: "انتشار" });
    await expect(publishBtn).toBeEnabled();
    await publishBtn.scrollIntoViewIfNeeded();
    // Workspace chrome can intercept normal hit-testing on the long editor form;
    // dispatch on the real button element so React onClick runs deterministically.
    const publishResponse = page.waitForResponse(
      (res) =>
        res.url().includes("/api/blog/") &&
        res.request().method() === "PATCH",
      { timeout: 30_000 },
    );
    await publishBtn.evaluate((el: HTMLButtonElement) => el.click());
    const publishRes = await publishResponse;
    expect(publishRes.ok(), `Publish PATCH failed: ${publishRes.status()}`).toBeTruthy();
    const publishBody = (await publishRes.json()) as { data?: { status?: string } };
    expect(publishBody.data?.status).toBe("published");
    // Hard navigation avoids flaky RSC cache races after router.refresh() in the form.
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator('select[name="status"]')).toHaveValue("published");
    await expect(page.getByText("منتشر شده").first()).toBeVisible();

    const publicRes = await request.get(`/blog/${encodeURIComponent(slug)}`);
    expect(publicRes.status()).toBeLessThan(400);

    await page.goto(`/blog/${encodeURIComponent(slug)}`, { waitUntil: "networkidle" });
    await expect(page.locator("body")).toContainText(title);

    await page.goto("/admin/blog", { waitUntil: "networkidle" });
    await page.getByRole("link", { name: title }).first().click();
    await expect(page.locator('input[name="title"]')).toHaveValue(title);
    await expect(page.locator('select[name="status"]')).toHaveValue("published");
    await page.locator('select[name="status"]').selectOption("draft");
    const unpublishResponse = page.waitForResponse(
      (res) => res.url().includes("/api/blog/") && res.request().method() === "PATCH",
    );
    await page.getByRole("button", { name: "ذخیره پیش‌نویس" }).evaluate((el: HTMLButtonElement) =>
      el.click(),
    );
    expect((await unpublishResponse).ok()).toBeTruthy();
    await expect(page.locator('select[name="status"]')).toHaveValue("draft");

    // Anonymous request — page.request would still send the admin cookie and hit staff preview.
    const after = await request.get(`/blog/${encodeURIComponent(slug)}`);
    expect(after.status(), "Unpublished article must not stay public").toBeGreaterThanOrEqual(400);
  });
});

test.describe("Client support chat journey", () => {
  test("client can open support and send a message", async ({ page, context }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.clientA.id,
      phone: meta.clientA.phone,
      name: meta.clientA.name,
      role: "client",
      onboardingComplete: true,
    });

    await page.goto("/client/support", { waitUntil: "networkidle" });
    await expect(page.getByText("پشتیبانی آنلاین")).toBeVisible();

    const body = `پیام پشتیبانی E2E ${Date.now().toString(36)}`;
    await page.getByPlaceholder("سوال یا درخواست خود را بنویسید…").fill(body);
    await page.getByRole("button", { name: /ارسال/ }).click();
    await expect(page.getByText(body)).toBeVisible();
  });

  test("client A cannot load Client B thread messages via API", async ({ page, context }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.clientA.id,
      phone: meta.clientA.phone,
      name: meta.clientA.name,
      role: "client",
      onboardingComplete: true,
    });

    // thread B id is deterministic in seed fixture
    const response = await apiAs(page, "/api/chat/threads/thread-b/messages");
    expect([401, 403, 404]).toContain(response.status());
  });
});
