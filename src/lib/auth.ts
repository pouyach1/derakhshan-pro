import {
  AUTH_USERS,
  DEMO_OTP,
  ROLE_HOME,
  ROLE_LABELS,
  type AuthUser,
  type UserRole,
} from "@/config/auth";

export const AUTH_COOKIE = "derakhshan_auth";

export type DealIntent = "buy" | "rent" | "invest";

export type ClientProfile = {
  fullName: string;
  intent: DealIntent;
  neighborhoods: string[];
  budgetMin: number;
  budgetMax: number;
  areaMin: number;
  areaMax: number;
  bedrooms: number;
  hasElevator: boolean;
  hasParking: boolean;
};

export type AuthSession = {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  agentId?: string;
  /** Clients must finish CRM onboarding before browsing as a known profile. */
  onboardingComplete?: boolean;
  clientProfile?: ClientProfile;
};

export { ROLE_LABELS, ROLE_HOME, type UserRole, type AuthUser };

export const DEAL_INTENT_LABELS: Record<DealIntent, string> = {
  buy: "خرید",
  rent: "رهن و اجاره",
  invest: "سرمایه‌گذاری",
};

export const NEIGHBORHOOD_OPTIONS = [
  "نیاوران",
  "فرشته",
  "زعفرانیه",
  "الهیه",
  "جردن",
  "ونک",
  "سعادت‌آباد",
  "شهرک غرب",
  "لواسان",
  "اقدسیه",
] as const;

export const BUDGET_PRESETS = [
  { label: "تا ۱۰ میلیارد", min: 0, max: 10_000_000_000 },
  { label: "۱۰–۲۰ میلیارد", min: 10_000_000_000, max: 20_000_000_000 },
  { label: "۲۰–۴۰ میلیارد", min: 20_000_000_000, max: 40_000_000_000 },
  { label: "۴۰–۸۰ میلیارد", min: 40_000_000_000, max: 80_000_000_000 },
  { label: "بیش از ۸۰ میلیارد", min: 80_000_000_000, max: 200_000_000_000 },
] as const;

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

export function normalizeIdentifier(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.includes("@")) return trimmed;
  return normalizePhone(raw);
}

export function isValidIdentifier(raw: string): boolean {
  const value = raw.trim();
  if (value.includes("@")) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.toLowerCase());
  }
  return isValidIranMobile(value);
}

export function lookupRole(identifier: string): UserRole {
  return findAuthUser(identifier)?.role ?? "client";
}

export function findAuthUser(identifier: string): AuthUser | undefined {
  const value = normalizeIdentifier(identifier);
  return AUTH_USERS.find(
    (u) => u.phone === value || (u.email ? u.email.toLowerCase() === value : false),
  );
}

export function resolveUser(identifier: string): AuthUser {
  const existing = findAuthUser(identifier);
  if (existing) return existing;
  const value = normalizeIdentifier(identifier);
  const isEmail = value.includes("@");
  return {
    id: `client-${value}`,
    phone: isEmail ? "09000000000" : value,
    email: isEmail ? value : undefined,
    name: "کاربر مهمان",
    role: "client",
  };
}

export function verifyCredentials(identifier: string, secret: string): AuthUser | null {
  const user = resolveUser(identifier);
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
    onboardingComplete: user.role !== "client",
  };
}

export function needsClientOnboarding(session: AuthSession | null | undefined): boolean {
  return Boolean(session && session.role === "client" && !session.onboardingComplete);
}

export function postAuthPath(session: AuthSession): string {
  if (needsClientOnboarding(session)) return "/client/onboarding";
  return ROLE_HOME[session.role];
}

export function completeClientOnboarding(
  session: AuthSession,
  profile: ClientProfile,
): AuthSession {
  return {
    ...session,
    name: profile.fullName.trim() || session.name,
    onboardingComplete: true,
    clientProfile: profile,
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

export function displayNameForSession(session: AuthSession): string {
  if (session.clientProfile?.fullName) return session.clientProfile.fullName;
  if (session.name && session.name !== "Guest User" && session.name !== "کاربر مهمان") {
    return session.name;
  }
  return ROLE_LABELS[session.role];
}
