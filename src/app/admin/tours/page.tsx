"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { PropertyRecord, TourRecord, TourStatus } from "@/server/db/store";

const STATUS_LABEL: Record<TourStatus, string> = {
  upcoming: "پیش‌رو",
  completed: "انجام‌شده",
  canceled: "لغو شده",
};

const STATUS_TONE: Record<TourStatus, string> = {
  upcoming: "bg-sky-50 text-sky-700 ring-sky-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  canceled: "bg-slate-100 text-slate-500 ring-slate-200",
};

export default function AdminToursPage() {
  const reduceMotion = useReducedMotion();
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState({
    propertyId: "",
    clientName: "",
    clientPhone: "",
    dayLabel: "فردا",
    timeLabel: "۱۰:۳۰",
    agentId: "",
    notes: "",
  });

  async function load() {
    const [toursRes, propsRes, agentsRes] = await Promise.all([
      api<{ items: TourRecord[] }>("/api/tours"),
      api<{ items: PropertyRecord[] }>("/api/properties?pageSize=50"),
      api<{ items: Array<{ id: string; name: string }> }>("/api/agents"),
    ]);
    if (!toursRes.ok) {
      setError(toursRes.error.message);
      return;
    }
    setTours(toursRes.data.items);
    if (propsRes.ok) {
      setProperties(propsRes.data.items);
      setDraft((d) => ({ ...d, propertyId: d.propertyId || propsRes.data.items[0]?.id || "" }));
    }
    if (agentsRes.ok) {
      setAgents(agentsRes.data.items);
      setDraft((d) => ({ ...d, agentId: d.agentId || agentsRes.data.items[0]?.id || "" }));
    }
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  async function createTour() {
    if (!draft.clientName.trim() || !draft.propertyId) {
      setError("نام مشتری و ملک الزامی است");
      return;
    }
    setSaving(true);
    const scheduledAt = new Date(Date.now() + 86400000).toISOString();
    const res = await api("/api/tours", {
      method: "POST",
      body: JSON.stringify({
        propertyId: draft.propertyId,
        clientName: draft.clientName.trim(),
        clientPhone: draft.clientPhone.trim() || undefined,
        scheduledAt,
        dayLabel: draft.dayLabel,
        timeLabel: draft.timeLabel,
        notes: draft.notes,
        agentId: draft.agentId || undefined,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft((d) => ({ ...d, clientName: "", clientPhone: "", notes: "" }));
    setFormOpen(false);
    await load();
  }

  async function setStatus(id: string, status: TourStatus) {
    setTours((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    const res = await api(`/api/tours?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) void load();
  }

  function propertyTitle(id: string) {
    return properties.find((p) => p.id === id)?.title || "فایل";
  }

  function agentName(id: string) {
    return agents.find((a) => a.id === id)?.name || "بدون مشاور";
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">بازدیدها</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">زمان‌بندی بازدید ملک با مشتری</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-admin-soft px-3 py-1.5 text-xs font-medium text-admin-navy">
              {tours.length.toLocaleString("fa-IR")} بازدید
            </span>
            <button
              type="button"
              onClick={() => setFormOpen((v) => !v)}
              className="ios-tap-target inline-flex h-11 items-center gap-2 rounded-full bg-admin-sky px-4 text-sm font-semibold text-white shadow-lg shadow-sky-500/25 lg:hidden"
            >
              <CalendarPlus className="h-4 w-4" />
              ثبت بازدید
              <ChevronDown className={cn("h-4 w-4 transition", formOpen ? "rotate-180" : "")} />
            </button>
          </div>
        </div>

        {/* Mobile: collapsible form */}
        <AnimatePresence initial={false}>
          {formOpen ? (
            <motion.div
              key="tour-form-mobile"
              initial={reduceMotion ? false : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
              className="mt-4 overflow-hidden lg:hidden"
            >
              <TourForm
                draft={draft}
                setDraft={setDraft}
                properties={properties}
                agents={agents}
                saving={saving}
                onSubmit={() => void createTour()}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>

        {/* Desktop: always visible */}
        <div className="mt-4 hidden lg:block">
          <TourForm
            draft={draft}
            setDraft={setDraft}
            properties={properties}
            agents={agents}
            saving={saving}
            onSubmit={() => void createTour()}
          />
        </div>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="space-y-3">
        {tours.map((tour, index) => (
          <motion.article
            key={tour.id}
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.2) }}
            className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-admin-navy">{propertyTitle(tour.propertyId)}</h2>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1",
                      STATUS_TONE[tour.status],
                    )}
                  >
                    {STATUS_LABEL[tour.status]}
                  </span>
                </div>
                <p className="mt-1.5 text-sm text-slate-600">مشتری: {tour.clientName}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {tour.dayLabel} · {tour.timeLabel} · {agentName(tour.agentId)}
                </p>
                {tour.notes ? <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">{tour.notes}</p> : null}
              </div>
              <select
                className="ios-tap-target h-11 min-w-[7.5rem] rounded-full bg-admin-soft px-3 text-xs font-medium text-admin-navy"
                value={tour.status}
                onChange={(e) => void setStatus(tour.id, e.target.value as TourStatus)}
              >
                {(Object.keys(STATUS_LABEL) as TourStatus[]).map((status) => (
                  <option key={status} value={status}>
                    {STATUS_LABEL[status]}
                  </option>
                ))}
              </select>
            </div>
          </motion.article>
        ))}
        {tours.length === 0 ? (
          <p className="rounded-2xl bg-admin-soft px-4 py-8 text-center text-sm text-slate-400">بازدیدی ثبت نشده</p>
        ) : null}
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-2xl bg-admin-soft px-4 text-sm text-admin-navy outline-none focus:ring-2 focus:ring-admin-sky/40";

type TourDraft = {
  propertyId: string;
  clientName: string;
  clientPhone: string;
  dayLabel: string;
  timeLabel: string;
  agentId: string;
  notes: string;
};

function TourForm({
  draft,
  setDraft,
  properties,
  agents,
  saving,
  onSubmit,
}: {
  draft: TourDraft;
  setDraft: Dispatch<SetStateAction<TourDraft>>;
  properties: PropertyRecord[];
  agents: Array<{ id: string; name: string }>;
  saving: boolean;
  onSubmit: () => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <select
        className={inputClass}
        value={draft.propertyId}
        onChange={(e) => setDraft((d) => ({ ...d, propertyId: e.target.value }))}
      >
        {properties.map((p) => (
          <option key={p.id} value={p.id}>
            {p.title}
          </option>
        ))}
      </select>
      <input
        className={inputClass}
        placeholder="نام مشتری"
        value={draft.clientName}
        onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value }))}
      />
      <input
        className={inputClass}
        placeholder="موبایل"
        value={draft.clientPhone}
        onChange={(e) => setDraft((d) => ({ ...d, clientPhone: e.target.value }))}
      />
      <select
        className={inputClass}
        value={draft.agentId}
        onChange={(e) => setDraft((d) => ({ ...d, agentId: e.target.value }))}
      >
        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>
      <input
        className={inputClass}
        placeholder="روز"
        value={draft.dayLabel}
        onChange={(e) => setDraft((d) => ({ ...d, dayLabel: e.target.value }))}
      />
      <input
        className={inputClass}
        placeholder="ساعت"
        value={draft.timeLabel}
        onChange={(e) => setDraft((d) => ({ ...d, timeLabel: e.target.value }))}
      />
      <input
        className={inputClass}
        placeholder="یادداشت"
        value={draft.notes}
        onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
      />
      <button
        type="button"
        disabled={saving}
        onClick={onSubmit}
        className="ios-tap-target h-11 rounded-full bg-admin-sky text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "..." : "ثبت بازدید"}
      </button>
    </div>
  );
}
