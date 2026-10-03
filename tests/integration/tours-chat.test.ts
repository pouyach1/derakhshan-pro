import { beforeEach, describe, expect, it } from "vitest";
import { GET as listTours, POST as createTour, PATCH as patchTour } from "@/app/api/tours/route";
import { GET as listMessages } from "@/app/api/chat/threads/[id]/messages/route";
import { buildIsolationFixture, authCookieFor } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";

describe("Tour ownership", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("Agent A listing ignores ?agentId= of Agent B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await listTours(
      makeRequest("/api/tours", {
        cookie,
        searchParams: { agentId: fixture.agentB.agentId! },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string; agentId: string }> };
    }>(response);
    expect(result.status).toBe(200);
    const ids = result.body.data?.items.map((t) => t.id) ?? [];
    expect(ids).toContain(fixture.tourA.id);
    expect(ids, "Agent A must not see Tour B").not.toContain(fixture.tourB.id);
  });

  it("Agent A cannot update Tour B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await patchTour(
      makeRequest("/api/tours", {
        method: "PATCH",
        cookie,
        searchParams: { id: fixture.tourB.id },
        body: { status: "canceled" },
      }),
    );
    expect(
      [403, 404],
      "Agent A must not update Tour B (403 deny or 404 hide)",
    ).toContain(response.status);
  });

  it("Agent A cannot create tour against foreign property", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await createTour(
      makeRequest("/api/tours", {
        method: "POST",
        cookie,
        body: {
          propertyId: fixture.propertyB.id,
          clientId: fixture.clientRecordA.id,
          scheduledAt: new Date().toISOString(),
        },
      }),
    );
    expect([403, 400]).toContain(response.status);
  });

  it("Agent A can create tour for own property and client", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await createTour(
      makeRequest("/api/tours", {
        method: "POST",
        cookie,
        body: {
          propertyId: fixture.propertyA.id,
          clientId: fixture.clientRecordA.id,
          scheduledAt: new Date(Date.now() + 86400000).toISOString(),
          notes: "بازدید تست",
        },
      }),
    );
    expect(response.status).toBe(201);
  });
});

describe("Chat thread access", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("Client A cannot read Client B thread messages", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const response = await listMessages(
      makeRequest(`/api/chat/threads/${fixture.threadB.id}/messages`, { cookie }),
      { params: Promise.resolve({ id: fixture.threadB.id }) },
    );
    expect(response.status, "Client A must not access Client B chat thread").toBe(403);
  });

  it("Client A can read own thread messages", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.clientA);
    const response = await listMessages(
      makeRequest(`/api/chat/threads/${fixture.threadA.id}/messages`, { cookie }),
      { params: Promise.resolve({ id: fixture.threadA.id }) },
    );
    const result = await readJson<{
      ok: boolean;
      data?: { items: Array<{ body: string }> };
    }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.items.some((m) => m.body.includes("موکل الف"))).toBe(true);
  });

  it("unauthenticated chat access is denied", async () => {
    const fixture = await buildIsolationFixture();
    const response = await listMessages(
      makeRequest(`/api/chat/threads/${fixture.threadA.id}/messages`),
      { params: Promise.resolve({ id: fixture.threadA.id }) },
    );
    expect(response.status).toBe(401);
  });
});
