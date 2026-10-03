import { beforeEach, describe, expect, it } from "vitest";
import { GET as listClients, POST as createClient } from "@/app/api/clients/route";
import { PATCH as patchClient, DELETE as deleteClient } from "@/app/api/clients/[id]/route";
import { buildIsolationFixture, authCookieFor } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";

describe("CRM client isolation", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("Agent A cannot list or mutate Client B", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);

    const list = await listClients(makeRequest("/api/clients", { cookie }));
    const listed = await readJson<{
      ok: boolean;
      data?: { items: Array<{ id: string }> };
    }>(list);
    const ids = listed.body.data?.items.map((c) => c.id) ?? [];
    expect(ids).toContain(fixture.clientRecordA.id);
    expect(ids, "Agent A must not see Client B").not.toContain(fixture.clientRecordB.id);

    const patch = await patchClient(
      makeRequest(`/api/clients/${fixture.clientRecordB.id}`, {
        method: "PATCH",
        cookie,
        body: { name: "تلاش برای تصاحب" },
      }),
      { params: Promise.resolve({ id: fixture.clientRecordB.id }) },
    );
    expect(patch.status, "Agent A must not patch Client B").toBe(403);

    const del = await deleteClient(
      makeRequest(`/api/clients/${fixture.clientRecordB.id}`, {
        method: "DELETE",
        cookie,
      }),
      { params: Promise.resolve({ id: fixture.clientRecordB.id }) },
    );
    expect(del.status, "Agent A must not delete Client B").toBe(403);
  });

  it("Agent A can create and update own client", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const created = await createClient(
      makeRequest("/api/clients", {
        method: "POST",
        cookie,
        body: {
          name: "موکل جدید الف",
          phone: "09127770001",
          preferredNeighborhood: "مهرشهر",
          budgetMin: 5,
          budgetMax: 20,
          urgency: "high",
          intent: "buy",
        },
      }),
    );
    const createdBody = await readJson<{ ok: boolean; data?: { id: string; agentId: string } }>(
      created,
    );
    expect(created.status).toBe(201);
    expect(createdBody.body.data?.agentId).toBe(fixture.agentA.agentId);

    const patched = await patchClient(
      makeRequest(`/api/clients/${createdBody.body.data!.id}`, {
        method: "PATCH",
        cookie,
        body: { name: "موکل به‌روز الف" },
      }),
      { params: Promise.resolve({ id: createdBody.body.data!.id }) },
    );
    expect(patched.status).toBe(200);
  });

  it("unauthenticated CRM client access is denied", async () => {
    const response = await listClients(makeRequest("/api/clients"));
    expect(response.status).toBe(401);
  });
});
