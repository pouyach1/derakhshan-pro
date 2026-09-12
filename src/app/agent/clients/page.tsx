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
  getAgentClients,
  matchPropertiesForClient,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const URGENCY_TONE: Record<ClientUrgency, string> = {
  low: "bg-slate-100 text-slate-600 ring-slate-200",
  medium: "bg-amber-50 text-amber-800 ring-amber-200",
  high: "bg-rose-50 text-rose-700 ring-rose-200",
};

function nowLabel() {
  return new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());
}

export default function AgentClientsPage() {
  const agentId = useAgentScope();
  const [clients, setClients] = useState(() => getAgentClients(agentId));
  const [active, setActive] = useState<AgentClient | null>(null);
  const [note, setNote] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    budgetLabel: "",
    preferredNeighborhood: "",
    urgency: "medium" as ClientUrgency,
  });

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("add") === "1") {
      setAddOpen(true);
    }
  }, []);

  const matchCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const client of clients) {
      map.set(client.id, matchPropertiesForClient(agentId, client).length);
    }
    return map;
  }, [agentId, clients]);

  function addNote() {
    if (!active || !note.trim()) return;
    const entry = { id: `n-${Date.now()}`, at: nowLabel(), text: note.trim() };
    setClients((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, notes: [entry, ...c.notes] } : c,
      ),
    );
    setActive((prev) => (prev ? { ...prev, notes: [entry, ...prev.notes] } : prev));
    setNote("");
  }

  function addClient() {
    const next: AgentClient = {
      id: `ac-${Date.now()}`,
      agentId,
      name: draft.name || "مشتری جدید",
      phone: draft.phone || "—",
      budgetMin: 10_000_000_000,
      budgetMax: 20_000_000_000,
      budgetLabel: draft.budgetLabel || "۱۰–۲۰ میلیارد",
      preferredNeighborhood: draft.preferredNeighborhood || "تهران",
      urgency: draft.urgency,
      notes: [],
    };
    setClients((prev) => [next, ...prev]);
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
          <p className="mt-1 text-sm text-slate-500">
            فقط لیدها و مشتریانی که به شما اختصاص داده شده‌اند
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20"
        >
          <Plus className="h-4 w-4" />
          Add Client
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {clients.map((client, index) => {
          const matches = matchCounts.get(client.id) ?? 0;
          return (
            <motion.article
              key={client.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.32, ease }}
              whileHover={{ scale: 1.02 }}
              className="rounded-[1.5rem] border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">{client.name}</h2>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <Phone className="h-3.5 w-3.5" />
                    {client.phone}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                    URGENCY_TONE[client.urgency],
                  )}
                >
                  {URGENCY_LABEL[client.urgency]}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-slate-600">
                <p className="inline-flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-emerald-600" />
                  بودجه: {client.budgetLabel}
                </p>
                <p className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  محله ترجیحی: {client.preferredNeighborhood}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                  <Sparkles className="h-3.5 w-3.5" />
                  {matches.toLocaleString("fa-IR")} Matching Properties Found
                </span>
                <button
                  type="button"
                  onClick={() => setActive(client)}
                  className="text-sm font-medium text-slate-700 underline-offset-2 hover:underline"
                >
                  تایم‌لاین و تماس
                </button>
              </div>
            </motion.article>
          );
        })}
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
                <div>
                  <h3 className="font-semibold text-slate-900">{active.name}</h3>
                  <p className="text-xs text-slate-500">تایم‌لاین و لاگ تماس</p>
                </div>
                <button type="button" onClick={() => setActive(null)} className="rounded-full p-1.5 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {active.notes.length === 0 && (
                  <p className="text-sm text-slate-400">هنوز یادداشتی ثبت نشده است.</p>
                )}
                {active.notes.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-[#F1EFEA]/80 px-4 py-3 ring-1 ring-slate-200/50"
                  >
                    <p className="text-[11px] text-slate-400">{item.at}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-100 p-4">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="بازدید از دپارتمان درخشان انجام شد — خریدار از نقشه راضی بود ولی تخفیف می‌خواهد"
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-[#F1EFEA]/50 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
                <button
                  type="button"
                  onClick={addNote}
                  className="mt-3 w-full rounded-full bg-emerald-600 py-2.5 text-sm font-medium text-white"
                >
                  افزودن یادداشت
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick add client */}
      <AnimatePresence>
        {addOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAddOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md space-y-3 rounded-[1.75rem] border border-slate-200/60 bg-white/95 p-5 shadow-xl backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">افزودن مشتری</h3>
                <button type="button" onClick={() => setAddOpen(false)} className="rounded-full p-1.5 hover:bg-slate-100">
                  <X className="h-4 w-4" />
                </button>
              </div>
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
                    className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
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
                  className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm"
                >
                  <option value="low">عادی</option>
                  <option value="medium">متوسط</option>
                  <option value="high">فوری</option>
                </select>
              </label>
              <button
                type="button"
                onClick={addClient}
                className="w-full rounded-full bg-emerald-600 py-2.5 text-sm font-medium text-white"
              >
                ذخیره مشتری
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
