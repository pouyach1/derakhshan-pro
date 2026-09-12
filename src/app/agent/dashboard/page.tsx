"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  CirclePlus,
  Calculator,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import {
  calcCommission,
  formatBillion,
  getAgentCrmMetrics,
  getAgentProfile,
  getAgentProperties,
} from "@/config/agent-crm";
import { useAgentScope } from "@/hooks/useAgentScope";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function AnimatedCounter({ value, duration = 900 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className="tabular-nums">{display.toLocaleString("fa-IR")}</span>;
}

export default function AgentDashboardPage() {
  const agentId = useAgentScope();
  const profile = getAgentProfile(agentId);
  const metrics = getAgentCrmMetrics(agentId);
  const recent = getAgentProperties(agentId).slice(0, 4);

  const [priceInput, setPriceInput] = useState("18000000000");
  const price = Number(priceInput) || 0;
  const commission = calcCommission(price, metrics.commissionRate);

  const stats = [
    {
      label: "املاک فعال من",
      value: metrics.activeProperties,
      hint: "با آیکون ملک و تعداد",
      icon: Building2,
      tone: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "مشتریان و لیدها",
      value: metrics.assignedClients,
      hint: "تعداد مشتریان در دست پیگیری",
      icon: Users,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "بازدیدهای زمان‌بندی‌شده",
      value: metrics.scheduledTours,
      hint: "تعداد بازدیدهای امروز/این هفته",
      icon: CalendarDays,
      tone: "bg-amber-50 text-amber-800",
    },
    {
      label: "تخمین کمیسیون ماه",
      value: null as number | null,
      display: metrics.estimatedCommissionLabel,
      hint: "تخمین کمیسیون این ماه",
      icon: Wallet,
      tone: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease }}
        className="flex flex-wrap items-center justify-between gap-4 rounded-[1.75rem] border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-6"
      >
        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-2xl bg-cover bg-center ring-2 ring-white shadow-md"
            style={{ backgroundImage: `url(${profile.avatar})` }}
            aria-hidden
          />
          <div>
            <p className="text-xs text-slate-500">{profile.title}</p>
            <h1 className="mt-0.5 text-xl font-semibold text-slate-900 sm:text-2xl">
              سلام، {profile.name}
            </h1>
            <span className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200/80">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Online &amp; Active
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/agent/properties?add=1"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
          >
            <CirclePlus className="h-4 w-4" />
            Register New Property
          </Link>
          <Link
            href="/agent/clients?add=1"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/70 transition hover:bg-slate-50"
          >
            <UserPlus className="h-4 w-4" />
            Add Client
          </Link>
        </div>
      </motion.section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35, ease }}
            whileHover={{ scale: 1.02 }}
            className="rounded-[1.5rem] border border-slate-200/60 bg-white/80 p-4 shadow-sm backdrop-blur-md sm:p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {item.value !== null ? <AnimatedCounter value={item.value} /> : item.display}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">{item.hint}</p>
              </div>
              <span className={cn("flex h-10 w-10 items-center justify-center rounded-2xl", item.tone)}>
                <item.icon className="h-5 w-5" strokeWidth={1.7} />
              </span>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.35, ease }}
          className="rounded-[1.75rem] border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-6"
        >
          <div className="mb-4 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <Calculator className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-slate-900">ماشین‌حساب کمیسیون</h2>
              <p className="text-xs text-slate-500">
                ورودی قیمت ملک ← محاسبه حق‌الزحمه طبق درصد توافقی ({metrics.commissionRate.toLocaleString("fa-IR")}٪)
              </p>
            </div>
          </div>

          <label className="block text-sm text-slate-600">
            قیمت ملک (تومان)
            <input
              type="number"
              min={0}
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200/80 bg-[#F1EFEA]/60 px-4 py-3 text-sm outline-none ring-emerald-500/0 transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </label>

          <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-4 text-white">
            <p className="text-xs text-white/60">حق‌الزحمه تخمینی</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatBillion(commission)}</p>
            <p className="mt-1 text-xs text-emerald-300">
              {commission.toLocaleString("fa-IR")} تومان
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35, ease }}
          className="rounded-[1.75rem] border border-slate-200/60 bg-white/80 p-5 shadow-sm backdrop-blur-md sm:p-6"
        >
          <h2 className="text-base font-semibold text-slate-900">املاک اخیر من</h2>
          <p className="mt-0.5 text-xs text-slate-500">فقط موجودی اختصاصی شما</p>
          <ul className="mt-4 space-y-3">
            {recent.map((property) => (
              <li
                key={property.id}
                className="flex items-center gap-3 rounded-2xl bg-[#F1EFEA]/70 p-2.5 ring-1 ring-slate-200/50"
              >
                <div
                  className="h-12 w-12 shrink-0 rounded-xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${property.image})` }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{property.title}</p>
                  <p className="text-xs text-slate-500">{property.location}</p>
                </div>
                <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                  {property.priceLabel}
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/agent/properties"
            className="mt-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            مشاهده همه املاک ←
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
