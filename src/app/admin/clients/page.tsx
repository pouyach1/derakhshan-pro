"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import {
  Eye,
  GripVertical,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  UserRoundPlus,
  Wallet,
  X,
} from "lucide-react";
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

const INTENT_LABEL: Record<ClientRecord["intent"], string> = {
  buy: "خرید",
  rent: "اجاره",
  invest: "سرمایه‌گذاری",
};

const ORDER_KEY = "admin-clients-card-order";

function pointerFromDrag(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
  if ("clientX" in event && typeof event.clientX === "number") {
    return { x: event.clientX, y: event.clientY };
  }
  // Framer `point` is page coordinates — convert to viewport for getBoundingClientRect.
  return {
    x: info.point.x - (typeof window !== "undefined" ? window.scrollX : 0),
    y: info.point.y - (typeof window !== "undefined" ? window.scrollY : 0),
  };
}

function hitColumn(
  point: { x: number; y: number },
  refs: Record<Urgency, HTMLElement | null>,
): Urgency | null {
  for (const col of COLUMNS) {
    const el = refs[col.id];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (
      point.x >= rect.left &&
      point.x <= rect.right &&
      point.y >= rect.top &&
      point.y <= rect.bottom
    ) {
      return col.id;
    }
  }
  return null;
}

function insertIndexForPoint(
  pointY: number,
  columnEl: HTMLElement | null,
  excludeId: string,
): number {
  if (!columnEl) return 0;
  const cards = [...columnEl.querySelectorAll<HTMLElement>("[data-client-card]")].filter(
    (el) => el.dataset.clientId !== excludeId,
  );
  for (let i = 0; i < cards.length; i += 1) {
    const rect = cards[i].getBoundingClientRect();
    if (pointY < rect.top + rect.height / 2) return i;
  }
  return cards.length;
}

