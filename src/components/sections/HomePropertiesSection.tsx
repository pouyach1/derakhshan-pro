"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import PropertyGalleryTrigger from "@/components/listings/PropertyGalleryTrigger";
import { PropertyCardSkeletonList } from "@/components/mobile/PropertySkeletons";
import { api } from "@/lib/api";
import { formatToman, listingTypeLabel } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { PropertyRecord } from "@/server/db/store";

/**
 * ویترین خانه — تم روشن برند (#F3F7FB / #0B3A5C).
 * یک فایل تازهٔ بزرگ + بقیه در گرید، بدون کاروسل تکراری روی پس‌زمینهٔ تیره.
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

  const newest = useMemo(() => {
    return [...items]
      .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
      .slice(0, 7);
  }, [items]);

  const lead = newest[0];
  const rest = newest.slice(1);

  return (
    <section className="bg-[#F3F7FB] py-16 text-[#0B3A5C] md:py-24" aria-label="فایل‌های تازه">
      <div className="rio-container">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 md:mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-sky-600">فایل‌های تازه</p>
            <h2 className="mt-2 font-vazirmatn text-3xl font-semibold leading-relaxed md:text-4xl">
              آخرین ملک‌های آماده‌ی معامله در آرشیو ما
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#0B3A5C]/70 md:text-base">
              ویلا، آپارتمان و دفاتر منتخب بالاشهر کرج، مستقیم از آرشیو خصوصی دفتر.
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
          >
            مشاهده آرشیو کامل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <PropertyCardSkeletonList count={4} />
        ) : !lead ? (
          <p className="rounded-[1.5rem] bg-white px-6 py-16 text-center text-sm text-[#0B3A5C]/55 ring-1 ring-[#0B3A5C]/8">
            فعلاً فایلی برای نمایش نیست.
          </p>
        ) : (
          <div className="space-y-5">
            <LeadCard item={lead} />
            {rest.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item) => (
                  <QuietCard key={item.id} item={item} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

function LeadCard({ item }: { item: PropertyRecord }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_70px_-42px_rgba(11,58,92,0.45)] ring-1 ring-[#0B3A5C]/8">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[16rem] bg-[#E8F1F8] lg:col-span-7 lg:min-h-[26rem]">
          <PropertyGalleryTrigger
            item={item}
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <span className="pointer-events-none absolute start-4 top-4 z-[5] rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-[#0B3A5C] shadow-sm">
            {listingTypeLabel(item.listingType)}
          </span>
        </div>
        <Link href={`/listings/${item.id}`} className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:col-span-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600">
            <MapPin className="h-3.5 w-3.5" />
            {item.neighborhood || item.location}
          </p>
          <h3 className="font-vazirmatn text-2xl font-semibold leading-relaxed text-[#0B3A5C] md:text-3xl">
            {item.title}
          </h3>
          <p className="text-lg font-semibold text-sky-600">{formatToman(item.price, item.listingType)}</p>
          <Specs item={item} />
          <span className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#0B3A5C]">
            مشاهده فایل
            <ArrowLeft className="h-4 w-4" />
          </span>
        </Link>
      </div>
    </article>
  );
}

function QuietCard({ item }: { item: PropertyRecord }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-[#0B3A5C]/8 transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-32px_rgba(11,58,92,0.4)]">
      <div className="relative aspect-[4/3] bg-[#E8F1F8]">
        <PropertyGalleryTrigger item={item} sizes="(max-width: 640px) 100vw, 33vw" />
        <span className="pointer-events-none absolute start-3 top-3 z-[5] rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#0B3A5C]">
          {listingTypeLabel(item.listingType)}
        </span>
      </div>
      <Link href={`/listings/${item.id}`} className="block space-y-2 p-4">
          <p className="line-clamp-1 text-[11px] text-[#0B3A5C]/55">{item.neighborhood || item.location}</p>
          <h3 className="line-clamp-2 min-h-[3.25rem] font-vazirmatn text-base font-semibold leading-7 text-[#0B3A5C]">
            {item.title}
          </h3>
          <p className="text-sm font-semibold text-sky-600">{formatToman(item.price, item.listingType)}</p>
          <Specs item={item} compact />
      </Link>
    </article>
  );
}

function Specs({ item, compact }: { item: PropertyRecord; compact?: boolean }) {
  const rows = [
    { icon: BedDouble, value: item.bedrooms, unit: "خواب" },
    { icon: Bath, value: item.bathrooms, unit: "سرویس" },
    { icon: Ruler, value: item.areaSqm, unit: "متر" },
  ];
  return (
    <div className={cn("grid grid-cols-3 border-t border-[#0B3A5C]/8 pt-3", compact ? "gap-1" : "gap-2")}>
      {rows.map((row) => (
        <div key={row.unit} className="text-center">
          <row.icon className="mx-auto h-4 w-4 text-sky-500" strokeWidth={1.75} />
          <p className="mt-1 text-sm font-bold tabular-nums text-[#0B3A5C]">
            {row.value.toLocaleString("fa-IR")}
          </p>
          <p className="text-[10px] text-[#0B3A5C]/45">{row.unit}</p>
        </div>
      ))}
    </div>
  );
}
