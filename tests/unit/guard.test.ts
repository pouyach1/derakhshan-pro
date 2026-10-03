import { describe, expect, it } from "vitest";
import { ApiError } from "@/server/http/response";
import {
  agentScopeId,
  assertAgentOwns,
  getSessionFromRequest,
  requireSession,
} from "@/server/http/guard";
import type { AuthSession } from "@/lib/auth";
import { makeRequest } from "../helpers/http";

function session(partial: Partial<AuthSession> & Pick<AuthSession, "id" | "role">): AuthSession {
  return {
    phone: "09120000000",
    name: "تست",
    onboardingComplete: true,
    ...partial,
  };
}

describe("assertAgentOwns — agent isolation invariant", () => {
  it("admin always passes even when resource owner is foreign", () => {
    expect(() =>
      assertAgentOwns("a-foreign", session({ id: "admin-1", role: "admin" })),
    ).not.toThrow();
  });

  it("agent owning the resource passes", () => {
    expect(() =>
      assertAgentOwns(
        "a-test-a",
        session({ id: "agent-a", role: "agent", agentId: "a-test-a" }),
      ),
    ).not.toThrow();
  });

  it("Agent A must not access Agent B resources", () => {
    expect(() =>
      assertAgentOwns(
        "a-test-b",
        session({ id: "agent-a", role: "agent", agentId: "a-test-a" }),
        "این ملک متعلق به مشاور دیگری است",
      ),
    ).toThrow(ApiError);
  });

  it("agent cannot claim orphan resources with missing owner", () => {
    expect(() =>
      assertAgentOwns(null, session({ id: "agent-a", role: "agent", agentId: "a-test-a" })),
    ).toThrow(ApiError);
  });

  it("client role is denied by ownership gate", () => {
    expect(() =>
      assertAgentOwns("a-test-a", session({ id: "client-a", role: "client" })),
    ).toThrow(ApiError);
  });
});

describe("agentScopeId", () => {
  it("prefers agentId over user id", () => {
    expect(
      agentScopeId(session({ id: "user-1", role: "agent", agentId: "a-scope" })),
    ).toBe("a-scope");
  });

  it("falls back to user id when agentId missing", () => {
    expect(agentScopeId(session({ id: "user-1", role: "agent" }))).toBe("user-1");
  });
});

describe("getSessionFromRequest — request-scoped cookies", () => {
  it("request without cookie returns null without throwing", async () => {
    const sessionResult = await getSessionFromRequest(makeRequest("/api/auth/me"));
    expect(sessionResult).toBeNull();
  });

  it("requireSession without cookie throws 401", async () => {
    await expect(requireSession(makeRequest("/api/clients"))).rejects.toMatchObject({
      status: 401,
      code: "UNAUTHORIZED",
    });
  });
});
