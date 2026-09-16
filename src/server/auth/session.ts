import { SignJWT, jwtVerify } from "jose";
import type { AuthSession, UserRole } from "@/lib/auth";

const COOKIE = "agency_auth";
const DEFAULT_TTL = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret =
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    "dev-only-change-me-derakhshan-agency-secret-key-32b";
  return new TextEncoder().encode(secret);
}

export function authCookieName() {
  return COOKIE;
}

export async function signSession(session: AuthSession, ttlSeconds = DEFAULT_TTL) {
  return new SignJWT({
    id: session.id,
    phone: session.phone,
    name: session.name,
    role: session.role,
    agentId: session.agentId,
    onboardingComplete: session.onboardingComplete ?? false,
    clientProfile: session.clientProfile ?? null,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .setSubject(session.id)
    .sign(secretKey());
}

export async function verifySessionToken(token: string | undefined | null): Promise<AuthSession | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.id || !payload.role || !payload.phone || !payload.name) return null;
    return {
      id: String(payload.id),
      phone: String(payload.phone),
      name: String(payload.name),
      role: payload.role as UserRole,
      agentId: payload.agentId ? String(payload.agentId) : undefined,
      onboardingComplete: Boolean(payload.onboardingComplete),
      clientProfile: (payload.clientProfile as AuthSession["clientProfile"]) ?? undefined,
    };
  } catch {
    return null;
  }
}

export function sessionCookieOptions(maxAge = DEFAULT_TTL) {
  const secure = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
