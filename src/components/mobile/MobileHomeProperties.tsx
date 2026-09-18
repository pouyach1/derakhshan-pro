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
 * بخش موبایل Home: ویژه (آزاد) + جدیدترین (پیجینگ) + گرید همه.
 * دسکتاپ: مخفی (lg:hidden).
 */
export default function MobileHomeProperties() {
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
    <section className="bg-[#070C18] py-10 text-white lg:hidden" aria-label="فایل‌های پیشنهادی موبایل">
      <div className="space-y-10">
        <div>
          <div className="mb-4 flex items-end justify-between gap-3 px-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300">ویژه</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-black">ملک‌های ویژه</h2>
            </div>
            <Link href="/listings" className="text-xs text-cyan-300">
              آرشیو
            </Link>
          </div>

          {loading ? (
            <div className="px-4">
              <PropertyCardSkeletonList count={1} />
            </div>
          ) : featured.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-400">فایل ویژه‌ای نیست.</p>
          ) : (
            <FreeScrollCarousel slideWidthRatio={0.78} gapPx={14}>
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
          <div className="mb-4 flex items-end justify-between gap-3 px-4">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300">تازه</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-black">جدیدترین‌ها</h2>
            </div>
          </div>

          {loading ? (
            <div className="px-4">
              <PropertyCardSkeletonList count={1} />
            </div>
          ) : newest.length === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-400">فایل جدیدی نیست.</p>
          ) : (
            <PagingCarousel slideWidthRatio={0.88} gapPx={12}>
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

        <div className="px-4">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300">آرشیو زنده</p>
              <h2 className="mt-1 font-vazirmatn text-xl font-black">همه ملک‌ها</h2>
            </div>
            <Link href="/listings" className="text-xs text-cyan-300">
              مشاهده همه
            </Link>
          </div>

          {loading ? (
            <PropertyCardSkeletonList count={4} />
          ) : all.length === 0 ? (
            <p className="py-8 text-sm text-slate-400">فعلاً فایلی برای نمایش نیست.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
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
