import { SignJWT, jwtVerify } from "jose";
import type { AuthSession, UserRole } from "@/lib/auth";
import {
  DEV_FALLBACK_SECRET,
  isProductionRuntime,
  isWeakAuthSecret,
  readAuthSecretRaw,
} from "@/server/env";

const COOKIE = "agency_auth";
const DEFAULT_TTL = 60 * 60 * 24 * 7; // 7 days

function secretKey() {
  const secret = readAuthSecretRaw();
  if (secret && !isWeakAuthSecret(secret)) {
    return new TextEncoder().encode(secret);
  }

  if (isProductionRuntime()) {
    throw new Error(
      "[auth] AUTH_SECRET is missing or weak in production. Set a strong AUTH_SECRET (min 32 characters) before starting the app.",
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
