"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Building2,
  CalendarDays,
  ChevronDown,
  Users,
  Wallet,
} from "lucide-react";
import { AnimatedCounter, EASE, glass } from "@/components/agent/dashboard/shared";
import { cn } from "@/lib/utils";

type Metrics = {
  activeProperties: number;
  negotiationCount: number;
  assignedClients: number;
  highUrgencyClients: number;
  scheduledTours: number;
  todayTasks: number;
  estimatedCommissionLabel: string;
  estimatedCommission: number;
  commissionRate: number;
};

export default function MetricCards({ metrics }: { metrics: Metrics }) {
  const [commissionOpen, setCommissionOpen] = useState(false);

  const cards = [
    {
      key: "listings",
      label: "فایل‌های فعال من",
      value: metrics.activeProperties,
      badge: `${metrics.negotiationCount.toLocaleString("fa-IR")} در مذاکره`,
      badgeTone: "bg-amber-50 text-amber-800 ring-amber-200",
      icon: Building2,
      iconTone: "bg-emerald-50 text-emerald-700",
    },
    {
      key: "leads",
      label: "مشتریان پیگیر من",
      value: metrics.assignedClients,
      badge:
        metrics.highUrgencyClients > 0
          ? `${metrics.highUrgencyClients.toLocaleString("fa-IR")} فوری`
          : "پیگیری عادی",
      badgeTone:
        metrics.highUrgencyClients > 0
          ? "bg-rose-50 text-rose-700 ring-rose-200"
          : "bg-slate-100 text-slate-600 ring-slate-200",
      icon: Users,
      iconTone: "bg-sky-50 text-sky-700",
    },
    {
      key: "tours",
      label: "بازدیدهای برنامه‌ریزی‌شده",
      value: metrics.scheduledTours,
      badge: `${metrics.todayTasks.toLocaleString("fa-IR")} کار امروز`,
      badgeTone: "bg-violet-50 text-violet-700 ring-violet-200",
      icon: CalendarDays,
      iconTone: "bg-amber-50 text-amber-800",
    },
  ] as const;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => (
        <motion.article
          key={card.key}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + index * 0.06, duration: 0.45, ease: EASE }}
          whileHover={{ scale: 1.015, y: -2 }}
          className={`${glass} p-4 sm:p-5`}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                <AnimatedCounter value={card.value} />
              </p>
              <span
                className={cn(
                  "mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ring-1",
                  card.badgeTone,
                )}
              >
                {card.badge}
              </span>
            </div>
            <span
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-2xl",
                card.iconTone,
              )}
            >
              <card.icon className="h-5 w-5" strokeWidth={1.7} />
            </span>
          </div>
        </motion.article>
      ))}

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26, duration: 0.45, ease: EASE }}
        whileHover={{ scale: 1.015, y: -2 }}
        className={`${glass} p-4 sm:p-5`}
      >
        <button
          type="button"
          onClick={() => setCommissionOpen((v) => !v)}
          className="flex w-full items-start justify-between gap-3 text-start"
        >
          <div>
            <p className="text-xs text-slate-500">کمیسیون تخمینی ماه جاری</p>
            <p className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
              {metrics.estimatedCommissionLabel}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200">
              جزئیات
              <ChevronDown
                className={cn("h-3.5 w-3.5 transition", commissionOpen && "rotate-180")}
              />
            </span>
          </div>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
            <Wallet className="h-5 w-5" strokeWidth={1.7} />
          </span>
        </button>

        <AnimatePresence>
          {commissionOpen ? (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 rounded-2xl bg-slate-900 px-3.5 py-3 text-xs text-white/80">
                <p>
                  بر اساس فایل‌های در حال مذاکره · نرخ{" "}
                  {metrics.commissionRate.toLocaleString("fa-IR")}٪
                </p>
                <p className="mt-1 tabular-nums text-amber-300">
                  {metrics.estimatedCommission.toLocaleString("fa-IR")} تومان
                </p>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.article>
    </div>
  );
}
