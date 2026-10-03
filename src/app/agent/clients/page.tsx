"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Plus,
  Sparkles,
  Wallet,
  X,
} from "lucide-react";
import {
  URGENCY_LABEL,
  type AgentClient,
  type ClientUrgency,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { formatNoteAt, sortNotesNewestFirst } from "@/lib/client-notes";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/siteConfig";
import { api } from "@/lib/api";
import { mapClientToAgent } from "@/lib/mappers";
import type { ClientRecord } from "@/server/db/store";

const ease = [0.22, 1, 0.36, 1] as const;

const URGENCY_TONE: Record<ClientUrgency, string> = {
  low: "bg-slate-100 text-slate-600 ring-slate-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function AgentClientsPage() {
  const agentId = useAgentScope();
  const [clients, setClients] = useState<AgentClient[]>([]);
  const [active, setActive] = useState<AgentClient | null>(null);
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    budgetLabel: "",
    preferredNeighborhood: "",
    urgency: "medium" as ClientUrgency,
  });

  useEffect(() => {
    void (async () => {
      const res = await api<{ items: ClientRecord[] }>("/api/clients");
      if (res.ok) setClients(res.data.items.map(mapClientToAgent));
    })();
  }, [agentId]);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("add") === "1") {
      setAddOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!addOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [addOpen]);

  const matchCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const client of clients) {
      map.set(client.id, client.preferredNeighborhood ? 1 : 0);
    }
    return map;
  }, [clients]);

  const activeNotes = useMemo(
    () => (active ? sortNotesNewestFirst(active.notes) : []),
    [active],
  );

  async function addNote() {
    if (!active || !note.trim()) {
      setNoteError("متن تماس یا یادداشت را وارد کنید.");
      return;
    }
    setSavingNote(true);
    setNoteError("");
    const entry = {
      id: `n-${Date.now()}`,
      at: new Date().toISOString(),
      text: note.trim(),
    };
    const notes = [entry, ...active.notes];
    setClients((prev) => prev.map((c) => (c.id === active.id ? { ...c, notes } : c)));
    setActive((prev) => (prev ? { ...prev, notes } : prev));
    setNote("");
    const res = await api(`/api/clients/${active.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        notes: notes.map((item) => ({ id: item.id, text: item.text, at: item.at })),
      }),
    });
    setSavingNote(false);
    if (!res.ok) {
      setNoteError(res.error?.message || "ثبت یادداشت انجام نشد.");
      // reload to avoid optimistic drift
      const refresh = await api<{ items: ClientRecord[] }>("/api/clients");
      if (refresh.ok) {
        const mapped = refresh.data.items.map(mapClientToAgent);
        setClients(mapped);
        setActive(mapped.find((c) => c.id === active.id) || null);
      }
    }
  }

  async function addClient() {
    const res = await api<ClientRecord>("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name: draft.name || "مشتری جدید",
        phone: draft.phone || "09000000000",
        preferredNeighborhood: draft.preferredNeighborhood || siteConfig.contact.address.city,
        budgetMin: 10_000_000_000,
        budgetMax: 20_000_000_000,
        urgency: draft.urgency,
        intent: "buy",
      }),
    });
    if (res.ok) setClients((prev) => [mapClientToAgent(res.data), ...prev]);
    setDraft({
      name: "",
      phone: "",
      budgetLabel: "",
      preferredNeighborhood: "",
      urgency: "medium",
    });
    setAddOpen(false);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">مشتریان اختصاصی</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            فقط لیدها و مشتریانی که به شما اختصاص داده شده‌اند
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="ios-tap-target inline-flex min-h-11 items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          مشتری جدید
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {clients.map((client, index) => {
          const matches = matchCounts.get(client.id) ?? 0;
          return (
            <motion.article
              key={client.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.24), duration: 0.32, ease }}
              whileHover={{ scale: 1.01 }}
              className="rounded-[1.5rem] border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                    {client.name}
                  </h2>
                  <a
                    href={`tel:${client.phone}`}
                    className="ios-tap-target mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500"
                    dir="ltr"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </a>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                    URGENCY_TONE[client.urgency],
                  )}
                >
                  {URGENCY_LABEL[client.urgency]}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p className="inline-flex items-center gap-2">
                  <Wallet className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="truncate">بودجه: {client.budgetLabel}</span>
                </p>
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="truncate">محله ترجیحی: {client.preferredNeighborhood}</span>
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {matches.toLocaleString("fa-IR")} فایل هم‌خوان
                </span>
                <button
                  type="button"
                  onClick={() => setActive(client)}
                  className="ios-tap-target inline-flex min-h-10 items-center rounded-full bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white sm:bg-transparent sm:px-0 sm:py-0 sm:text-sm sm:font-medium sm:text-slate-700 sm:underline-offset-2 sm:hover:underline"
                >
                  تایم‌لاین و تماس
                </button>
              </div>
            </motion.article>
          );
        })}
        {clients.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white/50 px-4 py-10 text-center text-sm text-slate-500">
            هنوز مشتری اختصاصی ندارید
          </p>
        ) : null}
      </div>

      {/* Timeline / call log modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.28, ease }}
              onClick={(e) => e.stopPropagation()}
              className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-slate-200/60 bg-white/95 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">{active.name}</h3>
                  <p className="text-xs text-slate-500">تایم‌لاین و لاگ تماس</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={`tel:${active.phone}`}
                    className="ios-tap-target inline-flex h-9 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    تماس
                  </a>
                  <button type="button" onClick={() => setActive(null)} className="rounded-full p-1.5 hover:bg-slate-100">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-4">
                {activeNotes.length === 0 ? (
                  <p className="rounded-2xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                    هنوز تماس یا یادداشتی برای این مشتری ثبت نشده است.
                  </p>
                ) : (
                  <ol className="relative space-y-3 border-s-2 border-slate-200/90 ps-4 sm:ps-5">
                    {activeNotes.map((item) => {
                      const when = formatNoteAt(item.at);
                      return (
                        <li key={item.id} className="relative">
                          <span className="absolute -start-[1.35rem] top-3 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-white sm:-start-[1.45rem]" />
                          <div className="rounded-2xl bg-[#F1EFEA]/80 px-4 py-3 ring-1 ring-slate-200/50">
                            {when ? (
                              <p className="text-[11px] text-slate-400">{when}</p>
                            ) : null}
                            <p className="mt-1 break-words text-sm leading-relaxed text-slate-700">{item.text}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                )}
              </div>

              <div className="border-t border-slate-100 p-4">
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value);
                    if (noteError) setNoteError("");
                  }}
                  rows={3}
                  placeholder={`بازدید از ${siteConfig.brand.nameFa} انجام شد — خریدار از نقشه راضی بود ولی تخفیف می‌خواهد`}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-[#F1EFEA]/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                {noteError ? <p className="mt-2 text-xs text-rose-500">{noteError}</p> : null}
                <button
                  type="button"
                  disabled={savingNote}
                  onClick={() => void addNote()}
                  className="ios-tap-target mt-3 w-full rounded-full bg-emerald-600 py-3 text-sm font-medium text-white disabled:opacity-60"
                >
                  {savingNote ? "در حال ذخیره…" : "افزودن یادداشت / تماس"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick add client — mobile sheet above bottom nav; desktop centered dialog */}
      <AnimatePresence>
        {addOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/45 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="add-client-title"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.28, ease }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "flex w-full max-w-md flex-col overflow-hidden border border-slate-200/70 bg-white shadow-2xl",
                "max-h-[min(92dvh,40rem)] rounded-t-[1.75rem]",
                "sm:max-h-[min(88dvh,40rem)] sm:rounded-[1.75rem]",
              )}
            >
              <div className="shrink-0 border-b border-slate-100 px-5 pb-3 pt-3 sm:pt-4">
                <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-slate-200 sm:hidden" aria-hidden />
                <div className="flex items-center justify-between gap-3">
                  <h3 id="add-client-title" className="font-semibold text-slate-900">
                    افزودن مشتری
                  </h3>
                  <button
                    type="button"
                    onClick={() => setAddOpen(false)}
                    className="ios-tap-target inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                    aria-label="بستن"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                <div className="space-y-3">
                  {(
                    [
                      ["name", "نام"],
                      ["phone", "تلفن"],
                      ["budgetLabel", "بازه بودجه"],
                      ["preferredNeighborhood", "محله ترجیحی"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="block text-sm text-slate-600">
                      {label}
                      <input
                        value={draft[key]}
                        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15"
                        autoComplete={key === "phone" ? "tel" : key === "name" ? "name" : "off"}
                        inputMode={key === "phone" ? "tel" : undefined}
                      />
                    </label>
                  ))}
                  <label className="block text-sm text-slate-600">
                    فوریت
                    <select
                      value={draft.urgency}
                      onChange={(e) =>
                        setDraft((d) => ({ ...d, urgency: e.target.value as ClientUrgency }))
                      }
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
                    >
                      <option value="low">عادی</option>
                      <option value="medium">متوسط</option>
                      <option value="high">فوری</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="shrink-0 border-t border-slate-100 bg-white px-5 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
                <div className="flex flex-col gap-2 sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={() => void addClient()}
                    className="ios-tap-target w-full rounded-full bg-emerald-600 py-3 text-sm font-medium text-white sm:flex-1"
                  >
                    ذخیره مشتری
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddOpen(false)}
                    className="ios-tap-target w-full rounded-full bg-slate-100 py-3 text-sm font-medium text-slate-700 sm:w-auto sm:px-5"
                  >
                    انصراف
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
