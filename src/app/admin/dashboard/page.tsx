"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BriefcaseBusiness,
  Building2,
  CirclePlus,
  Handshake,
  Users,
} from "lucide-react";
import FeaturedPropertyHero from "@/components/admin/FeaturedPropertyHero";
import MostViewedProperties from "@/components/admin/MostViewedProperties";
import {
  AGENT_PERFORMANCE,
  AGENT_STATUS_LABEL,
  PLATFORM_STATS,
  type AgentStatus,
} from "@/config/dashboards";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const statusStyle: Record<AgentStatus, string> = {
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  away: "bg-amber-50 text-amber-700 ring-amber-200",
  inactive: "bg-slate-100 text-slate-500 ring-slate-200",
};

const stats = [
  {
    label: "کل املاک",
    value: PLATFORM_STATS.totalProperties.toLocaleString("fa-IR"),
    icon: Building2,
    tone: "bg-sky-50 text-sky-700",
  },
  {
    label: "مشاوران فعال",
    value: PLATFORM_STATS.activeAgents.toLocaleString("fa-IR"),
    icon: BriefcaseBusiness,
    tone: "bg-violet-50 text-violet-700",
  },
  {
    label: "کاربران ثبت‌شده",
    value: PLATFORM_STATS.registeredClients.toLocaleString("fa-IR"),
    icon: Users,
    tone: "bg-amber-50 text-amber-800",
  },
  {
    label: "معاملات ماه",
    value: PLATFORM_STATS.monthlyDeals.toLocaleString("fa-IR"),
    icon: Handshake,
    tone: "bg-emerald-50 text-emerald-700",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex min-w-0 flex-col gap-8" data-dashboard-main>
      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">داشبورد مدیریت</h1>
            <p className="mt-1 text-sm text-slate-500">نمای کلی عملکرد پلتفرم و تیم مشاوران</p>
          </div>
          <Link
            href="/admin/agents"
            className="inline-flex items-center gap-2 rounded-full bg-admin-sky px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
          >
            <CirclePlus className="h-4 w-4" />
            افزودن مشاور جدید
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.35, ease }}
              className="rounded-[1.5rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">{item.label}</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-admin-navy">{item.value}</p>
                </div>
                <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", item.tone)}>
                  <item.icon className="h-5 w-5" strokeWidth={1.7} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[1.75rem] bg-admin-card shadow-sm ring-1 ring-slate-200/70">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold text-admin-navy">عملکرد مشاوران</h2>
          <p className="mt-0.5 text-xs text-slate-500">آگهی‌های فعال، معاملات بسته‌شده و وضعیت</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-admin-soft/70 text-xs text-slate-500">
                <th className="px-4 py-3 text-start font-medium sm:px-5">مشاور</th>
                <th className="px-4 py-3 text-start font-medium">آگهی فعال</th>
                <th className="px-4 py-3 text-start font-medium">معاملات بسته‌شده</th>
                <th className="px-4 py-3 text-start font-medium sm:px-5">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {AGENT_PERFORMANCE.map((agent, index) => (
                <motion.tr
                  key={agent.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 + index * 0.04, duration: 0.3, ease }}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-3.5 sm:px-5">
                    <div className="flex items-center gap-3">
                      <Image
                        src={agent.avatar}
                        alt={agent.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
                      />
                      <span className="font-medium text-admin-navy">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-700">
                    {agent.activeListings.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-700">
                    {agent.closedDeals.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                        statusStyle[agent.status],
                      )}
                    >
                      {AGENT_STATUS_LABEL[agent.status]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <FeaturedPropertyHero />
      <div className="relative z-0">
        <MostViewedProperties />
      </div>
    </div>
  );
}
