"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ADMIN_AGENTS } from "@/config/admin";

export default function AgentsPage() {
  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">تیم مشاوران</h1>
        <p className="mt-1 text-sm text-slate-500">آگهی‌های فعال، معاملات بسته‌شده و سهم کمیسیون هر نفر</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {ADMIN_AGENTS.map((agent, index) => (
          <motion.article
            key={agent.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07, duration: 0.35 }}
            whileHover={{ y: -4 }}
            className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-xl hover:shadow-sky-500/10 hover:ring-admin-sky/40 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <Image
                src={agent.avatar}
                alt={agent.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover ring-2 ring-white shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-admin-navy">{agent.name}</h2>
                    <p className="text-xs text-slate-500">مشاور املاک · {agent.city}</p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full bg-admin-soft px-3 py-1.5 text-xs font-medium text-admin-navy transition hover:bg-admin-sky hover:text-white"
                  >
                    پیامک
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Stat label="آگهی فعال" value={String(agent.listedProperties)} />
                  <Stat label="معامله شده" value={String(agent.dealsClosed)} />
                  <Stat label="سهم کمیسیون" value={agent.commission} accent />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-2xl bg-admin-soft px-3 py-3">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold ${accent ? "text-admin-sky" : "text-admin-navy"}`}>{value}</p>
    </div>
  );
}
