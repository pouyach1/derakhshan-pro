import {
  AUTH_USERS,
  DEMO_OTP,
  ROLE_HOME,
  ROLE_LABELS,
  type AuthUser,
  type UserRole,
} from "@/config/auth";

export const AUTH_COOKIE = "derakhshan_auth";

export type AuthSession = {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  agentId?: string;
};

export { ROLE_LABELS, ROLE_HOME, type UserRole, type AuthUser };

export function normalizePhone(raw: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  let value = raw.trim();
  value = value.replace(/[۰-۹]/g, (d) => String(persian.indexOf(d)));
  value = value.replace(/[٠-٩]/g, (d) => String(arabic.indexOf(d)));
  value = value.replace(/[\s-]/g, "");
  if (value.startsWith("+98")) value = `0${value.slice(3)}`;
  if (value.startsWith("98") && value.length >= 12) value = `0${value.slice(2)}`;
  return value;
}

export function isValidIranMobile(phone: string): boolean {
  return /^09\d{9}$/.test(normalizePhone(phone));
}

export function lookupRole(phone: string): UserRole {
  const normalized = normalizePhone(phone);
  return AUTH_USERS.find((u) => u.phone === normalized)?.role ?? "client";
}

export function findAuthUser(phone: string): AuthUser | undefined {
  return AUTH_USERS.find((u) => u.phone === normalizePhone(phone));
}

export function resolveUser(phone: string): AuthUser {
  const normalized = normalizePhone(phone);
  return (
    findAuthUser(normalized) ?? {
      id: `client-${normalized}`,
      phone: normalized,
      name: "کاربر مهمان",
      role: "client",
    }
  );
}

export function verifyCredentials(phone: string, secret: string): AuthUser | null {
  const user = resolveUser(phone);
  if (user.role === "client") {
    return secret.trim() === DEMO_OTP ? user : null;
  }
  return user.password === secret ? user : null;
}

export function toSession(user: AuthUser): AuthSession {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    role: user.role,
    agentId: user.agentId,
  };
}

export function encodeSession(session: AuthSession): string {
  if (typeof btoa === "function") {
    return btoa(unescape(encodeURIComponent(JSON.stringify(session))));
  }
  return Buffer.from(JSON.stringify(session), "utf8").toString("base64");
}

export function decodeSession(value: string | undefined | null): AuthSession | null {
  if (!value) return null;
  try {
    const json =
      typeof atob === "function"
        ? decodeURIComponent(escape(atob(value)))
        : Buffer.from(value, "base64").toString("utf8");
    const parsed = JSON.parse(json) as AuthSession;
    if (!parsed?.role || !parsed?.phone) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function homeForRole(role: UserRole): string {
  return ROLE_HOME[role];
}

export function setClientSession(session: AuthSession) {
  const maxAge = 60 * 60 * 24 * 7;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(encodeSession(session))}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearClientSession() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

export function readClientSession(): AuthSession | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${AUTH_COOKIE}=([^;]*)`));
  return decodeSession(match?.[1] ? decodeURIComponent(match[1]) : null);
}
