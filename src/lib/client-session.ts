/**
 * Browser session cookie/mirror helpers.
 * Kept separate from `@/lib/auth` so Admin chrome can read/clear the UI
 * session mirror without pulling `siteConfig` / login catalog into the graph.
 */

export const AUTH_COOKIE = "agency_auth";

const SESSION_MIRROR_KEY = "agency_auth_mirror";

/** Structural session shape used by cookie encode/decode (matches AuthSession). */
export type ClientSessionMirror = {
  id: string;
  phone: string;
  name: string;
  role: string;
  agentId?: string;
  onboardingComplete?: boolean;
  clientProfile?: unknown;
};

export function encodeSession(session: ClientSessionMirror): string {
  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
  }
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64");
}

export function decodeSession(value: string | undefined | null): ClientSessionMirror | null {
  if (!value) return null;
  try {
    const json =
      typeof atob === "function"
        ? decodeURIComponent(escape(atob(value)))
        : Buffer.from(value, "base64").toString("utf8");
    const parsed = JSON.parse(json) as ClientSessionMirror;
    if (!parsed?.role || !parsed?.phone) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setClientSession(session: ClientSessionMirror) {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(encodeSession(session))}; path=/; max-age=${maxAge}; SameSite=Lax`;
  try {
    sessionStorage.setItem(SESSION_MIRROR_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}

export function clearClientSession() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  try {
    sessionStorage.removeItem(SESSION_MIRROR_KEY);
  } catch {
    /* ignore */
  }
}

export function readClientSession(): ClientSessionMirror | null {
  if (typeof document === "undefined") return null;
  try {
    const mirrored = sessionStorage.getItem(SESSION_MIRROR_KEY);
    if (mirrored) {
      const parsed = JSON.parse(mirrored) as ClientSessionMirror;
      if (parsed?.role && parsed?.phone) return parsed;
    }
  } catch {
    /* ignore */
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return decodeSession(match?.[1] ? decodeURIComponent(match[1]) : null);
}

/** Persist a UI mirror after JWT login (httpOnly cookie is not JS-readable). */
export function mirrorAuthSession(session: ClientSessionMirror) {
  try {
    sessionStorage.setItem(SESSION_MIRROR_KEY, JSON.stringify(session));
  } catch {
    /* ignore */
  }
}
