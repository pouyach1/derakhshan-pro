import { describe, expect, it } from "vitest";
import { authCookieFor, buildIsolationFixture } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";
import { POST as uploadImages } from "@/app/api/uploads/images/route";
import { PUT as replacePropertyImages } from "@/app/api/properties/[id]/images/route";
import { GET as listLeads } from "@/app/api/leads/route";
import { POST as onboarding } from "@/app/api/auth/onboarding/route";
import { verifySessionToken, authCookieName } from "@/server/auth/session";

describe("Upload authorization — Phase 7 regression", () => {
  it("unauthenticated upload is denied", async () => {
    const response = await uploadImages(makeRequest("/api/uploads/images", { method: "POST" }));
    expect(response.status, "Unauthenticated upload must be denied").toBe(401);
  });

  it("client role cannot upload property images", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const response = await uploadImages(
      makeRequest("/api/uploads/images", { method: "POST", cookie }),
    );
    expect(response.status, "Client must not upload property images").toBe(403);
  });

  it("Agent A cannot replace images on Property B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await replacePropertyImages(
      makeRequest(`/api/properties/${fixture.propertyB.id}/images`, {
        method: "PUT",
        cookie,
        body: { urls: ["/images/landing/hero/banner.jpg"] },
      }),
      { params: Promise.resolve({ id: fixture.propertyB.id }) },
    );
    expect(response.status, "Agent A must not modify Property B gallery").toBe(403);
  });

  it("Agent A can replace images on Property A", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await replacePropertyImages(
      makeRequest(`/api/properties/${fixture.propertyA.id}/images`, {
        method: "PUT",
        cookie,
        body: { urls: ["/images/landing/hero/banner.jpg"] },
      }),
      { params: Promise.resolve({ id: fixture.propertyA.id }) },
    );
    expect(response.status).toBe(200);
  });
});

describe("Lead isolation — query param cannot widen scope", () => {
  it("Agent A listing ignores ?agentId= of Agent B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await listLeads(
      makeRequest("/api/leads", {
        cookie,
        searchParams: { agentId: fixture.agentB.agentId! },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; assignedAgentId: string | null }> };
    }>(response);
    expect(result.status).toBe(200);
    const ids = result.body.data?.items.map((i) => i.id) ?? [];
    expect(ids, "Agent A must not see Lead B via ?agentId=").not.toContain(fixture.leadB.id);
    expect(ids).toContain(fixture.leadA.id);
  });
});

describe("Client onboarding session integrity", () => {
  it("agent cannot complete client onboarding", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await onboarding(
      makeRequest("/api/auth/onboarding", {
        method: "POST",
        cookie,
        body: {
          fullName: "هک",
          intent: "buy",
          neighborhoods: ["عظیمیه"],
          budgetMin: 1,
          budgetMax: 2,
          areaMin: 50,
          areaMax: 100,
          bedrooms: 1,
          hasElevator: true,
          hasParking: true,
        },
      }),
    );
    expect(response.status, "Agent must not hit client onboarding").toBe(403);
  });

  it("client onboarding refreshes JWT without changing role or user id", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const response = await onboarding(
      makeRequest("/api/auth/onboarding", {
        method: "POST",
        cookie,
        body: {
          fullName: "موکل به‌روز",
          intent: "buy",
          neighborhoods: ["عظیمیه"],
          budgetMin: 10,
          budgetMax: 40,
          areaMin: 80,
          areaMax: 200,
          bedrooms: 2,
          hasElevator: true,
          hasParking: true,
        },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { session: { id: string; role: string; name: string } };
    }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.session.role).toBe("client");
    expect(result.body.data?.session.id).toBe(fixture.clientA.id);
    expect(result.body.data?.session.name).toBe("موکل به‌روز");

    const setCookie = result.cookies.find((c) => c.startsWith(`${authCookieName()}=`));
    expect(setCookie, "Onboarding must set HttpOnly agency_auth cookie").toBeTruthy();
    const token = setCookie!.split(";")[0].slice(`${authCookieName()}=`.length);
    const verified = await verifySessionToken(token);
    expect(verified?.role).toBe("client");
    expect(verified?.id).toBe(fixture.clientA.id);
  });
});
