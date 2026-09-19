"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { siteConfig } from "@/config/siteConfig";
import PublicLoadError from "@/components/listings/PublicLoadError";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import MobileListingsView from "@/components/mobile/MobileListingsView";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import type { PropertyRecord } from "@/server/db/store";

type Filter = "all" | "sale" | "rent";

function logListingsError(error: unknown) {
  if (process.env.NODE_ENV === "development") {
    console.error("[listings]", error);
  }
}

const FILTERS = [
  ["all", "همه"],
  ["sale", "فروش"],
  ["rent", "اجاره"],
] as const;

export default function ListingsView() {
  const [items, setItems] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

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

      <div className="hidden min-h-dvh bg-[#050B14] text-white lg:block">
        {/* Cinematic archive hero */}
        <section className="relative overflow-hidden px-6 pb-12 pt-32 xl:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(0,163,255,0.22),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_40%,rgba(11,58,92,0.35),transparent_45%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050B14] to-transparent" />
            {!reduceMotion ? (
              <motion.div
                aria-hidden
                className="absolute -start-20 top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
                animate={{ x: [0, 40, 0], opacity: [0.35, 0.6, 0.35] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </div>

          <div className="relative mx-auto max-w-7xl">
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={IOS_PAGE_SPRING}
            >
              <p className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.22em] text-cyan-200">
                <Sparkles className="h-3.5 w-3.5" />
                آرشیو اختصاصی
              </p>
              <h1 className="mt-6 max-w-4xl font-vazirmatn text-[clamp(2.4rem,5vw,4.25rem)] font-black leading-[1.15] tracking-tight">
                فایل‌های قابل معامله
                <span className="mt-2 block bg-gradient-to-l from-cyan-200 via-sky-300 to-cyan-400 bg-clip-text text-transparent">
                  {siteConfig.brand.nameFa}
                </span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
                جستجو، فیلتر و درخواست بازدید روی آگهی‌های منتشرشده — تجربه‌ای سینمایی برای ارائه روی تلویزیون و جلسه حضوری.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-center"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_PAGE_SPRING, delay: 0.12 }}
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute start-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی عنوان، محله یا کد فایل..."
                  className="h-14 w-full rounded-full border border-white/12 bg-white/[0.05] pe-5 ps-12 text-sm outline-none placeholder:text-slate-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition focus:border-cyan-400/60 focus:bg-white/[0.07]"
                />
              </div>
              <div className="flex gap-2 rounded-full border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
                {FILTERS.map(([id, label]) => {
                  const active = filter === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFilter(id)}
                      className="relative rounded-full px-5 py-2.5 text-sm font-semibold"
                    >
                      {active ? (
                        <motion.span
                          layoutId="listings-filter-pill"
                          className="absolute inset-0 rounded-full bg-gradient-to-l from-cyan-300 to-sky-400 shadow-[0_10px_30px_-12px_rgba(0,163,255,0.9)]"
                          transition={IOS_PAGE_SPRING}
                        />
                      ) : null}
                      <span className={active ? "relative text-slate-950" : "relative text-slate-300"}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.p
              className="mt-6 text-xs tracking-[0.16em] text-slate-500"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              {loading
                ? "در حال آماده‌سازی آرشیو..."
                : `${filtered.length.toLocaleString("fa-IR")} فایل نمایش داده می‌شود`}
            </motion.p>
          </div>
        </section>

        <section className="relative px-6 pb-28 xl:px-10">
          <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[4/5] animate-pulse rounded-[1.5rem] border border-white/8 bg-white/[0.04]"
                />
              ))
            ) : failed ? (
              <div className="sm:col-span-2 xl:col-span-3">
                <PublicLoadError onRetry={() => void load()} />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-slate-400 sm:col-span-2 xl:col-span-3">
                فایل منتشرشده‌ای مطابق جستجو نیست.
              </p>
            ) : (
              filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={reduceMotion ? false : { opacity: 0, y: 32, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    ...IOS_PAGE_SPRING,
                    delay: Math.min(index, 12) * 0.05,
                  }}
                >
                  <CompactPropertyCard
                    item={item}
                    variant="featured"
                    priority={index < 3}
                    className="h-full"
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>
      </div>
    </>
  );
}
