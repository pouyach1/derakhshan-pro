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
  ArrowLeft,
  Building2,
  ChevronDown,
  Eye,
  GripVertical,
  Phone,
  Plus,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { LeadRecord, LeadStatus } from "@/server/db/store";

type ColumnDef = {
  id: LeadStatus;
  title: string;
  hint: string;
  accent: string;
  soft: string;
  ring: string;
  dot: string;
};

const COLUMNS: ColumnDef[] = [
  {
    id: "new",
    title: "تازه",
    hint: "هنوز تماس نگرفته‌اید",
    accent: "text-sky-700",
    soft: "bg-sky-50",
    ring: "ring-sky-200/80",
    dot: "bg-sky-400",
  },
  {
    id: "contacted",
    title: "تماس اولیه",
    hint: "گفت‌وگو شروع شده",
    accent: "text-cyan-800",
    soft: "bg-cyan-50",
    ring: "ring-cyan-200/80",
    dot: "bg-cyan-500",
  },
  {
    id: "viewing",
    title: "بازدید",
    hint: "نوبت بازدید هماهنگ شود",
    accent: "text-amber-700",
    soft: "bg-amber-50",
    ring: "ring-amber-200/80",
    dot: "bg-amber-400",
  },
  {
    id: "negotiation",
    title: "مذاکره",
    hint: "نزدیک به معامله",
    accent: "text-[#0B3A5C]",
    soft: "bg-[#E8F1F8]",
    ring: "ring-sky-200/80",
    dot: "bg-[#0B3A5C]",
  },
  {
    id: "closed",
    title: "بسته شد",
    hint: "معامله موفق",
    accent: "text-emerald-700",
    soft: "bg-emerald-50",
    ring: "ring-emerald-200/80",
    dot: "bg-emerald-400",
  },
  {
    id: "lost",
    title: "از دست رفته",
    hint: "پیگیری متوقف",
    accent: "text-slate-600",
    soft: "bg-slate-100",
    ring: "ring-slate-200/80",
    dot: "bg-slate-400",
  },
];

const PIPELINE: LeadStatus[] = ["new", "contacted", "viewing", "negotiation", "closed"];

const SOURCE_LABEL: Record<string, string> = {
  website: "سایت",
  "admin-manual": "ثبت دستی",
  manual: "دستی",
  "listing-inquiry": "درخواست آگهی",
};

function nextStatus(status: LeadStatus): LeadStatus | null {
  const index = PIPELINE.indexOf(status);
  if (index < 0 || index >= PIPELINE.length - 1) return null;
  return PIPELINE[index + 1];
}

function columnOf(id: LeadStatus) {
  return COLUMNS.find((c) => c.id === id) || COLUMNS[0];
}

function pointerFromDrag(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
  if ("clientX" in event && typeof event.clientX === "number") {
    return { x: event.clientX, y: event.clientY };
  }
  return {
    x: info.point.x - (typeof window !== "undefined" ? window.scrollX : 0),
    y: info.point.y - (typeof window !== "undefined" ? window.scrollY : 0),
  };
}

