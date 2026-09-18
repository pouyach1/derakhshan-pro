/**
 * Logical schema: agencies (multi-tenant root).
 * Phase A: documented only — not persisted in agency.json yet.
 */

export type AgencyStatus = "active" | "suspended" | "archived";

export type AgencyRecord = {
  id: string;
  /** Public slug / brand key for white-label installs */
  slug: string;
  name: string;
  nameFa: string;
  email: string | null;
  phone: string | null;
  addressLine1: string | null;
  city: string | null;
  region: string | null;
  website: string | null;
  logoUrl: string | null;
  status: AgencyStatus;
  createdAt: string;
  updatedAt: string;
};
