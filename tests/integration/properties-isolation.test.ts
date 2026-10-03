import { beforeEach, describe, expect, it } from "vitest";
import { GET as listProperties, POST as createProperty } from "@/app/api/properties/route";
import { GET as getProperty, PATCH as patchProperty } from "@/app/api/properties/[id]/route";
import { buildIsolationFixture, authCookieFor } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";

describe("Property API isolation", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("guests only see published/sold catalog and never receive price without session", async () => {
    const fixture = await buildIsolationFixture();
    const response = await listProperties(
      makeRequest("/api/properties", { searchParams: { pageSize: "20" } }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; price: number | null; priceVisible: boolean }> };
    }>(response);
    expect(result.status).toBe(200);
    const ids = result.body.data?.items.map((i) => i.id) ?? [];
    expect(ids).toEqual(expect.arrayContaining([fixture.propertyA.id, fixture.propertyB.id]));
    for (const item of result.body.data?.items ?? []) {
      expect(item.priceVisible, "Guest must not see prices").toBe(false);
      expect(item.price).toBeNull();
    }
  });

  it("agent query cannot widen scope via ?agentId= of another agent", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await listProperties(
      makeRequest("/api/properties", {
        cookie,
        searchParams: { agentId: fixture.agentB.agentId!, pageSize: "50" },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; agentId: string | null }> };
    }>(response);
    expect(result.status).toBe(200);
    const items = result.body.data?.items ?? [];
    expect(
      items.every((i) => i.agentId === fixture.agentA.agentId),
      "Session scope must win over ?agentId=",
    ).toBe(true);
    expect(items.some((i) => i.id === fixture.propertyB.id)).toBe(false);
  });

  it("Agent A cannot PATCH Property B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchProperty(
      makeRequest(`/api/properties/${fixture.propertyB.id}`, {
        method: "PATCH",
        cookie,
        body: { title: "تلاش برای تصاحب" },
      }),
      { params: Promise.resolve({ id: fixture.propertyB.id }) },
    );
    expect(response.status, "Agent A must not update Property B").toBe(403);
  });

  it("Agent A can PATCH Property A", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchProperty(
      makeRequest(`/api/properties/${fixture.propertyA.id}`, {
        method: "PATCH",
        cookie,
        body: { title: "ملک الف به‌روز" },
      }),
      { params: Promise.resolve({ id: fixture.propertyA.id }) },
    );
    const result = await readJson<{ ok: boolean; data?: { title: string } }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.title).toBe("ملک الف به‌روز");
  });

  it("guest cannot read draft property by id", async () => {
    const fixture = await buildIsolationFixture();
    const { getStore, saveStore } = await import("@/server/db/store");
    const store = getStore();
    const draft = store.properties.find((p) => p.id === fixture.propertyA.id)!;
    draft.status = "draft";
    saveStore();

    const response = await getProperty(
      makeRequest(`/api/properties/${fixture.propertyA.id}`),
      { params: Promise.resolve({ id: fixture.propertyA.id }) },
    );
    expect(response.status, "Draft property must not be public").toBe(404);
  });

  it("agent-created property is forced to session agentId", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await createProperty(
      makeRequest("/api/properties", {
        method: "POST",
        cookie,
        body: {
          title: "ملک جدید الف",
          location: "کرج",
          neighborhood: "گوهردشت",
          description: "توضیح کافی برای ایجاد ملک تست",
          price: 5_000_000_000,
          listingType: "sale",
          category: "apartment",
          bedrooms: 2,
          bathrooms: 1,
          areaSqm: 100,
          features: [],
          gallery: ["/images/landing/hero/banner.jpg"],
          agentId: fixture.agentB.agentId,
        },
      }),
    );
    const result = await readJson<{ ok: boolean; data?: { agentId: string | null } }>(response);
    expect(result.status).toBe(201);
    expect(result.body.data?.agentId).toBe(fixture.agentA.agentId);
  });
});