export default function AdminClientsPage() {
  const reduceMotion = useReducedMotion();
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverColumn, setHoverColumn] = useState<Urgency | null>(null);
  const [selected, setSelected] = useState<ClientRecord | null>(null);
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

  useEffect(() => {
    if (!selected) return;
    const fresh = clients.find((c) => c.id === selected.id);
    if (fresh) setSelected(fresh);
  }, [clients, selected?.id]);

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

  function placeCard(clientId: string, target: Urgency, indexInColumn: number) {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return;

    const nextOrder: string[] = [];
    for (const col of COLUMNS) {
      const ids = byColumn[col.id].map((c) => c.id).filter((id) => id !== clientId);
      if (col.id === target) {
        ids.splice(Math.max(0, Math.min(indexInColumn, ids.length)), 0, clientId);
      }
      nextOrder.push(...ids);
    }
    setOrder(nextOrder);

    if (client.urgency !== target) {
      void setUrgency(clientId, target);
    }
  }

  function onCardDrag(
    _clientId: string,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    const point = pointerFromDrag(event, info);
    setHoverColumn(hitColumn(point, columnRefs.current));
  }

  function onCardDragEnd(
    clientId: string,
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) {
    const point = pointerFromDrag(event, info);
    const target = hitColumn(point, columnRefs.current);
    setDraggingId(null);
    setHoverColumn(null);
    if (!target) return;
    const index = insertIndexForPoint(point.y, columnRefs.current[target], clientId);
    placeCard(clientId, target, index);
  }

  const agentName = (agentId: string) =>
    agents.find((a) => a.id === agentId)?.name || "—";

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
              با دستگیره کارت را بین ستون‌ها بکشید. برای دیدن جزئیات، روی کارت یا «مشاهده» بزنید.
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
          <section
            key={column.id}
            ref={(node) => {
              columnRefs.current[column.id] = node;
            }}
            data-column={column.id}
            className={cn(
              "min-h-[28rem] rounded-[1.75rem] p-3 ring-1 transition sm:p-4",
              column.soft,
              column.ring,
              hoverColumn === column.id && draggingId ? "ring-2 ring-admin-sky/70 scale-[1.01]" : "",
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

            <div className="flex min-h-[22rem] flex-col gap-3">
              <AnimatePresence initial={false}>
                {byColumn[column.id].map((client) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    column={column}
                    reduceMotion={!!reduceMotion}
                    dragging={draggingId === client.id}
                    onDragStart={() => setDraggingId(client.id)}
                    onDrag={(event, info) => onCardDrag(client.id, event, info)}
                    onDragEnd={(event, info) => onCardDragEnd(client.id, event, info)}
                    onOpen={() => setSelected(client)}
                  />
                ))}
              </AnimatePresence>
              {byColumn[column.id].length === 0 ? (
                <div
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-[1.25rem] border border-dashed px-4 py-10 text-center text-xs",
                    hoverColumn === column.id && draggingId
                      ? "border-admin-sky bg-white/70 text-admin-navy"
                      : "border-slate-300/80 bg-white/40 text-slate-400",
                  )}
                >
                  کارت را اینجا رها کنید
                </div>
              ) : null}
            </div>
          </section>
        ))}
      </div>

      <AnimatePresence>
        {selected ? (
          <ClientDetailDrawer
            client={selected}
            agentLabel={agentName(selected.agentId)}
            urgencyLabel={COLUMNS.find((c) => c.id === selected.urgency)?.label || selected.urgency}
            onClose={() => setSelected(null)}
            onUrgency={(urgency) => {
              void setUrgency(selected.id, urgency);
            }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function ClientCard({
  client,
  column,
  reduceMotion,
  dragging,
  onDragStart,
  onDrag,
  onDragEnd,
  onOpen,
}: {
  client: ClientRecord;
  column: (typeof COLUMNS)[number];
  reduceMotion: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onOpen: () => void;
}) {
  const controls = useDragControls();

  return (
    <motion.article
      layout={!dragging}
      data-client-card
      data-client-id={client.id}
      drag
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin
      dragElastic={0.12}
      initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileDrag={{ scale: 1.04, boxShadow: "0 24px 50px -28px rgba(11,58,92,0.45)", zIndex: 40 }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      className={cn(
        "rounded-[1.35rem] bg-white p-4 shadow-[0_16px_40px_-28px_rgba(11,58,92,0.4)] ring-1 ring-slate-200/80",
        dragging ? "cursor-grabbing" : "",
      )}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          aria-label="جابه‌جایی کارت"
          onPointerDown={(e) => controls.start(e)}
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 touch-none items-center justify-center rounded-xl bg-admin-soft text-admin-navy"
        >
          <GripVertical className="h-4 w-4 opacity-60" />
        </button>
        <button type="button" onClick={onOpen} className="min-w-0 flex-1 text-start">
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
          <p className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-admin-sky">
            <Eye className="h-3.5 w-3.5" />
            مشاهده جزئیات · یادداشت‌ها: {client.notes.length.toLocaleString("fa-IR")}
          </p>
        </button>
      </div>
    </motion.article>
  );
}

function ClientDetailDrawer({
  client,
  agentLabel,
  urgencyLabel,
  onClose,
  onUrgency,
}: {
  client: ClientRecord;
  agentLabel: string;
  urgencyLabel: string;
  onClose: () => void;
  onUrgency: (urgency: Urgency) => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 p-3 backdrop-blur-sm sm:items-center sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        role="dialog"
        aria-modal
        aria-labelledby="client-detail-title"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-2xl ring-1 ring-slate-200 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-admin-sky">پرونده مشتری</p>
            <h2 id="client-detail-title" className="mt-1 font-vazirmatn text-xl font-bold text-admin-navy">
              {client.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600"
            aria-label="بستن"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 text-sm text-slate-600">
          <DetailRow icon={<Phone className="h-4 w-4" />} label="موبایل" value={client.phone} ltr />
          <DetailRow icon={<Mail className="h-4 w-4" />} label="ایمیل" value={client.email || "—"} ltr />
          <DetailRow icon={<MapPin className="h-4 w-4" />} label="محله ترجیحی" value={client.preferredNeighborhood || "—"} />
          <DetailRow
            icon={<Wallet className="h-4 w-4" />}
            label="بودجه"
            value={`${formatToman(client.budgetMin)} تا ${formatToman(client.budgetMax)}`}
          />
          <DetailRow icon={<Sparkles className="h-4 w-4" />} label="قصد" value={INTENT_LABEL[client.intent]} />
          <DetailRow icon={<UserRoundPlus className="h-4 w-4" />} label="مشاور" value={agentLabel} />
          <DetailRow
            icon={<Eye className="h-4 w-4" />}
            label="اولویت فعلی"
            value={urgencyLabel}
          />
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold text-admin-navy">تغییر اولویت</p>
          <div className="flex flex-wrap gap-2">
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => onUrgency(col.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition",
                  client.urgency === col.id
                    ? cn(col.soft, col.accent, col.ring)
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
                )}
              >
                {col.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold text-admin-navy">
            یادداشت‌ها ({client.notes.length.toLocaleString("fa-IR")})
          </p>
          {client.notes.length === 0 ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-6 text-center text-xs text-slate-400">
              هنوز یادداشتی ثبت نشده است
            </p>
          ) : (
            <ul className="space-y-2">
              {client.notes.map((note, index) => (
                <li
                  key={note.id || `${index}-${note.at || ""}`}
                  className="rounded-2xl bg-admin-soft/60 px-4 py-3 text-sm leading-7 text-slate-700"
                >
                  <p>{note.text}</p>
                  {note.at ? (
                    <p className="mt-1 text-[11px] text-slate-400" dir="ltr">
                      {note.at}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="mt-5 text-[11px] text-slate-400">
          ثبت: {formatFaDate(client.createdAt)} · به‌روزرسانی: {formatFaDate(client.updatedAt)}
        </p>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({
  icon,
  label,
  value,
  ltr,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-slate-50 px-3 py-2.5">
      <span className="mt-0.5 text-admin-sky">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="mt-0.5 font-medium text-admin-navy" dir={ltr ? "ltr" : undefined}>
          {value}
        </p>
      </div>
    </div>
  );
}

function formatFaDate(value: string) {
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return value;
  }
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
