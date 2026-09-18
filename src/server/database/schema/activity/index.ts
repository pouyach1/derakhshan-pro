/**
 * Logical schema: activity / audit log.
 */

export type ActivityRecord = {
  id: string;
  actorId: string | null;
  actorRole: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  detail: Record<string, unknown>;
  ip: string | null;
  requestId: string | null;
  createdAt: string;
};
