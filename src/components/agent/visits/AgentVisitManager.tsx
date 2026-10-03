"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  CalendarPlus,
  CheckCircle2,
  Clock3,
  X,
  XCircle,
} from "lucide-react";
import {
  TOUR_STATUS_LABEL,
  type AgentTour,
  type TourStatus,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { api } from "@/lib/api";
import { mapTourToAgent } from "@/lib/mappers";
import { cn } from "@/lib/utils";
import type { ClientRecord, PropertyRecord, TourRecord } from "@/server/db/store";

const ease = [0.22, 1, 0.36, 1] as const;

const STATUS_META: Record<
  TourStatus,
  { tone: string; icon: typeof Clock3; marker: string }
> = {
  upcoming: {
    tone: "bg-sky-50 text-sky-700 ring-sky-200",
    icon: Clock3,
    marker: "bg-sky-500",
  },
  completed: {
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    icon: CheckCircle2,
    marker: "bg-emerald-500",
  },
  canceled: {
    tone: "bg-rose-50 text-rose-700 ring-rose-200",
    icon: XCircle,
    marker: "bg-rose-400",
  },
};

type Draft = {
  clientId: string;
  propertyId: string;
  date: string;
  time: string;
  notes: string;
};

function toLocalDateInput(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function combineLocalIso(date: string, time: string) {
  const iso = new Date(`${date}T${time}:00`);
  return iso.toISOString();
}

type AgentVisitManagerProps = {
  /** Prefill client when opened from a client context */
  initialClientId?: string;
  /** Prefill property when opened from a property context */
  initialPropertyId?: string;
  /** Compact header for embedding inside profile */
  embedded?: boolean;
};

export default function AgentVisitManager({
  initialClientId = "",
  initialPropertyId = "",
  embedded = false,
}: AgentVisitManagerProps) {
  const agentId = useAgentScope();
  const reduceMotion = useReducedMotion();
  const [tours, setTours] = useState<AgentTour[]>([]);
  const [tourNotes, setTourNotes] = useState<Record<string, string>>({});
  const [clients, setClients] = useState<ClientRecord[]>([]);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [filter, setFilter] = useState<TourStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [detail, setDetail] = useState<AgentTour | null>(null);
  const [draft, setDraft] = useState<Draft>({
    clientId: initialClientId,
    propertyId: initialPropertyId,
    date: toLocalDateInput(new Date(Date.now() + 86400000)),
    time: "10:30",
    notes: "",
  });

  async function load() {
    setLoading(true);
    const [tourRes, propRes, clientRes] = await Promise.all([
      api<{ items: TourRecord[] }>("/api/tours"),
      api<{ items: PropertyRecord[] }>("/api/properties?pageSize=50"),
      api<{ items: ClientRecord[] }>("/api/clients"),
    ]);
    if (!tourRes.ok) {
      setError(tourRes.error.message);
      setLoading(false);
      return;
    }
    const props = propRes.ok ? propRes.data.items : [];
    const clientItems = clientRes.ok ? clientRes.data.items : [];
    setProperties(props);
    setClients(clientItems);
    setTours(tourRes.data.items.map((item) => mapTourToAgent(item, props)));
    setTourNotes(
      Object.fromEntries(tourRes.data.items.map((item) => [item.id, item.notes || ""])),
    );
    setDraft((d) => ({
      ...d,
      clientId: d.clientId || initialClientId || clientItems[0]?.id || "",
      propertyId: d.propertyId || initialPropertyId || props[0]?.id || "",
    }));
    setError("");
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when agent scope resolves
  }, [agentId]);

  useEffect(() => {
    if (!formOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [formOpen]);

  const grouped = useMemo(() => {
    const list = filter === "all" ? tours : tours.filter((t) => t.status === filter);
    const map = new Map<string, typeof list>();
    for (const tour of list) {
      const key = tour.dayLabel || "بدون تاریخ";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(tour);
    }
    return Array.from(map.entries());
  }, [filter, tours]);

  const counts = useMemo(
    () => ({
      all: tours.length,
      upcoming: tours.filter((t) => t.status === "upcoming").length,
      completed: tours.filter((t) => t.status === "completed").length,
      canceled: tours.filter((t) => t.status === "canceled").length,
    }),
    [tours],
  );

  async function createVisit() {
    if (!draft.clientId || !draft.propertyId || !draft.date || !draft.time) {
      setError("مشتری، ملک، تاریخ و ساعت الزامی است");
      return;
    }
    setSaving(true);
    setError("");
    let scheduledAt: string;
    try {
      scheduledAt = combineLocalIso(draft.date, draft.time);
      if (Number.isNaN(new Date(scheduledAt).getTime())) throw new Error("bad date");
    } catch {
      setSaving(false);
      setError("تاریخ یا ساعت معتبر نیست");
      return;
    }
    const res = await api<TourRecord>("/api/tours", {
      method: "POST",
      body: JSON.stringify({
        propertyId: draft.propertyId,
        clientId: draft.clientId,
        scheduledAt,
        notes: draft.notes.trim() || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setFormOpen(false);
    setDraft((d) => ({ ...d, notes: "" }));
    await load();
  }

  async function setStatus(id: string, status: TourStatus) {
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    if (detail?.id === id) setDetail((d) => (d ? { ...d, status } : d));
    const res = await api(`/api/tours?id=${encodeURIComponent(id)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      setError(res.error.message);
      await load();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          {!embedded ? (
            <>
              <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">بازدیدها</h1>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                برنامه‌ریزی و مدیریت بازدید ملک برای مشتریان شما
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-semibold text-slate-900">بازدیدهای من</h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                برای مشتری و ملک، زمان بازدید ثبت کنید
              </p>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            setError("");
            setFormOpen(true);
          }}
          className="ios-tap-target inline-flex h-11 items-center gap-2 rounded-full bg-[#0B3A5C] px-4 text-sm font-semibold text-white shadow-sm transition duration-150 hover:bg-[#0a314d]"
        >
          <CalendarPlus className="h-4 w-4" />
          ایجاد بازدید
        </button>
      </div>

      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {(
          [
            ["all", "همه", counts.all],
            ["upcoming", "برنامه‌ریزی‌شده", counts.upcoming],
            ["completed", "انجام‌شده", counts.completed],
            ["canceled", "لغو شده", counts.canceled],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setFilter(id)}
            className={cn(
              "ios-tap-target shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition duration-150 sm:text-sm",
              filter === id
                ? "bg-slate-900 text-white"
                : "bg-white/90 text-slate-600 ring-1 ring-slate-200/80",
            )}
          >
            {label}
            <span className="ms-1.5 tabular-nums opacity-70">
              {count.toLocaleString("fa-IR")}
            </span>
          </button>
        ))}
      </div>

      {error ? (
        <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 ring-1 ring-rose-100">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-[1.5rem] bg-slate-200/60"
              aria-hidden
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          <AnimatePresence mode="popLayout">
            {grouped.map(([day, dayTours]) => (
              <motion.section
                key={day}
                layout
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.22, ease }}
                className="rounded-[1.5rem] border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:rounded-[1.75rem] sm:p-6"
              >
                <h3 className="mb-4 text-sm font-semibold text-slate-900">{day}</h3>
                <ol className="relative space-y-4 border-s-2 border-slate-200/80 ps-5">
                  {dayTours.map((tour) => {
                    const meta = STATUS_META[tour.status];
                    const Icon = meta.icon;
                    return (
                      <li key={tour.id} className="relative">
                        <span
                          className={cn(
                            "absolute -start-[1.6rem] top-3 h-3 w-3 rounded-full ring-4 ring-white",
                            meta.marker,
                          )}
                        />
                        <article className="rounded-2xl bg-[#F1EFEA]/70 p-4 ring-1 ring-slate-200/50">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="font-medium text-slate-900">{tour.clientName}</p>
                              <p className="mt-1 text-sm text-slate-500">{tour.propertyTitle}</p>
                            </div>
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                                meta.tone,
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {TOUR_STATUS_LABEL[tour.status]}
                            </span>
                          </div>
                          <p className="mt-3 text-sm tabular-nums text-emerald-700">
                            ساعت {tour.time}
                          </p>
                          {tourNotes[tour.id] ? (
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                              {tourNotes[tour.id]}
                            </p>
                          ) : null}
                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setDetail(tour)}
                              className="ios-tap-target rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 transition duration-150 hover:bg-slate-50"
                            >
                              مشاهده
                            </button>
                            {tour.status === "upcoming" ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void setStatus(tour.id, "completed")}
                                  className="ios-tap-target rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 transition duration-150"
                                >
                                  انجام شد
                                </button>
                                <button
                                  type="button"
                                  onClick={() => void setStatus(tour.id, "canceled")}
                                  className="ios-tap-target rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700 ring-1 ring-rose-200 transition duration-150"
                                >
                                  لغو
                                </button>
                              </>
                            ) : null}
                          </div>
                        </article>
                      </li>
                    );
                  })}
                </ol>
              </motion.section>
            ))}
          </AnimatePresence>

          {grouped.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/50 px-4 py-10 text-center">
              <p className="text-sm text-slate-500">هنوز بازدیدی برنامه‌ریزی نشده است.</p>
              <button
                type="button"
                onClick={() => setFormOpen(true)}
                className="ios-tap-target mt-4 inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-4 py-2.5 text-sm font-medium text-white"
              >
                <CalendarPlus className="h-4 w-4" />
                ایجاد بازدید
              </button>
            </div>
          ) : null}
        </div>
      )}

      <AnimatePresence>
        {formOpen ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/45 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFormOpen(false)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="create-visit-title"
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 16 }}
              transition={{ duration: 0.22, ease }}
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
                  <h3 id="create-visit-title" className="font-semibold text-slate-900">
                    بازدید جدید
                  </h3>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
                    className="ios-tap-target inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                    aria-label="بستن"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                <div className="space-y-3">
                  <label className="block text-sm text-slate-600">
                    مشتری
                    <select
                      value={draft.clientId}
                      onChange={(e) => setDraft((d) => ({ ...d, clientId: e.target.value }))}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                      required
                    >
                      <option value="">انتخاب مشتری</option>
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block text-sm text-slate-600">
                    ملک
                    <select
                      value={draft.propertyId}
                      onChange={(e) => setDraft((d) => ({ ...d, propertyId: e.target.value }))}
                      className="mt-1.5 w-full rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                      required
                    >
                      <option value="">انتخاب ملک</option>
                      {properties.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-sm text-slate-600">
                      تاریخ
                      <input
                        type="date"
                        value={draft.date}
                        onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))}
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                        required
                      />
                    </label>
                    <label className="block text-sm text-slate-600">
                      ساعت
                      <input
                        type="time"
                        value={draft.time}
                        onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))}
                        className="mt-1.5 w-full rounded-2xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                        required
                      />
                    </label>
                  </div>

                  <label className="block text-sm text-slate-600">
                    توضیحات
                    <textarea
                      value={draft.notes}
                      onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
                      rows={3}
                      placeholder="اختیاری — مثلاً هماهنگی درب پارکینگ"
                      className="mt-1.5 w-full resize-none rounded-2xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15"
                    />
                  </label>
                </div>
              </div>

              <div className="shrink-0 border-t border-slate-100 bg-white px-5 pt-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
                <div className="flex flex-col gap-2 sm:flex-row-reverse">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void createVisit()}
                    className="ios-tap-target w-full rounded-full bg-[#0B3A5C] py-3 text-sm font-medium text-white disabled:opacity-60 sm:flex-1"
                  >
                    {saving ? "در حال ثبت…" : "ثبت بازدید"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormOpen(false)}
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

      <AnimatePresence>
        {detail ? (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-slate-900/45 backdrop-blur-sm sm:items-center sm:p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDetail(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="visit-detail-title"
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 12 }}
              transition={{ duration: 0.2, ease }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-t-[1.75rem] border border-slate-200/70 bg-white p-5 shadow-2xl sm:rounded-[1.75rem]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 id="visit-detail-title" className="font-semibold text-slate-900">
                    {detail.clientName}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{detail.propertyTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetail(null)}
                  className="ios-tap-target inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-slate-100"
                  aria-label="بستن"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm text-slate-700">
                {detail.dayLabel} · ساعت {detail.time}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                وضعیت: {TOUR_STATUS_LABEL[detail.status]}
              </p>
              {tourNotes[detail.id] ? (
                <p className="mt-3 rounded-2xl bg-slate-50 px-3 py-2.5 text-sm leading-6 text-slate-600">
                  {tourNotes[detail.id]}
                </p>
              ) : null}
              {detail.status === "upcoming" ? (
                <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => void setStatus(detail.id, "completed")}
                    className="ios-tap-target flex-1 rounded-full bg-emerald-600 py-3 text-sm font-medium text-white"
                  >
                    علامت به‌عنوان انجام‌شده
                  </button>
                  <button
                    type="button"
                    onClick={() => void setStatus(detail.id, "canceled")}
                    className="ios-tap-target flex-1 rounded-full bg-rose-50 py-3 text-sm font-medium text-rose-700 ring-1 ring-rose-200"
                  >
                    لغو بازدید
                  </button>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
