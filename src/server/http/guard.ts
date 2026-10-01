import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import type { AuthSession, UserRole } from "@/lib/auth";
import { authCookieName, verifySessionToken } from "@/server/auth/session";
import { ApiError } from "@/server/http/response";

export async function getSessionFromRequest(request?: NextRequest): Promise<AuthSession | null> {
  const token =
    request?.cookies.get(authCookieName())?.value ??
    (await cookies()).get(authCookieName())?.value;
  return verifySessionToken(token);
}

export async function requireSession(
  request?: NextRequest,
  roles?: UserRole[],
): Promise<AuthSession> {
  const session = await getSessionFromRequest(request);
  if (!session) {
    throw new ApiError(401, "UNAUTHORIZED", "نشست معتبر یافت نشد");
  }
  if (roles && !roles.includes(session.role)) {
    throw new ApiError(403, "FORBIDDEN", "دسترسی به این بخش مجاز نیست");
  }
  return session;
}

/** Stable owner key for agent-scoped CRM records (agentId preferred, else user id). */
export function agentScopeId(session: AuthSession): string {
  return session.agentId || session.id;
}

/**
 * Server-side ownership gate for agent sessions.
 * Admin always passes. Missing/empty resource owner is denied for agents (no orphan claim).
 */
export function assertAgentOwns(
  resourceAgentId: string | null | undefined,
  session: AuthSession,
  message = "دسترسی به این مورد مجاز نیست",
): void {
  if (session.role === "admin") return;
  if (session.role !== "agent") {
    throw new ApiError(403, "FORBIDDEN", "دسترسی به این بخش مجاز نیست");
  }
  const mine = agentScopeId(session);
  if (!resourceAgentId || resourceAgentId !== mine) {
    throw new ApiError(403, "FORBIDDEN", message);
  }
}

export function clientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
