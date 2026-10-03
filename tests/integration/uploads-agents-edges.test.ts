import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { authCookieFor, buildIsolationFixture } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";
import { POST as uploadImages } from "@/app/api/uploads/images/route";
import { POST as uploadBlog } from "@/app/api/uploads/blog/route";
import { GET as publicAgent } from "@/app/api/agents/[id]/route";
import { POST as createDeal } from "@/app/api/deals/route";
import { POST as createBlog } from "@/app/api/blog/route";

function tinyPngFile(name = "pixel.png", type = "image/png") {
  // 1x1 PNG
  const bytes = Uint8Array.from(
    atob(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
    ),
    (c) => c.charCodeAt(0),
  );
  return new File([bytes], name, { type });
}

describe("Multipart upload success + validation", () => {
  it("authorized agent can upload a valid property image", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const form = new FormData();
    form.append("files", tinyPngFile());
    const request = new NextRequest("http://localhost/api/uploads/images", {
      method: "POST",
      headers: { cookie },
      body: form,
    });
    const response = await uploadImages(request);
    const result = await readJson<{ ok: boolean; data?: { urls: string[] } }>(response);
    expect(result.status, "Authorized upload must succeed").toBe(201);
    expect(result.body.data?.urls?.[0]).toMatch(/^\/uploads\/properties\//);
  });

  it("rejects invalid content type for property upload", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const form = new FormData();
    form.append("files", new File([Uint8Array.from([1, 2, 3])], "note.txt", { type: "text/plain" }));
    const request = new NextRequest("http://localhost/api/uploads/images", {
      method: "POST",
      headers: { cookie },
      body: form,
    });
    const response = await uploadImages(request);
    expect(response.status, "Bad file type must be rejected").toBe(400);
  });

  it("authorized agent can upload a blog cover image", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const form = new FormData();
    form.append("files", tinyPngFile("cover.png"));
    const request = new NextRequest("http://localhost/api/uploads/blog", {
      method: "POST",
      headers: { cookie },
      body: form,
    });
    const response = await uploadBlog(request);
    const result = await readJson<{ ok: boolean; data?: { url: string | null } }>(response);
    expect(result.status).toBe(201);
    expect(result.body.data?.url).toMatch(/^\/uploads\/blog\//);
  });
});

describe("Public agent detail + deal/blog edge cases", () => {
  it("GET /api/agents/[id] returns public profile and 404 for unknown", async () => {
    const fixture = await buildIsolationFixture();
    const ok = await publicAgent(makeRequest(`/api/agents/${fixture.agentA.agentId}`), {
      params: Promise.resolve({ id: fixture.agentA.agentId! }),
    });
    const okBody = await readJson<{ ok: boolean; data?: { name: string } }>(ok);
    expect(okBody.status).toBe(200);
    expect(okBody.body.data?.name).toBe(fixture.agentA.name);

    const missing = await publicAgent(makeRequest("/api/agents/does-not-exist"), {
      params: Promise.resolve({ id: "does-not-exist" }),
    });
    expect(missing.status, "Unknown agent must 404").toBe(404);
  });

  it("deal create rejects missing title and invalid enum", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.admin);
    const missingTitle = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        cookie,
        body: { price: 1, dealType: "sale" },
      }),
    );
    expect(missingTitle.status).toBeGreaterThanOrEqual(400);

    const badEnum = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        cookie,
        body: { title: "معامله", price: 1, dealType: "gift" },
      }),
    );
    expect(badEnum.status).toBeGreaterThanOrEqual(400);
  });

  it("admin can create a closed deal against any property", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.admin);
    const response = await createDeal(
      makeRequest("/api/deals", {
        method: "POST",
        cookie,
        body: {
          title: "معامله ادمین تست",
          price: 9_000_000_000,
          dealType: "sale",
          status: "closed",
          propertyId: fixture.propertyB.id,
          agentId: fixture.agentB.agentId,
        },
      }),
    );
    expect(response.status).toBe(201);
  });

  it("blog create rejects empty title and duplicate slug for same author path", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.admin);
    const empty = await createBlog(
      makeRequest("/api/blog", {
        method: "POST",
        cookie,
        body: {
          title: "a",
          slug: "x",
          excerpt: "",
          content: "متن",
          category: "بازار املاک",
          status: "draft",
        },
      }),
    );
    expect(empty.status).toBeGreaterThanOrEqual(400);

    const first = await createBlog(
      makeRequest("/api/blog", {
        method: "POST",
        cookie,
        body: {
          title: "مقاله یکتا",
          slug: "unique-admin-slug",
          excerpt: "خلاصه",
          content: "متن کافی برای مقاله تست",
          category: "بازار املاک",
          status: "draft",
        },
      }),
    );
    expect(first.status).toBe(201);

    const dup = await createBlog(
      makeRequest("/api/blog", {
        method: "POST",
        cookie,
        body: {
          title: "مقاله تکراری",
          slug: "unique-admin-slug",
          excerpt: "خلاصه",
          content: "متن کافی برای مقاله تست",
          category: "بازار املاک",
          status: "draft",
        },
      }),
    );
    expect([400, 409, 422]).toContain(dup.status);
  });
});
