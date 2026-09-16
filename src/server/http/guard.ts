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

export function clientIp(request: NextRequest) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
