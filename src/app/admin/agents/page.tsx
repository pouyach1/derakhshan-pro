"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { fallbackImage } from "@/lib/money";

type AgentRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  listedProperties: number;
  dealsClosed: number;
};

export default function AgentsPage() {
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
        <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">تیم مشاوران</h1>
        <p className="mt-1 text-sm text-slate-500">آگهی‌های فعال و معاملات بسته‌شده از دادهٔ زنده</p>
      </div>
      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        {agents.map((agent, index) => (
          <motion.article
            key={agent.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5"
          >
            <div className="flex items-start gap-3">
              <Image
                src={fallbackImage(agent.avatarUrl)}
                alt={agent.name}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-admin-navy">{agent.name}</h2>
                <p className="text-xs text-slate-500" dir="ltr">{agent.phone}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Stat label="آگهی فعال" value={String(agent.listedProperties)} />
                  <Stat label="معامله شده" value={String(agent.dealsClosed)} />
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-admin-soft px-3 py-2">
      <p className="text-[11px] text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-admin-navy">{value}</p>
    </div>
  );
}
