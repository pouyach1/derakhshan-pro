import type { AuthSession } from "@/lib/auth";
import { ApiError } from "@/server/http/response";
import { ensureBootstrapped } from "@/server/db/bootstrap";
import {
  getStore,
  newId,
  nowIso,
  saveStore,
  type ChatMessageRecord,
  type ChatThreadKind,
  type ChatThreadRecord,
} from "@/server/db/store";

function threads() {
  const store = getStore();
  if (!store.chatThreads) store.chatThreads = [];
  return store.chatThreads;
}

function messages() {
  const store = getStore();
  if (!store.chatMessages) store.chatMessages = [];
  return store.chatMessages;
}

function previewOf(body: string) {
  const trimmed = body.trim().replace(/\s+/g, " ");
  return trimmed.length > 80 ? `${trimmed.slice(0, 80)}…` : trimmed;
}

function assertCanAccessThread(thread: ChatThreadRecord, session: AuthSession) {
  if (session.role === "admin") return;
  if (thread.ownerUserId === session.id) return;
  throw new ApiError(403, "FORBIDDEN", "دسترسی به این گفتگو مجاز نیست");
}

function defaultTitle(kind: ChatThreadKind, ownerName: string) {
  if (kind === "support") return `پشتیبانی · ${ownerName}`;
  return `میز ادمین · ${ownerName}`;
}

export async function listChatThreads(
  session: AuthSession,
  kind?: ChatThreadKind,
) {
  await ensureBootstrapped();
  let rows = [...threads()];
  if (kind) rows = rows.filter((t) => t.kind === kind);

  if (session.role === "admin") {
    // Admins see all threads of the requested kind (or both).
  } else if (session.role === "agent") {
    rows = rows.filter(
      (t) => t.kind === "admin" && t.ownerUserId === session.id,
    );
  } else if (session.role === "client") {
    rows = rows.filter(
      (t) => t.kind === "support" && t.ownerUserId === session.id,
    );
  } else {
    rows = [];
  }

  return rows.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
}

export async function ensureOwnThread(
  session: AuthSession,
  kind: ChatThreadKind,
): Promise<ChatThreadRecord> {
  await ensureBootstrapped();

  if (kind === "support" && session.role !== "client" && session.role !== "admin") {
    throw new ApiError(403, "FORBIDDEN", "فقط مشتریان می‌توانند چت پشتیبانی باز کنند");
  }
  if (kind === "admin" && session.role !== "agent" && session.role !== "admin") {
    throw new ApiError(403, "FORBIDDEN", "فقط مشاوران می‌توانند چت ادمین باز کنند");
  }

  // Admin opening a personal thread is not the inbox use-case — they browse existing ones.
  if (session.role === "admin") {
    throw new ApiError(400, "BAD_REQUEST", "ادمین از صندوق گفتگوها استفاده می‌کند");
  }

  const existing = threads().find(
    (t) => t.kind === kind && t.ownerUserId === session.id,
  );
  if (existing) return existing;

  const stamp = nowIso();
  const ownerRole = session.role === "agent" ? "agent" : "client";
  const row: ChatThreadRecord = {
    id: newId(),
    kind,
    title: defaultTitle(kind, session.name || "کاربر"),
    ownerUserId: session.id,
    ownerRole,
    ownerName: session.name || "کاربر",
    lastMessageAt: stamp,
    lastMessagePreview: "گفتگو آغاز شد",
    unreadForAdmin: 0,
    unreadForOwner: 0,
    createdAt: stamp,
    updatedAt: stamp,
  };
  threads().unshift(row);
  saveStore();
  return row;
}

export async function listThreadMessages(threadId: string, session: AuthSession) {
  await ensureBootstrapped();
  const thread = threads().find((t) => t.id === threadId);
  if (!thread) throw new ApiError(404, "NOT_FOUND", "گفتگو یافت نشد");
  assertCanAccessThread(thread, session);

  if (session.role === "admin") {
    thread.unreadForAdmin = 0;
  } else {
    thread.unreadForOwner = 0;
  }
  thread.updatedAt = nowIso();
  saveStore();

  return messages()
    .filter((m) => m.threadId === threadId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function postThreadMessage(
  threadId: string,
  body: string,
  session: AuthSession,
): Promise<{ thread: ChatThreadRecord; message: ChatMessageRecord }> {
  await ensureBootstrapped();
  const text = body.trim();
  if (text.length < 1) {
    throw new ApiError(400, "VALIDATION", "متن پیام خالی است");
  }
  if (text.length > 4000) {
    throw new ApiError(400, "VALIDATION", "پیام بیش از حد طولانی است");
  }

  const thread = threads().find((t) => t.id === threadId);
  if (!thread) throw new ApiError(404, "NOT_FOUND", "گفتگو یافت نشد");
  assertCanAccessThread(thread, session);

  const stamp = nowIso();
  const senderRole =
    session.role === "admin"
      ? "admin"
      : session.role === "agent"
        ? "agent"
        : "client";

  const message: ChatMessageRecord = {
    id: newId(),
    threadId,
    senderId: session.id,
    senderRole,
    senderName: session.name || "کاربر",
    body: text,
    createdAt: stamp,
  };
  messages().push(message);

  thread.lastMessageAt = stamp;
  thread.lastMessagePreview = previewOf(text);
  thread.updatedAt = stamp;
  if (session.role === "admin") {
    thread.unreadForOwner += 1;
    thread.unreadForAdmin = 0;
  } else {
    thread.unreadForAdmin += 1;
    thread.unreadForOwner = 0;
  }
  saveStore();
  return { thread, message };
}

export async function getThread(threadId: string, session: AuthSession) {
  await ensureBootstrapped();
  const thread = threads().find((t) => t.id === threadId);
  if (!thread) throw new ApiError(404, "NOT_FOUND", "گفتگو یافت نشد");
  assertCanAccessThread(thread, session);
  return thread;
}
