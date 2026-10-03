import { beforeEach, describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import { buildIsolationFixture } from "../helpers/store";

describe("SEO regression — Phase 6", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("sitemap includes listings and excludes /properties and /login", async () => {
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith("/listings")), "/listings must exist").toBe(true);
    expect(urls.some((u) => u.includes("/properties")), "/properties must not appear").toBe(
      false,
    );
    expect(urls.some((u) => u.endsWith("/login")), "/login must not appear in sitemap").toBe(
      false,
    );
  });

  it("published articles appear and drafts do not", async () => {
    const fixture = await buildIsolationFixture();
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.includes(`/blog/${fixture.blogA.slug}`))).toBe(true);
    expect(
      urls.some((u) => u.includes(`/blog/${fixture.draftBlog.slug}`)),
      "Draft article must not appear in sitemap",
    ).toBe(false);
  });

  it("published properties appear under /listings/[id]", async () => {
    const fixture = await buildIsolationFixture();
    const entries = await sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls.some((u) => u.endsWith(`/listings/${fixture.propertyA.id}`))).toBe(true);
  });

  it("robots allows public and blocks private panels", () => {
    const result = robots();
    const rule = Array.isArray(result.rules) ? result.rules[0] : result.rules;
    expect(rule?.allow).toBe("/");
    const disallow = rule?.disallow ?? [];
    const list = Array.isArray(disallow) ? disallow : [disallow];
    expect(list).toEqual(
      expect.arrayContaining(["/admin", "/admin/", "/agent", "/agent/", "/client", "/client/", "/api/"]),
    );
    expect(String(result.sitemap)).toContain("/sitemap.xml");
  });
});
