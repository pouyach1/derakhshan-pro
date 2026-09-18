"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { fallbackImage, formatToman, propertyStatusLabel } from "@/lib/money";
import type { PropertyRecord, PropertyStatus } from "@/server/db/store";

const STATUS_FILTERS: { id: "all" | PropertyStatus; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "published", label: "منتشرشده" },
  { id: "draft", label: "پیش‌نویس" },
  { id: "negotiation", label: "مذاکره" },
  { id: "sold", label: "واگذار شده" },
  { id: "archived", label: "بایگانی" },
];

export default function PropertiesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | PropertyStatus>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ pageSize: "50" });
    if (query) params.set("q", query);
    if (status !== "all") params.set("status", status);
    const res = await api<{ items: PropertyRecord[] }>(`/api/properties?${params}`);
    if (!res.ok) {
      setError(res.error.message);
      setLoading(false);
      return;
    }
    setProperties(res.data.items);
    setError("");
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void load();
    }, 180);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  async function remove(id: string) {
    if (!confirm("این فایل آرشیو شود؟")) return;
    const res = await api(`/api/properties/${id}`, { method: "DELETE" });
    if (res.ok) setProperties((prev) => prev.filter((item) => item.id !== id));
  }

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
            افزودن ملک جدید
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="جستجوی عنوان، کد یا موقعیت..."
            className="h-11 min-w-[220px] flex-1 rounded-full bg-admin-soft px-4 text-sm text-admin-navy outline-none focus:ring-2 focus:ring-admin-sky/40"
          />
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setStatus(filter.id)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-medium transition sm:text-sm",
                  status === filter.id ? "bg-admin-navy text-white" : "bg-admin-soft text-slate-600",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="ms-auto flex items-center gap-1 rounded-full bg-admin-soft p-1">
            <button type="button" onClick={() => setViewMode("grid")} className={cn("h-8 w-8 rounded-full", viewMode === "grid" && "bg-admin-navy text-white")}>⊞</button>
            <button type="button" onClick={() => setViewMode("list")} className={cn("h-8 w-8 rounded-full", viewMode === "list" && "bg-admin-navy text-white")}>≡</button>
          </div>
        </div>
      </div>

      {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">در حال بارگذاری...</p> : null}

      <div className={cn(viewMode === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-3")}>
        {properties.map((property, index) => (
          <motion.article
            key={property.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className={cn(
              "overflow-hidden rounded-[1.5rem] bg-admin-card shadow-sm ring-1 ring-slate-200/70",
              viewMode === "list" && "flex flex-col sm:flex-row",
            )}
          >
            <div className={cn("relative bg-admin-soft", viewMode === "grid" ? "h-44" : "h-40 sm:w-52")}>
              <Image src={fallbackImage(property.imageUrl)} alt={property.title} fill className="object-cover" sizes="400px" />
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs text-slate-400">{property.code}</p>
                  <h2 className="text-base font-semibold text-admin-navy">{property.title}</h2>
                  <p className="mt-1 text-sm text-slate-500">{property.location}</p>
                </div>
                <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] text-admin-sky">
                  {propertyStatusLabel(property.status)}
                </span>
              </div>
              <p className="text-sm font-semibold text-admin-sky">{formatToman(property.price, property.listingType)}</p>
              <div className="mt-auto flex items-center gap-2">
                <Link href={`/listings/${property.id}`} className="rounded-xl border border-slate-200 bg-white p-2" aria-label="مشاهده">
                  <Eye className="h-4 w-4 text-sky-500" />
                </Link>
                <Link href={`/admin/properties/new?id=${property.id}`} className="rounded-xl border border-slate-200 bg-white p-2" aria-label="ویرایش">
                  <Pencil className="h-4 w-4 text-slate-600" />
                </Link>
                <button type="button" onClick={() => remove(property.id)} className="rounded-xl border border-slate-200 bg-white p-2" aria-label="حذف">
                  <Trash2 className="h-4 w-4 text-rose-500" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
