/**
 * Logical schema: CRM clients assigned to agents.
 */

export type ClientUrgency = "low" | "medium" | "high";
export type ClientIntent = "buy" | "rent" | "invest";

export type ClientNote = {
  id?: string;
  text: string;
  at?: string;
};

export type ClientRecord = {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  email: string | null;
  preferredNeighborhood: string;
  budgetMin: number;
  budgetMax: number;
  urgency: ClientUrgency;
  intent: ClientIntent;
  notes: ClientNote[];
  createdAt: string;
  updatedAt: string;
};
