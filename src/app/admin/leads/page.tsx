"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { LeadRecord, LeadStatus } from "@/server/db/store";

const COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: "new", title: "تازه رسیده" },
  { id: "contacted", title: "تماس اولیه" },
  { id: "viewing", title: "نوبت بازدید" },
  { id: "negotiation", title: "مذاکره" },
  { id: "closed", title: "معامله شد" },
  { id: "lost", title: "از دست رفته" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ clientName: "", phone: "", propertyTitle: "", notes: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    const res = await api<{ items: LeadRecord[] }>("/api/leads");
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setLeads(res.data.items);
    setError("");
  }

  useEffect(() => {
    void load();
  }, []);

  const grouped = useMemo(
    () => COLUMNS.map((column) => ({ ...column, items: leads.filter((lead) => lead.status === column.id) })),
    [leads],
  );

  async function moveLead(id: string, status: LeadStatus) {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
    const res = await api(`/api/leads/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (!res.ok) void load();
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
      }),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error.message);
      return;
    }
    setDraft({ clientName: "", phone: "", propertyTitle: "", notes: "" });
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">پیگیری مشتریان</h1>
        <p className="mt-1 text-sm text-slate-500">درخواست‌های سایت و آگهی‌ها اینجا جمع می‌شود</p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <input
            className="h-11 rounded-2xl bg-admin-soft px-4 text-sm outline-none focus:ring-2 focus:ring-admin-sky/40"
            placeholder="نام مشتری"
            value={draft.clientName}
            onChange={(e) => setDraft((d) => ({ ...d, clientName: e.target.value }))}
          />
          <input
            className="h-11 rounded-2xl bg-admin-soft px-4 text-sm outline-none focus:ring-2 focus:ring-admin-sky/40"
            placeholder="موبایل"
            value={draft.phone}
            onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
          />
          <input
            className="h-11 rounded-2xl bg-admin-soft px-4 text-sm outline-none focus:ring-2 focus:ring-admin-sky/40"
            placeholder="موضوع / ملک"
            value={draft.propertyTitle}
            onChange={(e) => setDraft((d) => ({ ...d, propertyTitle: e.target.value }))}
          />
          <input
            className="h-11 rounded-2xl bg-admin-soft px-4 text-sm outline-none focus:ring-2 focus:ring-admin-sky/40"
            placeholder="یادداشت"
            value={draft.notes}
            onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))}
          />
          <button
            type="button"
            disabled={saving}
            onClick={() => void createLead()}
            className="h-11 rounded-full bg-admin-sky text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "در حال ثبت..." : "ثبت لید جدید"}
          </button>
        </div>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      <div className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {grouped.map((column, columnIndex) => (
          <motion.section
            key={column.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columnIndex * 0.04 }}
            className="rounded-[1.5rem] bg-admin-card p-3 shadow-sm ring-1 ring-slate-200/70 sm:p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-admin-navy">{column.title}</h2>
              <span className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-admin-sky">
                {column.items.length}
              </span>
            </div>
            <div className="space-y-2.5">
              {column.items.map((lead) => (
                <article key={lead.id} className="rounded-2xl bg-admin-soft/90 p-3">
                  <p className="text-sm font-semibold text-admin-navy">{lead.clientName}</p>
                  <p className="mt-0.5 text-xs text-slate-500" dir="ltr">{lead.phone}</p>
                  <p className="mt-3 text-xs text-slate-600">{lead.propertyTitle || "درخواست عمومی"}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {COLUMNS.filter((item) => item.id !== lead.status).slice(0, 3).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => void moveLead(lead.id, item.id)}
                        className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200"
                      >
                        ← {item.title}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
              {column.items.length === 0 ? (
                <p className="rounded-2xl bg-admin-soft px-3 py-6 text-center text-xs text-slate-400">خالی</p>
              ) : null}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
