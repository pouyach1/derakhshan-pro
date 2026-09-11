"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CirclePlus, Eye, Handshake, Home } from "lucide-react";
import {
  getAgentDashboard,
  LISTING_STATUS_LABEL,
  type ListingStatus,
} from "@/config/dashboards";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const statusStyle: Record<ListingStatus, string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  negotiation: "bg-amber-50 text-amber-800 ring-amber-200",
  draft: "bg-slate-100 text-slate-600 ring-slate-200",
};

export default function AgentDashboardPage() {
  const data = getAgentDashboard("a1");

  const stats = [
    {
      label: "املاک ثبت‌شده من",
      value: data.propertiesCount.toLocaleString("fa-IR"),
      icon: Home,
      tone: "bg-sky-50 text-sky-700",
    },
    {
      label: "بازدید آگهی‌ها",
      value: data.totalViews.toLocaleString("fa-IR"),
      icon: Eye,
      tone: "bg-violet-50 text-violet-700",
    },
    {
      label: "معاملات موفق",
      value: data.successfulDeals.toLocaleString("fa-IR"),
      icon: Handshake,
      tone: "bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">داشبورد مشاور</h1>
          <p className="mt-1 text-sm text-slate-500">آمار شخصی آگهی‌ها، بازدیدها و معاملات شما</p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 rounded-full bg-admin-sky px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-500"
        >
          <CirclePlus className="h-4 w-4" />
          ثبت ملک جدید
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((item, index) => (
          <motion.article
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35, ease }}
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

      <section className="overflow-hidden rounded-[1.75rem] bg-admin-card shadow-sm ring-1 ring-slate-200/70">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5">
          <h2 className="text-base font-semibold text-admin-navy">آگهی‌های اخیر من</h2>
          <p className="mt-0.5 text-xs text-slate-500">آخرین املاک تحت مدیریت شما</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-admin-soft/70 text-xs text-slate-500">
                <th className="px-4 py-3 text-start font-medium sm:px-5">عنوان</th>
                <th className="px-4 py-3 text-start font-medium">موقعیت</th>
                <th className="px-4 py-3 text-start font-medium">قیمت</th>
                <th className="px-4 py-3 text-start font-medium">بازدید</th>
                <th className="px-4 py-3 text-start font-medium sm:px-5">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {data.listings.map((listing, index) => (
                <motion.tr
                  key={listing.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.04, duration: 0.3, ease }}
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-3.5 sm:px-5">
                    <div>
                      <p className="font-medium text-admin-navy">{listing.title}</p>
                      <p className="text-xs text-slate-400">{listing.updatedAt}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-600">{listing.location}</td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-700">{listing.price}</td>
                  <td className="px-4 py-3.5 tabular-nums text-slate-700">
                    {listing.views.toLocaleString("fa-IR")}
                  </td>
                  <td className="px-4 py-3.5 sm:px-5">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1",
                        statusStyle[listing.status],
                      )}
                    >
                      {LISTING_STATUS_LABEL[listing.status]}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
