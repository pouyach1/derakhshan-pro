/**
 * Logical schema: property tour / viewing appointments.
 */

export type TourStatus = "upcoming" | "completed" | "canceled";

export type TourRecord = {
  id: string;
  agentId: string;
  propertyId: string;
  clientName: string;
  clientPhone: string | null;
  scheduledAt: string;
  dayLabel: string;
  timeLabel: string;
  status: TourStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
};
