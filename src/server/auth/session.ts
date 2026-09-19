import { SignJWT, jwtVerify } from "jose";
import type { AuthSession, UserRole } from "@/lib/auth";

const COOKIE = "agency_auth";
const DEFAULT_TTL = 60 * 60 * 24 * 7; // 7 days
const DEV_FALLBACK_SECRET = "dev-only-change-me-derakhshan-agency-secret-key-32b";

function isWeakSecret(secret: string) {
  const normalized = secret.trim().toLowerCase();
  return (
    secret.trim().length < 32 ||
    normalized.startsWith("change-me") ||
    normalized === DEV_FALLBACK_SECRET
  );
}

function secretKey() {
  const secret = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "";
  if (secret && !isWeakSecret(secret)) {
    return new TextEncoder().encode(secret);
  }

  // Showcase / Workers demos often bake NEXT_PUBLIC_DEMO_STAFF_PASSWORD at build
  // time but forget AUTH_SECRET. Derive a stable JWT key so login does not 500.
  const demoStaff = process.env.NEXT_PUBLIC_DEMO_STAFF_PASSWORD?.trim() || "";
  if (demoStaff.length >= 8) {
    const derived = `derakhshan-demo-jwt-v1:${demoStaff}:pad-to-32-chars-minimum`;
    return new TextEncoder().encode(derived);
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "AUTH_SECRET must be set to a strong random value (min 32 chars) in production",
    );
  }

  if (!secret) {
    console.warn(
      "[auth] AUTH_SECRET is missing — using a development-only fallback. Set AUTH_SECRET before deploy.",
    );
  } else {
    console.warn(
      "[auth] AUTH_SECRET looks weak — using it only in development. Use a strong secret before deploy.",
    );
  }

  return new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
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
