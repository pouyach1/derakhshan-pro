import { beforeEach, describe, expect, it } from "vitest";
import { POST as createDeal, GET as listDeals } from "@/app/api/deals/route";
import { buildIsolationFixture, authCookieFor } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";

describe("Deal ownership — Phase 1 security regression", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("Agent A cannot create a deal against Property B they do not own", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        cookie,
        body: {
          propertyId: fixture.propertyB.id,
          title: "تلاش برای معامله غیرمجاز",
          price: 1_000_000_000,
          dealType: "sale",
          status: "closed",
          agentId: fixture.agentB.agentId,
        },
      }),
    );
    const result = await readJson<{ ok: boolean; error?: { code: string; message: string } }>(
      response,
    );
    expect(result.status, "Agent A must not create deal against foreign property").toBe(403);
    expect(result.body.ok).toBe(false);
    expect(result.body.error?.code).toBe("FORBIDDEN");
  });

  it("Agent A can create a deal against Property A they own", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        cookie,
        body: {
          propertyId: fixture.propertyA.id,
          title: "معامله مجاز الف",
          price: 2_000_000_000,
          dealType: "sale",
          status: "closed",
        },
      }),
    );
    const result = await readJson<{ ok: boolean; data?: { agentId: string | null } }>(response);
    expect(result.status).toBe(201);
    expect(result.body.ok).toBe(true);
    expect(result.body.data?.agentId).toBe(fixture.agentA.agentId);
  });

  it("unauthenticated POST /api/deals is denied", async () => {
    const response = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        body: { title: "بدون نشست", price: 1, dealType: "sale" },
      }),
    );
    const result = await readJson<{ ok: boolean }>(response);
    expect(result.status).toBe(401);
    expect(result.body.ok).toBe(false);
  });

  it("agent listing only returns own deals, not foreign deals", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await listDeals(makeRequest("/api/deals", { cookie }));
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; agentId: string | null }> };
    }>(response);
    expect(result.status).toBe(200);
    const ids = result.body.data?.items.map((d) => d.id) ?? [];
    expect(ids).toContain(fixture.dealA.id);
    expect(ids, "Agent A must not see Agent B deals").not.toContain(fixture.dealB.id);
  });

  it("client role cannot create deals", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const response = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        cookie,
        body: {
          propertyId: fixture.propertyA.id,
          title: "موکل نباید معامله بسازد",
          price: 1,
          dealType: "sale",
        },
      }),
    );
    expect(response.status).toBe(403);
  });
});
