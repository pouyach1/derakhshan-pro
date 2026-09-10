"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ADMIN_LEADS, type LeadStatus } from "@/config/admin";

const COLUMNS: { id: LeadStatus; title: string }[] = [
  { id: "new", title: "جدید" },
  { id: "contacted", title: "تماس گرفته‌شده" },
  { id: "viewing", title: "قرار بازدید" },
  { id: "closed", title: "نهایی‌شده" },
];

export default function LeadsPage() {
  const [leads, setLeads] = useState(ADMIN_LEADS);

  const grouped = useMemo(() => {
    return COLUMNS.map((column) => ({
      ...column,
      items: leads.filter((lead) => lead.status === column.id),
    }));
  }, [leads]);

  const moveLead = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((lead) => (lead.id === id ? { ...lead, status } : lead)));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">مدیریت سرنخ‌ها و درخواست‌ها</h1>
        <p className="mt-1 text-sm text-slate-500">پیگیری مشتری از اولین تماس تا نهایی شدن معامله</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        {grouped.map((column, columnIndex) => (
          <motion.section
            key={column.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: columnIndex * 0.06 }}
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
                <article
                  key={lead.id}
                  className="rounded-2xl bg-admin-soft/90 p-3 ring-1 ring-transparent transition hover:ring-admin-sky/30"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-admin-navy">{lead.clientName}</p>
                      <p className="mt-0.5 text-xs text-slate-500" dir="ltr">
                        {lead.phone}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-admin-sky ring-1 ring-sky-100">
                      {column.title}
                    </span>
                  </div>
                  <p className="mt-3 text-xs text-slate-600">ملک هدف: {lead.propertyTitle}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{lead.date}</p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {COLUMNS.filter((item) => item.id !== lead.status).map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => moveLead(lead.id, item.id)}
                        className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200 transition hover:text-admin-sky hover:ring-admin-sky/40"
                      >
                        → {item.title}
                      </button>
                    ))}
                  </div>
                </article>
              ))}
              {column.items.length === 0 ? (
                <p className="rounded-2xl bg-admin-soft px-3 py-6 text-center text-xs text-slate-400">
                  موردی در این ستون نیست
                </p>
              ) : null}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
