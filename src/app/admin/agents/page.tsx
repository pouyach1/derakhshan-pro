"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import AdvisorAvatar from "@/components/agents/AdvisorAvatar";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

type AgentRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  listedProperties: number;
  dealsClosed: number;
  status: "active" | "inactive" | "away";
  isActive: boolean;
};

const STATUS_LABEL: Record<AgentRow["status"], string> = {
  active: "فعال",
  away: "مرخصی",
  inactive: "غیرفعال",
};

export default function AgentsPage() {
  const reduceMotion = useReducedMotion();
  const [agents, setAgents] = useState<AgentRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      const res = await api<{ items: AgentRow[] }>("/api/agents");
      if (!res.ok) {
        setError(res.error.message);
        return;
      }
      setAgents(res.data.items);
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">تیم مشاوران</h1>
            <p className="mt-1 text-sm leading-6 text-slate-500">آگهی‌های فعال و معاملات بسته‌شده از دادهٔ زنده</p>
          </div>
          <span className="rounded-full bg-admin-soft px-3 py-1.5 text-xs font-medium text-admin-navy">
            {agents.length.toLocaleString("fa-IR")} مشاور
          </span>
        </div>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        {agents.map((agent, index) => (
          <motion.article
            key={agent.id}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.06, 0.24) }}
            className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <Link href={`/agents/${agent.id}`} className="shrink-0" aria-label={`پروفایل ${agent.name}`}>
                <AdvisorAvatar name={agent.name} avatarUrl={agent.avatarUrl} size="lg" />
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/agents/${agent.id}`}
                    className="truncate text-base font-semibold text-admin-navy transition hover:text-admin-sky"
                  >
                    {agent.name}
                  </Link>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1",
                      agent.status === "active"
                        ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                        : agent.status === "away"
                          ? "bg-amber-50 text-amber-700 ring-amber-200"
                          : "bg-slate-100 text-slate-500 ring-slate-200",
                    )}
                  >
                    {STATUS_LABEL[agent.status] ?? STATUS_LABEL.inactive}
                  </span>
                </div>
                <div className="mt-2 space-y-1">
                  <a
                    href={`tel:${agent.phone}`}
                    className="ios-tap-target flex items-center gap-1.5 text-xs text-slate-500"
                    dir="ltr"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0" />
                    {agent.phone}
                  </a>
                  {agent.email ? (
                    <a
                      href={`mailto:${agent.email}`}
                      className="ios-tap-target flex items-center gap-1.5 truncate text-xs text-slate-500"
                      dir="ltr"
                    >
                      <Mail className="h-3.5 w-3.5 shrink-0" />
                      {agent.email}
                    </a>
                  ) : null}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Stat label="آگهی فعال" value={agent.listedProperties.toLocaleString("fa-IR")} />
                  <Stat label="معامله شده" value={agent.dealsClosed.toLocaleString("fa-IR")} />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
        {agents.length === 0 && !error ? (
          <p className="col-span-full rounded-2xl bg-admin-soft px-4 py-10 text-center text-sm text-slate-400">
            مشاوری ثبت نشده
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-admin-soft px-3 py-2.5">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm font-semibold tabular-nums text-admin-navy">{value}</p>
    </div>
  );
}
