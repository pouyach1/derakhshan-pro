/**
 * Logical schema: user/system notifications.
 * Phase A: documented only. Audit trails currently use activity.
 */

export type NotificationChannel = "in_app" | "email" | "sms";
export type NotificationStatus = "pending" | "sent" | "read" | "failed";

export type NotificationRecord = {
  id: string;
  userId: string | null;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  readAt: string | null;
};
