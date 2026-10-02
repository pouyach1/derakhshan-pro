/**
 * In-app chat threads for support (client ↔ office) and admin desk (agent ↔ admins).
 */

export type ChatThreadKind = "support" | "admin";

export type ChatParticipantRole = "admin" | "agent" | "client";

export type ChatMessageRecord = {
  id: string;
  threadId: string;
  senderId: string;
  senderRole: ChatParticipantRole;
  senderName: string;
  body: string;
  createdAt: string;
};

export type ChatThreadRecord = {
  id: string;
  kind: ChatThreadKind;
  /** Display title in inbox lists */
  title: string;
  /** Owning user (client for support, agent for admin desk) */
  ownerUserId: string;
  ownerRole: ChatParticipantRole;
  ownerName: string;
  lastMessageAt: string;
  lastMessagePreview: string;
  unreadForAdmin: number;
  unreadForOwner: number;
  createdAt: string;
  updatedAt: string;
};
