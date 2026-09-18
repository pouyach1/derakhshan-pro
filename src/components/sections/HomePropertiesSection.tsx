"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import FreeScrollCarousel from "@/components/mobile/carousel/FreeScrollCarousel";
import PagingCarousel from "@/components/mobile/carousel/PagingCarousel";
import { PropertyCardSkeletonList } from "@/components/mobile/PropertySkeletons";
import { api } from "@/lib/api";
import type { PropertyRecord } from "@/server/db/store";

/**
 * بخش زنده فایل‌ها روی Home — کاملاً جدا از Hero.
 * موبایل و دسکتاپ: ویژه (free-scroll) + جدیدترین (paging) + گرید همه.
 */
export default function HomePropertiesSection() {
  const [items, setItems] = useState<PropertyRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ items: PropertyRecord[] }>("/api/properties?pageSize=24");
      if (res.ok) setItems(res.data.items);
      else setItems([]);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const featured = useMemo(() => {
    const flagged = items.filter((p) => p.isFeatured);
    return (flagged.length ? flagged : items).slice(0, 8);
  }, [items]);

  const newest = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, 8);
  }, [items]);

  const all = useMemo(() => items.slice(0, 8), [items]);

  return (
    <section
      className="relative overflow-hidden bg-[#070C18] py-12 text-white md:py-16 lg:py-20"
      aria-label="فایل‌های پیشنهادی"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,163,255,0.12),_transparent_55%)]" />

      <div className="relative space-y-12 lg:space-y-16">
        <div>
          <div className="rio-container mb-5 flex items-end justify-between gap-3 lg:mb-7">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300 lg:text-xs">ویژه</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-black lg:text-3xl">ملک‌های ویژه</h2>
              <p className="mt-2 hidden max-w-xl text-sm leading-7 text-slate-400 lg:block">
                فایل‌های برجسته را آزادانه بکشید؛ با رها کردن، نزدیک‌ترین کارت با اسپرینگ قفل می‌شود.
              </p>
            </div>
            <Link href="/listings" className="shrink-0 text-xs text-cyan-300 hover:text-cyan-200 lg:text-sm">
              آرشیو کامل
            </Link>
          </div>

          {loading ? (
            <div className="rio-container">
              <PropertyCardSkeletonList count={1} />
            </div>
          ) : featured.length === 0 ? (
            <p className="rio-container py-6 text-sm text-slate-400">فایل ویژه‌ای نیست.</p>
          ) : (
            <FreeScrollCarousel slideWidthRatio={{ mobile: 0.78, desktop: 0.34 }} gapPx={16}>
              {featured.map((item, index) => (
                <CompactPropertyCard
                  key={item.id}
                  item={item}
                  variant="featured"
                  priority={index === 0}
                />
              ))}
            </FreeScrollCarousel>
          )}
        </div>

        <div>
          <div className="rio-container mb-5 flex items-end justify-between gap-3 lg:mb-7">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300 lg:text-xs">تازه</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-black lg:text-3xl">جدیدترین‌ها</h2>
              <p className="mt-2 hidden max-w-xl text-sm leading-7 text-slate-400 lg:block">
                هر سوایپ دقیقاً یک فایل جلو می‌رود — بدون توقف در حالت میانی.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="rio-container">
              <PropertyCardSkeletonList count={1} />
            </div>
          ) : newest.length === 0 ? (
            <p className="rio-container py-6 text-sm text-slate-400">فایل جدیدی نیست.</p>
          ) : (
            <PagingCarousel slideWidthRatio={{ mobile: 0.88, desktop: 0.5 }} gapPx={16}>
              {newest.map((item, index) => (
                <CompactPropertyCard
                  key={item.id}
                  item={item}
                  variant="paging"
                  priority={index === 0}
                />
              ))}
            </PagingCarousel>
          )}
        </div>

        <div className="rio-container">
          <div className="mb-5 flex items-end justify-between gap-3 lg:mb-7">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300 lg:text-xs">آرشیو زنده</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-black lg:text-3xl">همه ملک‌ها</h2>
            </div>
            <Link href="/listings" className="text-xs text-cyan-300 hover:text-cyan-200 lg:text-sm">
              مشاهده همه
            </Link>
          </div>

          {loading ? (
            <PropertyCardSkeletonList count={4} />
          ) : all.length === 0 ? (
            <p className="py-8 text-sm text-slate-400">فعلاً فایلی برای نمایش نیست.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4 lg:gap-5">
              {all.map((item, index) => (
                <CompactPropertyCard
                  key={item.id}
                  item={item}
                  variant="grid"
                  priority={index < 2}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
