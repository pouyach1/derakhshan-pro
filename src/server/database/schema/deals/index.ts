/**
 * Logical schema: closed deals / transactions.
 * Public marketing cards are served from `/api/deals` (closed deals + property join).
 */

export type DealStatus = "pending" | "closed" | "canceled";
export type DealType = "sale" | "rent";

export type DealRecord = {
  id: string;
  propertyId: string | null;
  title: string;
  dealType: DealType;
  status: DealStatus;
  price: number;
  currency: string;
  buyerName: string | null;
  sellerName: string | null;
  agentId: string | null;
  closedAt: string | null;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
