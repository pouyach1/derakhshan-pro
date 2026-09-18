"use client";

import { useMemo } from "react";
import Link from "next/link";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import FreeScrollCarousel from "@/components/mobile/carousel/FreeScrollCarousel";
import PagingCarousel from "@/components/mobile/carousel/PagingCarousel";
import { siteConfig } from "@/config/siteConfig";
import type { PropertyRecord } from "@/server/db/store";

type ClientDashboardViewProps = {
  name: string;
  items: PropertyRecord[];
};

/**
 * داشبورد موکل — موبایل و دسکتاپ با همان الگوهای کاروسل/پیجینگ.
 */
export default function ClientDashboardView({ name, items }: ClientDashboardViewProps) {
  const featured = useMemo(() => {
    const flagged = items.filter((p) => p.isFeatured);
    return (flagged.length ? flagged : items).slice(0, 8);
  }, [items]);

  const recent = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""))
      .slice(0, 8);
  }, [items]);

  return (
    <div className="min-h-dvh bg-[#070C18] pb-16 pt-6 text-white lg:pt-10">
      <section className="rio-container rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 lg:p-8">
        <p className="text-[11px] font-semibold tracking-[0.16em] text-cyan-300 lg:text-xs">پنل موکل</p>
        <h1 className="mt-2 font-vazirmatn text-2xl font-black lg:text-3xl">سلام {name}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-400">
          فایل‌های منتشرشده {siteConfig.brand.nameFa} بر اساس پروفایل شما. برای بازدید روی هر فایل بزنید.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/listings"
            className="rounded-full bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950"
          >
            آرشیو کامل
          </Link>
          <Link
            href="/contact"
            className="rounded-full bg-white/5 px-4 py-2.5 text-sm text-slate-200 ring-1 ring-white/10"
          >
            مشاوره اختصاصی
          </Link>
        </div>
      </section>

      <section className="mt-8 lg:mt-12">
        <div className="rio-container mb-4 lg:mb-6">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300 lg:text-xs">برجسته</p>
          <h2 className="mt-1 font-vazirmatn text-lg font-black lg:text-2xl">ملک‌های ویژه برای شما</h2>
        </div>
        {featured.length === 0 ? (
          <p className="rio-container text-sm text-slate-500">فایلی برای نمایش نیست.</p>
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
      </section>

      <section className="mt-10 lg:mt-14">
        <div className="rio-container mb-4 lg:mb-6">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-cyan-300 lg:text-xs">به‌روز</p>
          <h2 className="mt-1 font-vazirmatn text-lg font-black lg:text-2xl">آخرین بازدیدها / جدیدترین‌ها</h2>
        </div>
        {recent.length === 0 ? (
          <p className="rio-container text-sm text-slate-500">فایلی برای نمایش نیست.</p>
        ) : (
          <PagingCarousel slideWidthRatio={{ mobile: 0.88, desktop: 0.5 }} gapPx={16}>
            {recent.map((item, index) => (
              <CompactPropertyCard
                key={item.id}
                item={item}
                variant="paging"
                priority={index === 0}
              />
            ))}
          </PagingCarousel>
        )}
      </section>
    </div>
  );
}
