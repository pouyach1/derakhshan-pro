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

function useMotionReady() {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !reduceMotion;
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
  const motionReady = useMotionReady();

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

      <div className="hidden min-h-dvh bg-[#F3F7FB] text-[#0B3A5C] lg:block">
        <section className="relative overflow-hidden px-6 pb-12 pt-32 xl:px-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_-10%,rgba(0,163,255,0.14),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_30%,rgba(11,58,92,0.06),transparent_45%)]" />
            {motionReady ? (
              <motion.div
                aria-hidden
                className="absolute -start-20 top-24 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl"
                animate={{ x: [0, 40, 0], opacity: [0.35, 0.65, 0.35] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </div>

          <div className="relative mx-auto max-w-7xl">
            <motion.div initial={false} animate={{ opacity: 1, y: 0 }} transition={IOS_PAGE_SPRING}>
              <p className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/80 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-sky-700 shadow-sm">
                <Sparkles className="h-3.5 w-3.5" />
                آرشیو اختصاصی
              </p>
              <h1 className="mt-6 max-w-4xl font-vazirmatn text-[clamp(2.2rem,4.5vw,3.75rem)] font-black leading-[1.2] tracking-tight text-[#0B3A5C]">
                فایل‌های قابل معامله
                <span className="mt-2 block text-sky-600">{siteConfig.brand.nameFa}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#0B3A5C]/65">
                جستجو، فیلتر و درخواست بازدید روی آگهی‌های منتشرشده — تجربه‌ای لوکس برای ارائه روی تلویزیون و جلسه حضوری.
              </p>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-center"
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...IOS_PAGE_SPRING, delay: 0.12 }}
            >
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute start-5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B3A5C]/35" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجوی عنوان، محله یا کد فایل..."
                  className="h-14 w-full rounded-full border border-[#0B3A5C]/10 bg-white pe-5 ps-12 text-sm text-[#0B3A5C] outline-none placeholder:text-[#0B3A5C]/40 shadow-[0_12px_40px_-28px_rgba(11,58,92,0.35)] transition focus:border-sky-400"
                />
              </div>
              <div className="flex gap-2 rounded-full border border-[#0B3A5C]/8 bg-white p-1.5 shadow-sm">
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
                          className="absolute inset-0 rounded-full bg-sky-500 shadow-[0_10px_28px_-12px_rgba(0,163,255,0.85)]"
                          transition={IOS_PAGE_SPRING}
                        />
                      ) : null}
                      <span className={active ? "relative text-white" : "relative text-[#0B3A5C]/65"}>
                        {label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.p
              className="mt-6 text-xs tracking-[0.14em] text-[#0B3A5C]/45"
              initial={false}
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
                  className="aspect-[4/5] animate-pulse rounded-[1.5rem] border border-[#0B3A5C]/8 bg-white"
                />
              ))
            ) : failed ? (
              <div className="sm:col-span-2 xl:col-span-3">
                <PublicLoadError onRetry={() => void load()} />
              </div>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-[#0B3A5C]/55 sm:col-span-2 xl:col-span-3">
                فایل منتشرشده‌ای مطابق جستجو نیست.
              </p>
            ) : (
              filtered.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={false}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    ...IOS_PAGE_SPRING,
                    delay: motionReady ? Math.min(index, 12) * 0.05 : 0,
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
