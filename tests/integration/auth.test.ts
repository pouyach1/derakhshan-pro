import { beforeEach, describe, expect, it } from "vitest";
import { SignJWT } from "jose";
import { POST as login } from "@/app/api/auth/login/route";
import { GET as me } from "@/app/api/auth/me/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { verifySessionToken, authCookieName } from "@/server/auth/session";
import { buildIsolationFixture, authCookieFor, TEST_PASSWORD } from "../helpers/store";
import { makeRequest, readJson } from "../helpers/http";

describe("Authentication API", () => {
  beforeEach(async () => {
    await buildIsolationFixture();
  });

  it("valid staff credentials create a session cookie and redirect path", async () => {
    const response = await login(
      makeRequest("/api/auth/login", {
        body: { identifier: "09120000001", secret: TEST_PASSWORD },
      }),
    );
    const result = await readJson<{
      ok: boolean;
      data?: { session: { role: string }; redirectTo: string };
      error?: { code: string };
    }>(response);

    expect(result.status, "Valid login must succeed").toBe(200);
    expect(result.body.ok).toBe(true);
    expect(result.body.data?.session.role).toBe("agent");
    expect(result.body.data?.redirectTo).toContain("/agent");
    expect(result.cookies.some((c) => c.includes(authCookieName()))).toBe(true);
  });

  it("invalid credentials are rejected", async () => {
    const response = await login(
      makeRequest("/api/auth/login", {
        body: { identifier: "09120000001", secret: "wrong-password" },
      }),
    );
    const result = await readJson<{ ok: boolean; error?: { code: string } }>(response);
    expect(result.status, "Invalid credentials must not authenticate").toBe(401);
    expect(result.body.ok).toBe(false);
  });

  it("malformed JSON body returns 400", async () => {
    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not-json",
    });
    const response = await login(request as never);
    const result = await readJson<{ ok: boolean; error?: { code: string } }>(response);
    expect(result.status).toBe(400);
    expect(result.body.error?.code).toBe("INVALID_JSON");
  });

  it("/api/auth/me returns session for authenticated cookie", async () => {
    const fixture = await buildIsolationFixture();
    const cookie = await authCookieFor(fixture.agentA);
    const response = await me(makeRequest("/api/auth/me", { cookie }));
    const result = await readJson<{
      ok: boolean;
      data?: { session: { id: string; role: string } };
    }>(response);
    expect(result.status).toBe(200);
    expect(result.body.data?.session.id).toBe(fixture.agentA.id);
    expect(result.body.data?.session.role).toBe("agent");
  });

  it("/api/auth/me rejects missing session", async () => {
    const response = await me(makeRequest("/api/auth/me"));
    const result = await readJson<{ ok: boolean }>(response);
    expect(result.status).toBe(401);
    expect(result.body.ok).toBe(false);
  });

  it("logout clears the auth cookie", async () => {
    const response = await logout(makeRequest("/api/auth/logout", { method: "POST" }));
    expect(response.status).toBe(200);
    const setCookie = response.headers.getSetCookie?.() ?? [];
    expect(setCookie.some((c) => c.includes(`${authCookieName()}=`) && /Max-Age=0|max-age=0/i.test(c))).toBe(
      true,
    );
  });

  it("invalid JWT is rejected by verifySessionToken", async () => {
    const bad = await new SignJWT({ id: "x", role: "admin", phone: "1", name: "x" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode("completely-wrong-secret-value-xxxxx"));
    expect(await verifySessionToken(bad)).toBeNull();
  });

  it("expired JWT is rejected", async () => {
    const fixture = await buildIsolationFixture();
    const { signSession } = await import("@/server/auth/session");
    const token = await signSession(
      {
        id: fixture.agentA.id,
        phone: fixture.agentA.phone,
        name: fixture.agentA.name,
        role: "agent",
        agentId: fixture.agentA.agentId || undefined,
        onboardingComplete: true,
      },
      1,
    );
    await new Promise((r) => setTimeout(r, 1200));
    expect(await verifySessionToken(token)).toBeNull();
  });
});
