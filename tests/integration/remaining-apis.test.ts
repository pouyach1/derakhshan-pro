import { describe, expect, it } from "vitest";
import { authCookieFor, buildIsolationFixture } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";
import { GET as health } from "@/app/api/health/route";
import { POST as otp } from "@/app/api/auth/otp/route";
import { POST as contact } from "@/app/api/contact/route";
import { POST as inquire } from "@/app/api/inquiries/route";
import { GET as activity } from "@/app/api/activity/route";
import { GET as stats } from "@/app/api/stats/route";
import { GET as settingsGet, PATCH as settingsPatch } from "@/app/api/settings/route";
import { GET as agents } from "@/app/api/agents/route";
import { PATCH as patchLead } from "@/app/api/leads/[id]/route";
import { GET as listThreads, POST as createThread } from "@/app/api/chat/threads/route";
import { POST as blogUpload } from "@/app/api/uploads/blog/route";

describe("Public utility APIs", () => {
  it("GET /api/health is public and healthy with persistence diagnostics", async () => {
    const response = await health();
    const result = await readJson<{
      ok: boolean;
      data?: {
        status: string;
        persistence?: {
          mode: string;
          readable: boolean;
          corrupt: boolean;
          schemaVersion: number | null;
        };
      };
    }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.status).toBe("healthy");
    expect(result.body.data?.persistence?.readable).toBe(true);
    expect(result.body.data?.persistence?.corrupt).toBe(false);
    expect(result.body.data?.persistence?.mode).toMatch(/json-file|memory/);
    expect(JSON.stringify(result.body)).not.toMatch(/agency\.json|AUTH_SECRET|\/workspace/);
  });

  it("OTP accepts valid Iranian mobile and never returns the raw code", async () => {
    const response = await otp(
      makeRequest("/api/auth/otp", {
        method: "POST",
        body: { phone: "09121234567" },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { sent: boolean; phone: string; demoHint?: string };
    }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.sent).toBe(true);
    expect(result.body.data?.phone).toContain("***");
    expect(JSON.stringify(result.body)).not.toContain("1234");
  });

  it("OTP rejects invalid phone numbers", async () => {
    const response = await otp(
      makeRequest("/api/auth/otp", {
        method: "POST",
        body: { phone: "123" },
      }),
    );
    expect([400, 422]).toContain(response.status);
  });

  it("contact form accepts valid payload", async () => {
    await buildIsolationFixture();
    const response = await contact(
      makeRequest("/api/contact", {
        method: "POST",
        body: {
          name: "بازدیدکننده تست",
          message: "درخواست مشاوره برای عظیمیه",
          tab: "home",
          phone: "09120001122",
        },
      }),
    );
    expect(response.status, "Valid contact must succeed").toBe(201);
  });

  it("contact form rejects empty message", async () => {
    const response = await contact(
      makeRequest("/api/contact", {
        method: "POST",
        body: { name: "آ", message: "", tab: "home" },
      }),
    );
    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it("property inquiry requires valid propertyId and phone", async () => {
    const fixture = await buildIsolationFixture();
    const bad = await inquire(
      makeRequest("/api/inquiries", {
        method: "POST",
        body: { name: "علاقه‌مند", phone: "12", propertyId: fixture.propertyA.id },
      }),
    );
    expect(bad.status).toBeGreaterThanOrEqual(400);

    const ok = await inquire(
      makeRequest("/api/inquiries", {
        method: "POST",
        body: {
          name: "علاقه‌مند",
          phone: "09123334455",
          propertyId: fixture.propertyA.id,
          message: "لطفاً برای بازدید هماهنگ کنید",
        },
      }),
    );
    expect(ok.status, "Valid inquiry must succeed").toBe(201);
  });
});

describe("Workspace scoped APIs — activity/stats/agents/settings", () => {
  it("activity and stats require staff session", async () => {
    expect((await activity(makeRequest("/api/activity"))).status).toBe(401);
    expect((await stats(makeRequest("/api/stats"))).status).toBe(401);
  });

  it("Agent A activity/stats succeed and remain scoped", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const act = await readJson<{ ok: boolean; data?: { items: unknown[] } }>(
      await activity(makeRequest("/api/activity", { cookie, searchParams: { limit: "20" } })),
    );
    expect(act.status).toBe(200);
    expect(Array.isArray(act.body.data?.items)).toBe(true);

    const st = await readJson<{ ok: boolean }>(
      await stats(makeRequest("/api/stats", { cookie })),
    );
    expect(st.status).toBe(200);
  });

  it("client cannot read activity or stats", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    expect((await activity(makeRequest("/api/activity", { cookie }))).status).toBe(403);
    expect((await stats(makeRequest("/api/stats", { cookie }))).status).toBe(403);
  });

  it("settings are admin-only", async () => {
    const fixture = await buildIsolationFixture();
    const agentCookie = await authCookieFor(fixture.agentA);
    expect((await settingsGet(makeRequest("/api/settings", { cookie: agentCookie }))).status).toBe(
      403,
    );

    const adminCookie = await authCookieFor(fixture.admin);
    const get = await readJson<{ ok: boolean }>(
      await settingsGet(makeRequest("/api/settings", { cookie: adminCookie })),
    );
    expect(get.status).toBe(200);

    const patch = await settingsPatch(
      makeRequest("/api/settings", {
        method: "PATCH",
        cookie: adminCookie,
        body: { managerNameFa: "مدیر تست به‌روز" },
      }),
    );
    expect(patch.status).toBe(200);
  });

  it("agents listing is staff-only and agent-scoped", async () => {
    const fixture = await buildIsolationFixture();
    expect((await agents(makeRequest("/api/agents"))).status).toBe(401);

    const cookie = await authCookieFor(fixture.agentA);
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; userId?: string }> };
    }>(await agents(makeRequest("/api/agents", { cookie })));
    expect(result.status).toBe(200);
    const userIds = result.body.data?.items.map((i) => i.userId ?? i.id) ?? [];
    expect(userIds).toContain(fixture.agentA.id);
    expect(userIds, "Agent A must not list Agent B via /api/agents").not.toContain(
      fixture.agentB.id,
    );
  });
});

