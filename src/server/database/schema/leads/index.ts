/**
 * Logical schema: inbound leads / inquiries.
 */

export type LeadStatus =
  | "new"
  | "contacted"
  | "viewing"
  | "negotiation"
  | "closed"
  | "lost";

export type LeadRecord = {
  id: string;
  clientName: string;
  phone: string;
  email: string | null;
  propertyId: string | null;
  propertyTitle: string;
  source: string;
  status: LeadStatus;
  notes: string;
  assignedAgentId: string | null;
  createdAt: string;
  updatedAt: string;
};
