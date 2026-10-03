import { test, expect } from "@playwright/test";
import { apiAs, loginAs, readE2EMeta } from "./helpers/auth";

test.describe("Authenticated journeys", () => {
  test("agent: dashboard → clients → create client → list shows client", async ({
    page,
    context,
  }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.agentA.id,
      phone: meta.agentA.phone,
      name: meta.agentA.name,
      role: "agent",
      agentId: meta.agentA.agentId,
    });

    await page.goto("/agent/dashboard", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/agent\/dashboard/);

    await page.goto("/agent/clients", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /مشتریان اختصاصی/ })).toBeVisible();
    await expect(page.getByText(meta.clientRecordA.name)).toBeVisible();

    const uniqueName = `موکل E2E ${Date.now().toString(36)}`;
    const create = await apiAs(page, "/api/clients", {
      method: "POST",
      data: {
        name: uniqueName,
        phone: "09129998877",
        preferredNeighborhood: "عظیمیه",
        budgetMin: 10,
        budgetMax: 25,
        urgency: "medium",
        intent: "buy",
      },
    });
    expect(create.ok(), "Agent A must create own client").toBeTruthy();

    await page.reload({ waitUntil: "networkidle" });
    await expect(page.getByText(uniqueName)).toBeVisible();
  });

  test("agent A cannot read Agent B client via API from browser session", async ({
    page,
    context,
  }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.agentA.id,
      phone: meta.agentA.phone,
      name: meta.agentA.name,
      role: "agent",
      agentId: meta.agentA.agentId,
    });

    const list = await apiAs(page, "/api/clients");
    expect(list.ok()).toBeTruthy();
    const payload = await list.json();
    const names = (payload.data?.items ?? []).map((c: { name: string }) => c.name);
    expect(names).toContain(meta.clientRecordA.name);
    expect(names, "Agent A must not see Agent B CRM client").not.toContain("موکل CRM ب");
  });

  test("client: dashboard + support route reachable", async ({ page, context }) => {
    const meta = readE2EMeta();
    await loginAs(context, {
      id: meta.clientA.id,
      phone: meta.clientA.phone,
      name: meta.clientA.name,
      role: "client",
      onboardingComplete: true,
    });

    await page.goto("/client/dashboard", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/client\/dashboard/);
    await expect(page.getByText(meta.clientA.name).first()).toBeVisible();

    await page.goto("/client/support", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/client\/support/);
  });

  test("home → listings → property detail", async ({ page }) => {
    const meta = readE2EMeta();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.goto("/listings", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto(`/listings/${meta.propertyA.id}`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(new RegExp(`/listings/${meta.propertyA.id}`));
    // Desktop + mobile detail trees both render; assert title in the document body.
    await expect(page.locator("body")).toContainText(meta.propertyA.title);
  });

  test("blog published article is public; draft slug is not", async ({ page, request }) => {
    const meta = readE2EMeta();
    await page.goto("/blog", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const published = await request.get(`/blog/${encodeURIComponent(meta.blogA.slug)}`);
    expect(published.status()).toBeLessThan(400);

    const draft = await request.get(`/blog/${encodeURIComponent(meta.draftBlog.slug)}`);
    expect(draft.status(), "Draft must not be publicly readable").toBeGreaterThanOrEqual(400);
  });
});
