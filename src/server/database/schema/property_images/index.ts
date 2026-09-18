/**
 * Logical schema: property_images (1 property → many images).
 * Phase A: documented only. Live data still uses PropertyRecord.gallery[].
 */

export type PropertyImageRecord = {
  id: string;
  propertyId: string;
  url: string;
  alt: string | null;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
};
