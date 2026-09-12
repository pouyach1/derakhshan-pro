"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Sparkles, UserPlus } from "lucide-react";
import type { AgentCrmProfile } from "@/config/agent-crm";
import { AnimatedCounter, EASE, glass } from "@/components/agent/dashboard/shared";

type HeroBannerProps = {
  profile: AgentCrmProfile;
  targetProgress: number;
  monthlyClosedLabel: string;
  monthlyTargetLabel: string;
};

export default function HeroBanner({
  profile,
  targetProgress,
  monthlyClosedLabel,
  monthlyTargetLabel,
}: HeroBannerProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className={`${glass} relative overflow-hidden p-5 sm:p-7`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-amber-300/25 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <div className="relative shrink-0">
            <div
              className="h-16 w-16 rounded-2xl bg-cover bg-center shadow-lg ring-2 ring-white sm:h-20 sm:w-20"
              style={{ backgroundImage: `url(${profile.avatar})` }}
            />
            <span className="absolute -bottom-1 -start-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            </span>
          </div>
          <div>
            <p className="text-xs text-slate-500 sm:text-sm">{profile.title}</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 sm:text-2xl lg:text-3xl">
              سلام، {profile.name}
            </h1>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200/80 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              {profile.rankLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="min-w-[13rem] rounded-2xl bg-slate-900 px-4 py-3 text-white shadow-lg shadow-slate-900/20">
            <div className="flex items-center justify-between gap-3 text-[11px] text-white/60">
              <span>هدف ماهانه کمیسیون</span>
              <span className="tabular-nums text-amber-300">
                <AnimatedCounter value={targetProgress} />٪
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-amber-300"
                initial={{ width: 0 }}
                animate={{ width: `${targetProgress}%` }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              />
            </div>
            <p className="mt-2 text-xs text-white/70">
              {monthlyClosedLabel}
              <span className="text-white/40"> از </span>
              {monthlyTargetLabel}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/agent/properties?add=1"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700"
            >
              <PlusCircle className="h-4 w-4" />
              + ثبت فایل جدید
            </Link>
            <Link
              href="/agent/clients?add=1"
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200/80 transition hover:bg-slate-50"
            >
              <UserPlus className="h-4 w-4" />
              + مشتری جدید
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