function hitColumn(
  point: { x: number; y: number },
  refs: Record<LeadStatus, HTMLElement | null>,
): LeadStatus | null {
  for (const col of COLUMNS) {
    const el = refs[col.id];
    if (!el) continue;
    const rect = el.getBoundingClientRect();
    if (point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom) {
      return col.id;
    }
  }
  return null;
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

function sourceLabel(source: string) {
  if (SOURCE_LABEL[source]) return SOURCE_LABEL[source];
  if (source.startsWith("contact:")) return "فرم تماس";
  return source || "نامشخص";
}

export default function LeadsPage() {
  const reduceMotion = useReducedMotion();
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [hoverColumn, setHoverColumn] = useState<LeadStatus | null>(null);
  const [selected, setSelected] = useState<LeadRecord | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const columnRefs = useRef<Record<LeadStatus, HTMLElement | null>>({
    new: null,
    contacted: null,
    viewing: null,
    negotiation: null,
    closed: null,
    lost: null,
  });
  const [draft, setDraft] = useState({
    clientName: "",
    phone: "",
    propertyTitle: "",
    notes: "",
    assignedAgentId: "",
  });

  async function load() {
    const [leadsRes, agentsRes] = await Promise.all([
      api<{ items: LeadRecord[] }>("/api/leads"),
      api<{ items: Array<{ id: string; name: string }> }>("/api/agents"),
    ]);
    if (!leadsRes.ok) {
      setError(leadsRes.error.message);
      return;
    }
    setLeads(leadsRes.data.items);
    if (agentsRes.ok) {
      setAgents(agentsRes.data.items);
      setDraft((d) => ({ ...d, assignedAgentId: d.assignedAgentId || agentsRes.data.items[0]?.id || "" }));
    }
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const fresh = leads.find((l) => l.id === selected.id);
    if (fresh) {
      setSelected(fresh);
      setNoteDraft(fresh.notes || "");
    }
  }, [leads, selected?.id]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      if (filter !== "all" && lead.status !== filter) return false;
      if (!q) return true;
      return (
        lead.clientName.toLowerCase().includes(q) ||
        lead.phone.includes(q) ||
        lead.propertyTitle.toLowerCase().includes(q) ||
        lead.notes.toLowerCase().includes(q)
      );
    });
  }, [leads, query, filter]);

  const byColumn = useMemo(() => {
    const map = Object.fromEntries(COLUMNS.map((c) => [c.id, [] as LeadRecord[]])) as Record<
      LeadStatus,
      LeadRecord[]
    >;
    for (const lead of filtered) map[lead.status].push(lead);
    return map;
  }, [filtered]);

  const needsAction = useMemo(
    () => leads.filter((l) => l.status === "new" || l.status === "contacted").length,
    [leads],
  );

  async function patchLead(id: string, body: Record<string, unknown>) {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? ({ ...lead, ...body, updatedAt: new Date().toISOString() } as LeadRecord) : lead)),
    );
    const res = await api(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify(body) });
    if (!res.ok) void load();
  }

  async function moveLead(id: string, status: LeadStatus) {
    await patchLead(id, { status });
  }

  async function createLead() {
    if (!draft.clientName.trim() || !draft.phone.trim()) {
      setError("نام و موبایل لید الزامی است");
      return;
    }
    setSaving(true);
    const res = await api<LeadRecord>("/api/leads", {
      method: "POST",
      body: JSON.stringify({
        clientName: draft.clientName.trim(),
        phone: draft.phone.trim(),
        propertyTitle: draft.propertyTitle.trim() || "پیگیری دستی",
        notes: draft.notes.trim(),
        source: "admin-manual",
        assignedAgentId: draft.assignedAgentId || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft((d) => ({ ...d, clientName: "", phone: "", propertyTitle: "", notes: "" }));
    setAddOpen(false);
    await load();
  }

  function onCardDrag(_id: string, event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    setHoverColumn(hitColumn(pointerFromDrag(event, info), columnRefs.current));
  }

  function onCardDragEnd(id: string, event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const target = hitColumn(pointerFromDrag(event, info), columnRefs.current);
    setDraggingId(null);
    setHoverColumn(null);
    if (!target) return;
    const lead = leads.find((l) => l.id === id);
    if (lead && lead.status !== target) void moveLead(id, target);
  }

  const agentName = (id: string | null) => agents.find((a) => a.id === id)?.name || "بدون مشاور";

  return (
    <div className="space-y-5">
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.85rem] bg-admin-card p-5 shadow-[0_24px_60px_-40px_rgba(11,58,92,0.32)] ring-1 ring-slate-200/70 sm:p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(14,165,233,0.12),transparent_50%)]"
        />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] text-admin-sky">
              <Sparkles className="h-3.5 w-3.5" />
              قیف پیگیری
            </p>
            <h1 className="mt-2 font-vazirmatn text-2xl font-bold text-admin-navy">پیگیری مشتریان</h1>
            <p className="mt-1 max-w-xl text-sm leading-7 text-slate-500">
              یک‌ضرب به مرحله بعد بروید، کارت را بکشید، یا جزئیات را باز کنید — ساده و سریع.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-admin-soft px-3 py-1.5 text-xs font-medium text-admin-navy">
              {leads.length.toLocaleString("fa-IR")} لید
            </span>
            {needsAction > 0 ? (
              <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/80">
                {needsAction.toLocaleString("fa-IR")} نیازمند اقدام
              </span>
            ) : null}
            <motion.button
              type="button"
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAddOpen((v) => !v)}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-admin-sky px-4 text-sm font-semibold text-white shadow-[0_14px_36px_-18px_rgba(14,165,233,0.9)]"
            >
              <Plus className="h-4 w-4" />
              لید جدید
              <ChevronDown className={cn("h-4 w-4 transition", addOpen ? "rotate-180" : "")} />
            </motion.button>
          </div>
        </div>

        <div className="relative mt-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="h-11 w-full rounded-2xl bg-white pe-4 ps-10 text-sm text-admin-navy outline-none ring-1 ring-slate-200/80 transition focus:ring-admin-sky/50"
              placeholder="جستجو نام، موبایل یا ملک..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="همه" count={leads.length} />
            {COLUMNS.map((col) => (
              <FilterChip
                key={col.id}
                active={filter === col.id}
                onClick={() => setFilter(col.id)}
                label={col.title}
                count={leads.filter((l) => l.status === col.id).length}
                soft={col.soft}
                accent={col.accent}
              />
            ))}
          </div>
        </div>

        <AnimatePresence initial={false}>
          {addOpen ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative overflow-hidden"
            >
              <div className="mt-4 grid gap-2 rounded-[1.35rem] bg-admin-soft/70 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <input className={inputClass} placeholder="نام مشتری" value={draft.clientName} onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value }))} />
                <input className={inputClass} placeholder="موبایل" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
                <input className={inputClass} placeholder="موضوع / ملک" value={draft.propertyTitle} onChange={(e) => setDraft((d) => ({ ...d, propertyTitle: e.target.value }))} />
                <input className={inputClass} placeholder="یادداشت کوتاه" value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
                <select className={inputClass} value={draft.assignedAgentId} onChange={(e) => setDraft((d) => ({ ...d, assignedAgentId: e.target.value }))}>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>{agent.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void createLead()}
                  className="h-11 rounded-full bg-admin-navy text-sm font-semibold text-white disabled:opacity-60"
                >
                  {saving ? "..." : "ثبت لید"}
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.section>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 pt-1 [scrollbar-width:thin]">
        {COLUMNS.map((column) => (
          <section
            key={column.id}
            ref={(node) => {
              columnRefs.current[column.id] = node;
            }}
            data-column={column.id}
            className={cn(
              "flex w-[min(86vw,19.5rem)] shrink-0 flex-col rounded-[1.6rem] p-3 ring-1 transition sm:w-[20rem]",
              column.soft,
              column.ring,
              hoverColumn === column.id && draggingId ? "ring-2 ring-admin-sky/70 scale-[1.01]" : "",
              filter !== "all" && filter !== column.id ? "opacity-40" : "",
            )}
          >
            <div className="mb-3 flex items-start justify-between gap-2 px-1">
              <div>
                <h2 className={cn("inline-flex items-center gap-2 font-vazirmatn text-sm font-bold", column.accent)}>
                  <span className={cn("h-2 w-2 rounded-full", column.dot)} />
                  {column.title}
                </h2>
                <p className="mt-0.5 text-[11px] text-slate-500">{column.hint}</p>
              </div>
              <span className="rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-admin-navy shadow-sm">
                {byColumn[column.id].length.toLocaleString("fa-IR")}
              </span>
            </div>

            <div className="flex min-h-[22rem] flex-col gap-2.5">
              <AnimatePresence initial={false}>
                {byColumn[column.id].map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    column={column}
                    agentLabel={agentName(lead.assignedAgentId)}
                    reduceMotion={!!reduceMotion}
                    dragging={draggingId === lead.id}
                    onDragStart={() => setDraggingId(lead.id)}
                    onDrag={(event, info) => onCardDrag(lead.id, event, info)}
                    onDragEnd={(event, info) => onCardDragEnd(lead.id, event, info)}
                    onOpen={() => {
                      setSelected(lead);
                      setNoteDraft(lead.notes || "");
                    }}
                    onNext={() => {
                      const next = nextStatus(lead.status);
                      if (next) void moveLead(lead.id, next);
                    }}
                  />
                ))}
              </AnimatePresence>
              {byColumn[column.id].length === 0 ? (
                <div
                  className={cn(
                    "flex flex-1 items-center justify-center rounded-[1.2rem] border border-dashed px-3 py-10 text-center text-xs",
                    hoverColumn === column.id && draggingId
                      ? "border-admin-sky bg-white/80 text-admin-navy"
                      : "border-slate-300/70 bg-white/40 text-slate-400",
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
          <LeadDetailDrawer
            lead={selected}
            agentLabel={agentName(selected.assignedAgentId)}
            agents={agents}
            noteDraft={noteDraft}
            onNoteDraft={setNoteDraft}
            onClose={() => setSelected(null)}
            onStatus={(status) => void moveLead(selected.id, status)}
            onSaveNotes={() => void patchLead(selected.id, { notes: noteDraft })}
            onAssign={(assignedAgentId) => void patchLead(selected.id, { assignedAgentId })}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  soft,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  soft?: string;
  accent?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition",
        active
          ? soft && accent
            ? cn(soft, accent, "ring-1", "ring-current/20")
            : "bg-admin-navy text-white"
          : "bg-white text-slate-600 ring-1 ring-slate-200/80 hover:bg-slate-50",
      )}
    >
      {label}
      <span className={cn("rounded-full px-1.5 py-0.5 text-[10px]", active ? "bg-white/50" : "bg-slate-100")}>
        {count.toLocaleString("fa-IR")}
      </span>
    </button>
  );
}

function LeadCard({
  lead,
  column,
  agentLabel,
  reduceMotion,
  dragging,
  onDragStart,
  onDrag,
  onDragEnd,
  onOpen,
  onNext,
}: {
  lead: LeadRecord;
  column: ColumnDef;
  agentLabel: string;
  reduceMotion: boolean;
  dragging: boolean;
  onDragStart: () => void;
  onDrag: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onDragEnd: (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => void;
  onOpen: () => void;
  onNext: () => void;
}) {
  const controls = useDragControls();
  const next = nextStatus(lead.status);

  return (
    <motion.article
      layout={!dragging}
      data-client-card
      data-lead-id={lead.id}
      drag
      dragControls={controls}
      dragListener={false}
      dragSnapToOrigin
      dragElastic={0.12}
      initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileDrag={{ scale: 1.04, boxShadow: "0 24px 50px -28px rgba(11,58,92,0.45)", zIndex: 40 }}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      className="rounded-[1.25rem] bg-white p-3.5 shadow-[0_14px_36px_-28px_rgba(11,58,92,0.45)] ring-1 ring-slate-200/80"
    >
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          aria-label="جابه‌جایی کارت"
          onPointerDown={(e) => controls.start(e)}
          className="mt-0.5 inline-flex h-8 w-8 shrink-0 touch-none items-center justify-center rounded-xl bg-admin-soft text-admin-navy"
        >
          <GripVertical className="h-4 w-4 opacity-60" />
        </button>
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onOpen} className="w-full text-start">
            <div className="flex items-start justify-between gap-2">
              <h3 className="truncate font-vazirmatn text-sm font-bold text-admin-navy">{lead.clientName}</h3>
              <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold", column.soft, column.accent)}>
                {column.title}
              </span>
            </div>
            <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500" dir="ltr">
              <Phone className="h-3 w-3" />
              {lead.phone}
            </p>
            <p className="mt-2 line-clamp-2 text-xs leading-6 text-slate-600">
              <Building2 className="me-1 inline h-3.5 w-3.5 text-admin-sky" />
              {lead.propertyTitle || "درخواست عمومی"}
            </p>
            <p className="mt-1.5 text-[11px] text-slate-400">
              {sourceLabel(lead.source)} · {agentLabel}
            </p>
          </button>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {next ? (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-full bg-admin-sky px-3 py-2 text-[11px] font-semibold text-white"
              >
                مرحله بعد
                <ArrowLeft className="h-3.5 w-3.5" />
                <span className="opacity-90">{columnOf(next).title}</span>
              </button>
            ) : null}
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center gap-1 rounded-full bg-admin-soft px-3 py-2 text-[11px] font-semibold text-admin-navy"
            >
              <Eye className="h-3.5 w-3.5" />
              جزئیات
            </button>
            <a
              href={`tel:${lead.phone.replace(/\s/g, "")}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-admin-sky ring-1 ring-slate-200"
              aria-label="تماس"
            >
              <Phone className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function LeadDetailDrawer({
  lead,
  agentLabel,
  agents,
  noteDraft,
  onNoteDraft,
  onClose,
  onStatus,
  onSaveNotes,
  onAssign,
}: {
  lead: LeadRecord;
  agentLabel: string;
  agents: Array<{ id: string; name: string }>;
  noteDraft: string;
  onNoteDraft: (value: string) => void;
  onClose: () => void;
  onStatus: (status: LeadStatus) => void;
  onSaveNotes: () => void;
  onAssign: (agentId: string) => void;
}) {
  const current = columnOf(lead.status);
  const next = nextStatus(lead.status);

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
        aria-labelledby="lead-detail-title"
        initial={{ opacity: 0, y: 28, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[1.75rem] bg-white p-5 shadow-2xl ring-1 ring-slate-200 sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.16em] text-admin-sky">پرونده پیگیری</p>
            <h2 id="lead-detail-title" className="mt-1 font-vazirmatn text-xl font-bold text-admin-navy">
              {lead.clientName}
            </h2>
            <p className={cn("mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold", current.soft, current.accent)}>
              {current.title}
            </p>
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

        <div className="mt-5 grid gap-2.5 text-sm">
          <DetailRow icon={<Phone className="h-4 w-4" />} label="موبایل" value={lead.phone} ltr />
          <DetailRow icon={<Building2 className="h-4 w-4" />} label="ملک / موضوع" value={lead.propertyTitle || "—"} />
          <DetailRow icon={<UserRound className="h-4 w-4" />} label="مشاور" value={agentLabel} />
          <DetailRow icon={<Sparkles className="h-4 w-4" />} label="منبع" value={sourceLabel(lead.source)} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`tel:${lead.phone.replace(/\s/g, "")}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-admin-sky px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Phone className="h-4 w-4" />
            تماس سریع
          </a>
          {next ? (
            <button
              type="button"
              onClick={() => onStatus(next)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-admin-navy px-4 py-2.5 text-sm font-semibold text-white"
            >
              مرحله بعد: {columnOf(next).title}
            </button>
          ) : null}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-semibold text-admin-navy">مسیر قیف</p>
          <div className="flex flex-wrap gap-1.5">
            {COLUMNS.map((col) => (
              <button
                key={col.id}
                type="button"
                onClick={() => onStatus(col.id)}
                className={cn(
                  "rounded-full px-3 py-1.5 text-[11px] font-semibold ring-1 transition",
                  lead.status === col.id
                    ? cn(col.soft, col.accent, col.ring)
                    : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
                )}
              >
                {col.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold text-admin-navy">اختصاص مشاور</p>
          <select
            className={inputClass}
            value={lead.assignedAgentId || ""}
            onChange={(e) => onAssign(e.target.value)}
          >
            <option value="">بدون مشاور</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold text-admin-navy">یادداشت</p>
          <textarea
            className="min-h-[7rem] w-full resize-y rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-7 text-admin-navy outline-none ring-1 ring-slate-200/80 focus:ring-admin-sky/50"
            value={noteDraft}
            onChange={(e) => onNoteDraft(e.target.value)}
            placeholder="نکته تماس، بودجه، زمان مناسب..."
          />
          <button
            type="button"
            onClick={onSaveNotes}
            className="mt-2 rounded-full bg-admin-soft px-4 py-2 text-xs font-semibold text-admin-navy"
          >
            ذخیره یادداشت
          </button>
        </div>

        <p className="mt-5 text-[11px] text-slate-400">
          ثبت {formatFaDate(lead.createdAt)} · به‌روزرسانی {formatFaDate(lead.updatedAt)}
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

const inputClass =
  "h-11 w-full rounded-2xl bg-white px-4 text-sm text-admin-navy outline-none ring-1 ring-slate-200/80 transition focus:ring-admin-sky/50";
