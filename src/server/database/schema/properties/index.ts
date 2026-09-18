/**
 * Logical schema: properties (listings).
 * Live JSON currently embeds gallery: string[].
 * Normalized property_images is ready for Phase B — not applied yet.
 */

export type PropertyStatus = "draft" | "published" | "negotiation" | "sold" | "archived";
export type ListingType = "sale" | "rent";

export type PropertyRecord = {
  id: string;
  code: string;
  title: string;
  location: string;
  neighborhood: string;
  description: string;
  price: number;
  currency: string;
  listingType: ListingType;
  category: string;
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  features: string[];
  /** Cover image path/URL (legacy single field) */
  imageUrl: string;
  /**
   * Embedded gallery paths (current persistence).
   * Phase B may move these into property_images without changing API contracts.
   */
  gallery: string[];
  agentId: string | null;
  views: number;
  isFeatured: boolean;
  softDeleted: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
};
