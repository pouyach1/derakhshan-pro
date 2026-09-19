"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, Reorder, motion, useReducedMotion } from "framer-motion";
import { GripVertical, Phone, Sparkles, UserRoundPlus } from "lucide-react";
import { api } from "@/lib/api";
import { formatToman } from "@/lib/money";
import { siteConfig } from "@/config/siteConfig";
import { cn } from "@/lib/utils";
import type { ClientRecord } from "@/server/db/store";

type Urgency = ClientRecord["urgency"];

const COLUMNS: Array<{
  id: Urgency;
  label: string;
  hint: string;
  accent: string;
  soft: string;
  ring: string;
}> = [
  {
    id: "high",
    label: "فوری",
    hint: "اولویت بالا برای تماس امروز",
    accent: "text-rose-700",
    soft: "bg-rose-50",
    ring: "ring-rose-200/80",
  },
  {
    id: "medium",
    label: "متوسط",
    hint: "پیگیری این هفته",
    accent: "text-amber-700",
    soft: "bg-amber-50",
    ring: "ring-amber-200/80",
  },
  {
    id: "low",
    label: "عادی",
    hint: "نوبت‌بندی آرام",
    accent: "text-sky-700",
    soft: "bg-sky-50",
    ring: "ring-sky-200/80",
  },
];

const ORDER_KEY = "admin-clients-card-order";

