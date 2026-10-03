import { beforeEach, describe, expect, it } from "vitest";
import { GET as listBlog, POST as createBlog } from "@/app/api/blog/route";
import { GET as getBlog, PATCH as patchBlog, DELETE as deleteBlog } from "@/app/api/blog/[id]/route";
import { listPublishedBlogPosts } from "@/server/services/blog";
import { buildIsolationFixture, authCookieFor } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";

describe("Blog ownership and draft exclusion", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("draft posts never appear in published listing", async () => {
    const fixture = await buildIsolationFixture();
    const published = await listPublishedBlogPosts();
    const slugs = published.map((p) => p.slug);
    expect(slugs).toContain(fixture.blogA.slug);
    expect(slugs, "Draft blog post must not appear in public listing").not.toContain(
      fixture.draftBlog.slug,
    );
  });

  it("Agent A cannot modify Agent B article", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchBlog(
      makeRequest(`/api/blog/${fixture.blogB.id}`, {
        method: "PATCH",
        cookie,
        body: { title: "تصاحب مقاله ب" },
      }),
      { params: Promise.resolve({ id: fixture.blogB.id }) },
    );
    expect(response.status, "Agent A must not edit Agent B blog").toBe(403);
  });

  it("Agent A can update own article", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchBlog(
      makeRequest(`/api/blog/${fixture.blogA.id}`, {
        method: "PATCH",
        cookie,
        body: { title: "مقاله الف به‌روز" },
      }),
      { params: Promise.resolve({ id: fixture.blogA.id }) },
    );
    const result = await readJson<{ ok: boolean; data?: { title: string } }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.title).toBe("مقاله الف به‌روز");
  });

  it("Agent A cannot delete Agent B article", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await deleteBlog(
      makeRequest(`/api/blog/${fixture.blogB.id}`, { method: "DELETE", cookie }),
      { params: Promise.resolve({ id: fixture.blogB.id }) },
    );
    expect(response.status).toBe(403);
  });

  it("guest blog GET by id for draft is denied/not found", async () => {
    const fixture = await buildIsolationFixture();
    const response = await getBlog(
      makeRequest(`/api/blog/${fixture.draftBlog.id}`),
      { params: Promise.resolve({ id: fixture.draftBlog.id }) },
    );
    expect([403, 404]).toContain(response.status);
  });

  it("agent can create a draft post under own authorship", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await createBlog(
      makeRequest("/api/blog", {
        method: "POST",
        cookie,
        body: {
          title: "مقاله جدید تست",
          excerpt: "خلاصه",
          content: "متن کامل مقاله جدید تست",
          category: "بازار املاک",
          status: "draft",
          coverImage: "/images/landing/hero/banner.jpg",
        },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { status: string; author?: { id: string } };
    }>(response);
    expect(result.status).toBe(201);
    expect(result.body.data?.status).toBe("draft");
  });

  it("public blog list does not require auth and excludes drafts", async () => {
    const response = await listBlog(
      makeRequest("/api/blog", { searchParams: { status: "published" } }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ slug: string; status: string }> };
    }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.items.every((p) => p.status === "published")).toBe(true);
    expect(result.body.data?.items.some((p) => p.slug === "draft-secret")).toBe(false);
  });
});
