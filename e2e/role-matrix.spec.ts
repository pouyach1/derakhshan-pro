import { test, expect } from "@playwright/test";
import { loginAs, readE2EMeta } from "./helpers/auth";

test.describe("Role matrix — middleware enforcement", () => {
  test("agent cookie reaches agent dashboard and is redirected away from admin", async ({
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

    await page.goto("/admin/dashboard", { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/admin/);
  });

  test("admin cookie reaches admin dashboard and is redirected away from agent", async ({
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

    await page.goto("/admin/dashboard", { waitUntil: "networkidle" });
    await expect(page).toHaveURL(/\/admin\/dashboard/);

    await page.goto("/agent/dashboard", { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/agent\/dashboard/);
  });

  test("client cookie reaches client dashboard and cannot open agent panel", async ({
    page,
    context,
  }) => {
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

    await page.goto("/agent/clients", { waitUntil: "networkidle" });
    await expect(page).not.toHaveURL(/\/agent\/clients/);
  });

  test("staff login API with fixture credentials redirects to role home", async ({ request }) => {
    const meta = readE2EMeta();
    const response = await request.post("/api/auth/login", {
      data: { identifier: meta.agentA.email, secret: meta.password },
    });
    expect(response.ok(), "Agent fixture login must succeed").toBeTruthy();
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.data.redirectTo).toMatch(/\/agent/);
  });
});