export default function AdminClientsPage() {
  const reduceMotion = useReducedMotion();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const columnRefs = useRef<Record<Urgency, HTMLElement | null>>({
    high: null,
    medium: null,
    low: null,
  });
  const [draft, setDraft] = useState({
    name: "",
    phone: "",
    preferredNeighborhood: siteConfig.contact.address.city as string,
    urgency: "medium" as Urgency,
    agentId: "",
    note: "",
  });

  async function load() {
    const [clientsRes, agentsRes] = await Promise.all([
      api<{ items: ClientRecord[] }>("/api/clients"),
      api<{ items: Array<{ id: string; name: string }> }>("/api/agents"),
    ]);
    if (!clientsRes.ok) {
      setError(clientsRes.error.message);
      return;
    }
    const items = clientsRes.data.items;
    setClients(items);
    setOrder((prev) => {
      const saved = readSavedOrder();
      const merged = [...saved.filter((id) => items.some((c) => c.id === id))];
      for (const item of items) {
        if (!merged.includes(item.id)) merged.push(item.id);
      }
      return merged.length ? merged : prev;
    });
    if (agentsRes.ok) {
      setAgents(agentsRes.data.items);
      setDraft((d) => ({ ...d, agentId: d.agentId || agentsRes.data.items[0]?.id || "" }));
    }
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (order.length) writeSavedOrder(order);
  }, [order]);

  const byColumn = useMemo(() => {
    const sorted = [...clients].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
    return {
      high: sorted.filter((c) => c.urgency === "high"),
      medium: sorted.filter((c) => c.urgency === "medium"),
      low: sorted.filter((c) => c.urgency === "low"),
    };
  }, [clients, order]);

  async function createClient() {
    if (!draft.name.trim() || !draft.phone.trim()) {
      setError("نام و موبایل مشتری الزامی است");
      return;
    }
    setSaving(true);
    const res = await api("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        preferredNeighborhood: draft.preferredNeighborhood,
        urgency: draft.urgency,
        intent: "buy",
        budgetMin: 0,
        budgetMax: 0,
        agentId: draft.agentId || undefined,
        notes: draft.note.trim() ? [{ text: draft.note.trim() }] : [],
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft((d) => ({ ...d, name: "", phone: "", note: "" }));
    await load();
  }

  async function setUrgency(id: string, urgency: Urgency) {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, urgency } : c)));
    const res = await api(`/api/clients/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ urgency }),
    });
    if (!res.ok) void load();
  }

  function reorderColumn(urgency: Urgency, nextItems: ClientRecord[]) {
    const otherIds = order.filter((id) => {
      const client = clients.find((c) => c.id === id);
      return client && client.urgency !== urgency;
    });
    setOrder([...otherIds, ...nextItems.map((c) => c.id)]);
  }

  function onCardDragEnd(clientId: string, point: { x: number; y: number }) {
    setDraggingId(null);
    for (const col of COLUMNS) {
      const el = columnRefs.current[col.id];
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom) {
        const client = clients.find((c) => c.id === clientId);
        if (client && client.urgency !== col.id) void setUrgency(clientId, col.id);
        break;
      }
    }
  }

  return (
    <div className="space-y-5">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.85rem] bg-admin-card p-5 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.35)] ring-1 ring-slate-200/70 sm:p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(14,165,233,0.12),transparent_45%)]"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-admin-sky">
              <Sparkles className="h-3.5 w-3.5" />
              CRM مشتریان
            </p>
            <h1 className="mt-2 font-vazirmatn text-2xl font-bold text-admin-navy">کارت‌های موکلان</h1>
            <p className="mt-1 max-w-xl text-sm leading-7 text-slate-500">
              کارت‌ها را بکشید و بین ستون‌های اولویت جابه‌جا کنید. ترتیب داخل هر ستون هم قابل تنظیم است.
            </p>
          </div>
          <p className="rounded-full bg-admin-soft px-3 py-1.5 text-xs font-medium text-admin-navy">
            {clients.length.toLocaleString("fa-IR")} مشتری فعال
          </p>
        </div>

        <div className="relative mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <input className={inputClass} placeholder="نام" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} />
          <input className={inputClass} placeholder="موبایل" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
          <input className={inputClass} placeholder="محله ترجیحی" value={draft.preferredNeighborhood} onChange={(e) => setDraft((d) => ({ ...d, preferredNeighborhood: e.target.value }))} />
          <select className={inputClass} value={draft.urgency} onChange={(e) => setDraft((d) => ({ ...d, urgency: e.target.value as Urgency }))}>
            <option value="low">عادی</option>
            <option value="medium">متوسط</option>
            <option value="high">فوری</option>
          </select>
          <select className={inputClass} value={draft.agentId} onChange={(e) => setDraft((d) => ({ ...d, agentId: e.target.value }))}>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          <motion.button
            type="button"
            disabled={saving}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => void createClient()}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-admin-sky text-sm font-semibold text-white shadow-[0_14px_36px_-18px_rgba(14,165,233,0.9)] disabled:opacity-60"
          >
            <UserRoundPlus className="h-4 w-4" />
            {saving ? "..." : "ثبت مشتری"}
          </motion.button>
        </div>
      </motion.section>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="grid gap-4 xl:grid-cols-3">
        {COLUMNS.map((column) => (
          <motion.section
            key={column.id}
            ref={(node) => {
              columnRefs.current[column.id] = node;
            }}
            layout
            className={cn(
              "min-h-[28rem] rounded-[1.75rem] p-3 ring-1 sm:p-4",
              column.soft,
              column.ring,
              draggingId ? "ring-2" : "",
            )}
          >
            <div className="mb-3 flex items-center justify-between gap-2 px-1">
              <div>
                <h2 className={cn("font-vazirmatn text-sm font-bold", column.accent)}>{column.label}</h2>
                <p className="mt-0.5 text-[11px] text-slate-500">{column.hint}</p>
              </div>
              <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-admin-navy shadow-sm">
                {byColumn[column.id].length.toLocaleString("fa-IR")}
              </span>
            </div>

            <Reorder.Group
              axis="y"
              values={byColumn[column.id]}
              onReorder={(items) => reorderColumn(column.id, items)}
              className="flex min-h-[22rem] flex-col gap-3"
            >
              <AnimatePresence initial={false}>
                {byColumn[column.id].map((client) => (
                  <Reorder.Item
                    key={client.id}
                    value={client}
                    id={client.id}
                    drag
                    layout
                    initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    whileDrag={{ scale: 1.04, boxShadow: "0 24px 50px -28px rgba(11,58,92,0.45)", zIndex: 20 }}
                    onDragStart={() => setDraggingId(client.id)}
                    onDragEnd={(_, info) => onCardDragEnd(client.id, info.point)}
                    className="cursor-grab rounded-[1.35rem] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(11,58,92,0.4)] ring-1 ring-slate-200/80 active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-admin-soft text-admin-navy">
                        <GripVertical className="h-4 w-4 opacity-60" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate font-vazirmatn text-sm font-bold text-admin-navy">{client.name}</h3>
                            <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500" dir="ltr">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </p>
                          </div>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", column.soft, column.accent)}>
                            {column.label}
                          </span>
                        </div>
                        <p className="mt-3 text-xs leading-6 text-slate-600">
                          محله: {client.preferredNeighborhood || "—"}
                        </p>
                        <p className="text-xs leading-6 text-slate-600">
                          بودجه: {formatToman(client.budgetMin)} تا {formatToman(client.budgetMax)}
                        </p>
                        <p className="mt-2 text-[11px] text-slate-400">
                          یادداشت‌ها: {client.notes.length.toLocaleString("fa-IR")}
                        </p>
                      </div>
                    </div>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
              {byColumn[column.id].length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-[1.25rem] border border-dashed border-slate-300/80 bg-white/40 px-4 py-10 text-center text-xs text-slate-400">
                  کارت را اینجا رها کنید
                </div>
              ) : null}
            </Reorder.Group>
          </motion.section>
        ))}
      </div>
    </div>
  );
}

function readSavedOrder(): string[] {
  try {
    const raw = localStorage.getItem(ORDER_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSavedOrder(order: string[]) {
  try {
    localStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* ignore */
  }
}

const inputClass =
  "h-11 w-full rounded-2xl bg-white px-4 text-sm text-admin-navy outline-none ring-1 ring-slate-200/80 transition focus:ring-admin-sky/50";
