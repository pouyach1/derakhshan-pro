/**
 * Logical schema: users (admin / agent / client accounts).
 * Matches the live JSON store shape used by Agency API.
 */

import type { ClientProfile, UserRole } from "@/lib/auth";

export type { UserRole, ClientProfile };

export type UserRecord = {
  id: string;
  phone: string;
  email: string | null;
  name: string;
  role: UserRole;
  /** bcrypt hash — never store raw passwords here */
  passwordHash: string | null;
  agentId: string | null;
  onboardingComplete: boolean;
  clientProfile: ClientProfile | null;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
