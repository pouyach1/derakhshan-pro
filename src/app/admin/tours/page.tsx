"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { PropertyRecord, TourRecord, TourStatus } from "@/server/db/store";

const STATUS_LABEL: Record<TourStatus, string> = {
  upcoming: "پیش‌رو",
  completed: "انجام‌شده",
  canceled: "لغو شده",
};

export default function AdminToursPage() {
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
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

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">بازدیدها</h1>
        <p className="mt-1 text-sm text-slate-500">زمان‌بندی بازدید ملک با مشتری</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <select className={inputClass} value={draft.propertyId} onChange={(e) => setDraft((d) => ({ ...d, propertyId: e.target.value }))}>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="نام مشتری" value={draft.clientName} onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value }))} />
          <input className={inputClass} placeholder="موبایل" value={draft.clientPhone} onChange={(e) => setDraft((d) => ({ ...d, clientPhone: e.target.value }))} />
          <select className={inputClass} value={draft.agentId} onChange={(e) => setDraft((d) => ({ ...d, agentId: e.target.value }))}>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>{agent.name}</option>
            ))}
          </select>
          <input className={inputClass} placeholder="روز" value={draft.dayLabel} onChange={(e) => setDraft((d) => ({ ...d, dayLabel: e.target.value }))} />
          <input className={inputClass} placeholder="ساعت" value={draft.timeLabel} onChange={(e) => setDraft((d) => ({ ...d, timeLabel: e.target.value }))} />
          <input className={inputClass} placeholder="یادداشت" value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
          <button type="button" disabled={saving} onClick={() => void createTour()} className="h-11 rounded-full bg-admin-sky text-sm font-medium text-white disabled:opacity-60">
            {saving ? "..." : "ثبت بازدید"}
          </button>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}

      <div className="space-y-3">
        {tours.map((tour, index) => (
          <motion.article
            key={tour.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-admin-navy">{propertyTitle(tour.propertyId)}</h2>
                <p className="mt-1 text-sm text-slate-600">مشتری: {tour.clientName}</p>
                <p className="mt-1 text-xs text-slate-400">
                  {tour.dayLabel} · {tour.timeLabel}
                </p>
              </div>
              <select
                className="rounded-full bg-admin-soft px-3 py-1.5 text-xs"
                value={tour.status}
                onChange={(e) => void setStatus(tour.id, e.target.value as TourStatus)}
              >
                {(Object.keys(STATUS_LABEL) as TourStatus[]).map((status) => (
                  <option key={status} value={status}>{STATUS_LABEL[status]}</option>
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
