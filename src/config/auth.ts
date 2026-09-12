export type UserRole = "admin" | "agent" | "client";

export type AuthUser = {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: UserRole;
  /** Demo password for admin/agent. Clients authenticate with OTP. */
  password?: string;
  agentId?: string;
};

export const AUTH_USERS: AuthUser[] = [
  {
    id: "admin-1",
    phone: "09121111111",
    email: "admin@derakhshan.pro",
    name: "مدیر سیستم",
    role: "admin",
    password: "123456",
  },
  {
    id: "agent-1",
    phone: "09122222222",
    email: "agent@derakhshan.pro",
    name: "آرش شایگان",
    role: "agent",
    password: "123456",
    agentId: "a1",
  },
];

export const DEMO_OTP = "1234";

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: "مدیر",
  agent: "مشاور",
  client: "مشتری",
};

export const ROLE_HOME: Record<UserRole, string> = {
  admin: "/admin/dashboard",
  agent: "/agent/dashboard",
  client: "/",
};