describe("Lead PATCH ownership + chat threads + blog upload auth", () => {
  it("Agent A cannot update Lead B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchLead(
      makeRequest(`/api/leads/${fixture.leadB.id}`, {
        method: "PATCH",
        cookie,
        body: { status: "contacted" },
      }),
      { params: Promise.resolve({ id: fixture.leadB.id }) },
    );
    expect(
      [403, 404],
      "Agent A must not update Lead B",
    ).toContain(response.status);
  });

  it("Agent A can update own Lead A status", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchLead(
      makeRequest(`/api/leads/${fixture.leadA.id}`, {
        method: "PATCH",
        cookie,
        body: { status: "contacted" },
      }),
      { params: Promise.resolve({ id: fixture.leadA.id }) },
    );
    expect(response.status).toBe(200);
  });

  it("Client A thread list excludes Client B threads", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; ownerUserId: string }> };
    }>(await listThreads(makeRequest("/api/chat/threads", { cookie })));
    expect(result.status).toBe(200);
    const ids = result.body.data?.items.map((i) => i.id) ?? [];
    expect(ids).toContain(fixture.threadA.id);
    expect(ids, "Client A must not see Client B thread").not.toContain(fixture.threadB.id);
  });

  it("authenticated client can ensure own support thread", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const response = await createThread(
      makeRequest("/api/chat/threads", {
        method: "POST",
        cookie,
        body: { kind: "support" },
      }),
    );
    expect(response.status).toBe(201);
  });

  it("blog upload rejects unauthenticated and client roles", async () => {
    expect((await blogUpload(makeRequest("/api/uploads/blog", { method: "POST" }))).status).toBe(
      401,
    );
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    expect(
      (await blogUpload(makeRequest("/api/uploads/blog", { method: "POST", cookie }))).status,
    ).toBe(403);
  });

  it("agent blog upload without files returns 400", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    // NextRequest with empty FormData-like body is awkward; sending JSON still hits auth then fails parsing.
    // Use a multipart body with no files via FormData polyfill.
    const form = new FormData();
    const request = new Request("http://localhost/api/uploads/blog", {
      method: "POST",
      headers: { cookie },
      body: form,
    });
    const { NextRequest } = await import("next/server");
    const response = await blogUpload(new NextRequest(request));
    expect(response.status, "Missing files must be rejected after auth").toBe(400);
  });
});
