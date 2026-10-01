"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, SendHorizonal, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { ChatMessageRecord, ChatThreadKind, ChatThreadRecord } from "@/server/db/store";

type ChatDeskProps = {
  kind: ChatThreadKind;
  /** When true, opens/ensures the caller's own thread (client/agent). */
  ensureOwn?: boolean;
  title: string;
  subtitle: string;
  emptyHint: string;
  composerPlaceholder?: string;
};

export default function ChatDesk({
  kind,
  ensureOwn = false,
  title,
  subtitle,
  emptyHint,
  composerPlaceholder = "پیام خود را بنویسید…",
}: ChatDeskProps) {
  const reduceMotion = useReducedMotion();
  const [threads, setThreads] = useState<ChatThreadRecord[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageRecord[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const pollRef = useRef<number | null>(null);

  async function loadThreads(preferId?: string | null) {
    const res = await api<{ items: ChatThreadRecord[] }>(
      `/api/chat/threads?kind=${kind}`,
    );
    if (!res.ok) {
      setError(res.error.message);
      setLoading(false);
      return;
    }
    let items = res.data.items;

    if (ensureOwn && items.length === 0) {
      const created = await api<ChatThreadRecord>("/api/chat/threads", {
        method: "POST",
        body: JSON.stringify({ kind }),
      });
      if (created.ok) {
        items = [created.data];
      } else {
        setError(created.error.message);
        setLoading(false);
        return;
      }
    }

    setThreads(items);
    setActiveId((current) => {
      if (preferId && items.some((t) => t.id === preferId)) return preferId;
      if (current && items.some((t) => t.id === current)) return current;
      return items[0]?.id ?? null;
    });
    setError("");
    setLoading(false);
  }

  async function loadMessages(threadId: string, soft = false) {
    const res = await api<{ items: ChatMessageRecord[] }>(
      `/api/chat/threads/${threadId}/messages`,
    );
    if (!res.ok) {
      if (!soft) setError(res.error.message);
      return;
    }
    setMessages(res.data.items);
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? { ...t, unreadForAdmin: 0, unreadForOwner: 0 }
          : t,
      ),
    );
  }

  useEffect(() => {
    void loadThreads();
  }, [kind, ensureOwn]);

  useEffect(() => {
    if (!activeId) {
      setMessages([]);
      return;
    }
    void loadMessages(activeId);
  }, [activeId]);

  useEffect(() => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(() => {
      void loadThreads(activeId);
      if (activeId) void loadMessages(activeId, true);
    }, 4000);
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, [activeId, kind]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages.length, reduceMotion]);

  async function sendMessage() {
    if (!activeId || !draft.trim() || sending) return;
    setSending(true);
    const res = await api<{ thread: ChatThreadRecord; message: ChatMessageRecord }>(
      `/api/chat/threads/${activeId}/messages`,
      {
        method: "POST",
        body: JSON.stringify({ body: draft.trim() }),
      },
    );
    setSending(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft("");
    setMessages((prev) => [...prev, res.data.message]);
    setThreads((prev) => {
      const next = prev.map((t) => (t.id === activeId ? res.data.thread : t));
      return next.sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt));
    });
  }

  const active = threads.find((t) => t.id === activeId) ?? null;
  const unreadKey = ensureOwn ? "unreadForOwner" : "unreadForAdmin";

  return (
    <div className="space-y-4">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.85rem] bg-admin-card p-5 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.35)] ring-1 ring-slate-200/70 sm:p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.12),transparent_50%)]"
        />
        <div className="relative">
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-admin-sky">
            <Sparkles className="h-3.5 w-3.5" />
            گفتگوی آنلاین
          </p>
          <h1 className="mt-2 font-vazirmatn text-2xl font-bold text-admin-navy">{title}</h1>
          <p className="mt-1 max-w-2xl text-sm leading-7 text-slate-500">{subtitle}</p>
        </div>
      </motion.section>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[1.75rem] bg-admin-card p-3 shadow-sm ring-1 ring-slate-200/70 sm:p-4">
          <p className="mb-3 px-1 text-xs font-semibold text-admin-navy">گفتگوها</p>
          {loading ? (
            <p className="rounded-2xl bg-admin-soft px-3 py-8 text-center text-xs text-slate-400">
              در حال بارگذاری…
            </p>
          ) : threads.length === 0 ? (
            <p className="rounded-2xl bg-admin-soft px-3 py-8 text-center text-xs text-slate-400">
              {emptyHint}
            </p>
          ) : (
            <ul className="space-y-2">
              {threads.map((thread) => {
                const activeThread = thread.id === activeId;
                const unread = thread[unreadKey];
                return (
                  <li key={thread.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(thread.id)}
                      className={cn(
                        "w-full rounded-2xl px-3 py-3 text-start transition",
                        activeThread
                          ? "bg-admin-sky text-white shadow-lg shadow-sky-500/20"
                          : "bg-admin-soft/80 text-admin-navy hover:bg-admin-soft",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-semibold">{thread.ownerName}</p>
                        {unread > 0 ? (
                          <span
                            className={cn(
                              "rounded-full px-2 py-0.5 text-[10px] font-bold",
                              activeThread ? "bg-white text-admin-sky" : "bg-rose-500 text-white",
                            )}
                          >
                            {unread.toLocaleString("fa-IR")}
                          </span>
                        ) : null}
                      </div>
                      <p
                        className={cn(
                          "mt-1 line-clamp-2 text-xs leading-5",
                          activeThread ? "text-white/85" : "text-slate-500",
                        )}
                      >
                        {thread.lastMessagePreview || "—"}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="flex min-h-[28rem] flex-col rounded-[1.75rem] bg-admin-card shadow-sm ring-1 ring-slate-200/70">
          {active ? (
            <>
              <header className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-admin-soft text-admin-sky">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-vazirmatn text-sm font-bold text-admin-navy">
                    {active.title}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    آخرین پیام: {formatFaDate(active.lastMessageAt)}
                  </p>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-5">
                <AnimatePresence initial={false}>
                  {messages.map((msg) => {
                    const mine =
                      ensureOwn
                        ? msg.senderRole !== "admin"
                        : msg.senderRole === "admin";
                    return (
                      <motion.div
                        key={msg.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={cn("flex", mine ? "justify-start" : "justify-end")}
                      >
                        <div
                          className={cn(
                            "max-w-[85%] rounded-[1.25rem] px-4 py-3 text-sm leading-7 shadow-sm",
                            mine
                              ? "bg-admin-sky text-white"
                              : "bg-slate-100 text-admin-navy",
                          )}
                        >
                          <p className={cn("mb-1 text-[10px] font-semibold", mine ? "text-white/75" : "text-slate-400")}>
                            {msg.senderName}
                            {" · "}
                            {roleLabel(msg.senderRole)}
                          </p>
                          <p className="whitespace-pre-wrap">{msg.body}</p>
                          <p className={cn("mt-1 text-[10px]", mine ? "text-white/60" : "text-slate-400")} dir="ltr">
                            {formatFaTime(msg.createdAt)}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {messages.length === 0 ? (
                  <p className="py-16 text-center text-xs text-slate-400">
                    هنوز پیامی نیست — اولین پیام را بفرستید.
                  </p>
                ) : null}
                <div ref={bottomRef} />
              </div>

              <footer className="border-t border-slate-100 p-3 sm:p-4">
                <form
                  className="flex items-end gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void sendMessage();
                  }}
                >
                  <textarea
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    rows={2}
                    placeholder={composerPlaceholder}
                    className="min-h-[2.75rem] flex-1 resize-none rounded-2xl bg-admin-soft px-4 py-3 text-sm text-admin-navy outline-none ring-1 ring-transparent transition focus:ring-admin-sky/40"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        void sendMessage();
                      }
                    }}
                  />
                  <motion.button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex h-11 items-center gap-2 rounded-full bg-admin-navy px-4 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    <SendHorizonal className="h-4 w-4" />
                    ارسال
                  </motion.button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-20 text-center">
              <MessageCircle className="h-10 w-10 text-slate-300" />
              <p className="text-sm text-slate-400">{emptyHint}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function roleLabel(role: ChatMessageRecord["senderRole"]) {
  if (role === "admin") return "ادمین";
  if (role === "agent") return "مشاور";
  return "مشتری";
}

function formatFaDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function formatFaTime(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
}
