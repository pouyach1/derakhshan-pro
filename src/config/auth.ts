import { siteConfig } from "@/config/siteConfig";
export type UserRole = "admin" | "agent" | "client";

export type AuthUser = {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: UserRole;
  agentId?: string;
};

/**
 * Public role hints for the login UI only.
 * Passwords/OTP live in the server store + env — never in client bundles.
 */
export const AUTH_USERS: AuthUser[] = [
  {
    id: "admin-1",
    phone: "09121111111",
    email: siteConfig.panels.demoAdminEmail,
    name: "مدیر سیستم",
    role: "admin",
  },
  {
    id: "agent-1",
    phone: "09122222222",
    email: siteConfig.panels.demoAgentEmail,
    name: "آرش شایگان",
    role: "agent",
    agentId: "a1",
  },
];

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "مدیر",
  agent: "مشاور",
  client: "مشتری",
};

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  agent: "/agent/dashboard",
  client: "/client/dashboard",
};
