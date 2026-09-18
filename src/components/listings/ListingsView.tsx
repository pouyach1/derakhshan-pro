"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bath, BedDouble, MapPin, Ruler, Search } from "lucide-react";
import { api } from "@/lib/api";
import { fallbackImage, formatToman, listingTypeLabel } from "@/lib/money";
import { siteConfig } from "@/config/siteConfig";
import PublicLoadError from "@/components/listings/PublicLoadError";
import MobileListingsView from "@/components/mobile/MobileListingsView";
import type { PropertyRecord } from "@/server/db/store";

type Filter = "all" | "sale" | "rent";

function logListingsError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("[listings]", error);
  }
}

export default function ListingsView() {
  const [items, setItems] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await api<{ items: PropertyRecord[] }>("/api/properties?pageSize=50");
      if (!res.ok) {
        logListingsError(res.error);
        setItems([]);
        setFailed(true);
        return;
      }
      setItems(res.data.items);
    } catch (error) {
      logListingsError(error);
      setItems([]);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesType = filter === "all" || item.listingType === filter;
      const q = query.trim();
      const matchesQuery =
        !q ||
        item.title.includes(q) ||
        item.location.includes(q) ||
        item.neighborhood.includes(q) ||
        item.code.includes(q);
      return matchesType && matchesQuery;
    });
  }, [items, filter, query]);

  return (
    <>
      <MobileListingsView
        items={items}
        loading={loading}
        failed={failed}
        onRetry={load}
      />

      <div className="hidden bg-[#070C18] text-white lg:block">
      <section className="relative overflow-hidden px-4 pb-10 pt-28 sm:px-6 lg:pt-32">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,240,255,0.16),_transparent_55%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-[0.22em] text-cyan-300">آرشیو فایل‌های فعال</p>
          <h1 className="mt-4 max-w-3xl font-vazirmatn text-3xl font-black leading-tight sm:text-5xl">
            فایل‌های قابل معامله {siteConfig.brand.nameFa}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            جستجو، فیلتر و درخواست بازدید روی آگهی‌های منتشرشده. فایل‌های نمونه را از پنل مدیریت با آگهی واقعی عوض کنید.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی عنوان، محله یا کد فایل..."
                className="h-12 w-full rounded-full border border-white/10 bg-white/5 pe-4 ps-11 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/60"
              />
            </div>
            <div className="flex gap-2">
              {(
                [
                  ["all", "همه"],
                  ["sale", "فروش"],
                  ["rent", "اجاره"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFilter(id)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    filter === id ? "bg-cyan-400 text-slate-950" : "bg-white/5 text-slate-300 ring-1 ring-white/10"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="text-sm text-slate-400">در حال بارگذاری فایل‌ها...</p>
          ) : failed ? (
            <PublicLoadError onRetry={() => void load()} />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-slate-400">فایل منتشرشده‌ای مطابق جستجو نیست.</p>
          ) : (
            filtered.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.04]"
              >
                <Link href={`/listings/${item.id}`} className="block">
                  <div className="relative h-52">
                    <Image
                      src={fallbackImage(item.imageUrl)}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <span className="absolute start-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] text-cyan-200 backdrop-blur">
                      {listingTypeLabel(item.listingType)}
                    </span>
                  </div>
                  <div className="space-y-3 p-5">
                    <p className="text-[11px] text-slate-500">{item.code}</p>
                    <h2 className="text-lg font-semibold">{item.title}</h2>
                    <p className="inline-flex items-center gap-1.5 text-sm text-slate-400">
                      <MapPin className="h-4 w-4 text-cyan-300" />
                      {item.location}
                    </p>
                    <p className="text-cyan-300">{formatToman(item.price, item.listingType)}</p>
                    <div className="flex gap-3 text-xs text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5" />
                        {item.bedrooms.toLocaleString("fa-IR")} خواب
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Bath className="h-3.5 w-3.5" />
                        {item.bathrooms.toLocaleString("fa-IR")} سرویس
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Ruler className="h-3.5 w-3.5" />
                        {item.areaSqm.toLocaleString("fa-IR")} متر
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </div>
      </section>
      </div>
    </>
  );
}
