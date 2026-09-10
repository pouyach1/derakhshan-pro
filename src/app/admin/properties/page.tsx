"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { MANAGED_PROPERTIES, type PropertyStatus } from "@/config/admin";
import { cn } from "@/lib/utils";

const STATUS_FILTERS: { id: "all" | PropertyStatus; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "published", label: "منتشرشده" },
  { id: "draft", label: "پیش‌نویس" },
  { id: "archived", label: "بایگانی" },
];

const STATUS_LABEL: Record<PropertyStatus, string> = {
  published: "منتشرشده",
  draft: "پیش‌نویس",
  archived: "بایگانی",
};

export default function PropertiesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | PropertyStatus>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const properties = useMemo(() => {
    return MANAGED_PROPERTIES.filter((property) => {
      const matchesStatus = status === "all" || property.status === status;
      const matchesQuery =
        !query ||
        property.title.includes(query) ||
        property.code.includes(query) ||
        property.location.includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [query, status]);

  return (
    <div className="space-y-4">
      <div className="rounded-[1.75rem] bg-admin-card p-4 shadow-sm ring-1 ring-slate-200/70 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold text-admin-navy sm:text-2xl">مدیریت املاک</h1>
            <p className="mt-1 text-sm text-slate-500">لیست، ویرایش و انتشار آگهی‌های فعال</p>
          </div>
          <Link
            href="/admin/properties/new"
            className="inline-flex items-center gap-2 rounded-full bg-admin-sky px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-sky-500/25 transition hover:bg-sky-500"
          >
            <PlusIcon />
            افزودن ملک جدید
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="جستجوی عنوان، کد یا موقعیت..."
              className="h-11 w-full rounded-full bg-admin-soft pe-4 ps-10 text-sm text-admin-navy outline-none ring-1 ring-transparent transition placeholder:text-slate-400 focus:bg-white focus:ring-admin-sky/50"
            />
            <span className="pointer-events-none absolute start-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <SearchIcon />
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatus(filter.id)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-medium transition sm:text-sm",
                  status === filter.id
                    ? "bg-admin-navy text-white"
                    : "bg-admin-soft text-slate-600 hover:bg-slate-200/80",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="ms-auto flex items-center gap-1 rounded-full bg-admin-soft p-1">
            <button
              type="button"
              aria-label="نمای کارت"
              onClick={() => setViewMode("grid")}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm",
                viewMode === "grid" ? "bg-admin-navy text-white" : "text-slate-500",
              )}
            >
              ⊞
            </button>
            <button
              type="button"
              aria-label="نمای لیست"
              onClick={() => setViewMode("list")}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm",
                viewMode === "list" ? "bg-admin-navy text-white" : "text-slate-500",
              )}
            >
              ≡
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          viewMode === "grid"
            ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
            : "flex flex-col gap-3",
        )}
      >
        {properties.map((property, index) => (
          <motion.article
            key={property.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.35 }}
            className={cn(
              "overflow-hidden rounded-[1.5rem] bg-admin-card shadow-sm ring-1 ring-slate-200/70 transition hover:shadow-lg hover:shadow-sky-500/10 hover:ring-admin-sky/40",
              viewMode === "list" && "flex flex-col sm:flex-row",
            )}
          >
            <div
              className={cn(
                "relative overflow-hidden bg-admin-soft",
                viewMode === "grid" ? "h-44" : "h-40 sm:h-auto sm:w-52",
              )}
            >
              <Image src={property.image} alt={property.title} fill className="object-cover" sizes="400px" />
              <span className="absolute bottom-3 start-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-admin-navy">
                {property.views}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">{property.code}</p>
                  <h2 className="text-base font-semibold text-admin-navy">{property.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{property.location}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-medium",
                    property.status === "published" && "bg-sky-50 text-admin-sky",
                    property.status === "draft" && "bg-amber-50 text-amber-600",
                    property.status === "archived" && "bg-slate-100 text-slate-500",
                  )}
                >
                  {STATUS_LABEL[property.status]}
                </span>
              </div>

              <p className="text-sm font-semibold text-admin-sky">{property.price}</p>

              <div className="mt-auto flex items-center gap-2">
                <QuickAction label="مشاهده">
                  <Eye className="h-4 w-4 text-sky-500" strokeWidth={1.9} />
                </QuickAction>
                <QuickAction label="ویرایش">
                  <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={1.9} />
                </QuickAction>
                <QuickAction label="حذف">
                  <Trash2 className="h-4 w-4 text-rose-500/80 transition-colors group-hover/action:text-rose-600" strokeWidth={1.9} />
                </QuickAction>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function QuickAction({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="group/action inline-flex items-center justify-center rounded-xl border border-slate-200/50 bg-white/60 p-2 shadow-sm backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white active:scale-95 dark:border-white/10 dark:bg-slate-800/60 dark:hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
