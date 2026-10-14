/**
 * Edge-safe JWT verify for middleware only.
 * Imports jose/jwt/verify (not the jose barrel) so CompressionStream / JWE
 * never enter the Edge middleware bundle.
 */
import { jwtVerify } from "jose/jwt/verify";
import type { AuthSession, UserRole } from "@/lib/auth";
import {
  DEV_FALLBACK_SECRET,
  isProductionRuntime,
  isWeakAuthSecret,
  readAuthSecretRaw,
} from "@/server/auth/secrets";

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

  return new TextEncoder().encode(secret || DEV_FALLBACK_SECRET);
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
