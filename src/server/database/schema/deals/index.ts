/**
 * Logical schema: closed deals / transactions.
 * Phase A: documented only. Marketing “done deals” still live in siteConfig.
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
