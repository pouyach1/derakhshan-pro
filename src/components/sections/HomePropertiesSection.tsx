"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import PropertyGalleryTrigger from "@/components/listings/PropertyGalleryTrigger";
import AgentProfileLink from "@/components/agents/AgentProfileLink";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import { PropertyCardSkeletonList } from "@/components/mobile/PropertySkeletons";
import { api } from "@/lib/api";
import { listingTypeLabel } from "@/lib/money";
import PropertyPrice from "@/components/listings/PropertyPrice";
import { cn } from "@/lib/utils";
import type { PropertyWithAgent } from "@/server/services/agents-public";

/**
 * ویترین خانه — تم روشن برند (#F3F7FB / #0B3A5C).
 * موبایل: گرید ۲ ستونه جمع‌وجور · دسکتاپ: لید بزرگ + گرید.
 */
export default function HomePropertiesSection() {
  const [items, setItems] = useState<PropertyWithAgent[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api<{ items: PropertyWithAgent[] }>("/api/properties?pageSize=24");
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
      .slice(0, 8);
  }, [items]);

  const lead = newest[0];
  const rest = newest.slice(1);

  return (
    <section className="bg-[#F3F7FB] py-12 text-[#0B3A5C] md:py-24" aria-label="فایل‌های تازه">
      <div className="rio-container">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-10 md:gap-4">
          <div className="max-w-2xl">
            <h2 className="font-vazirmatn text-2xl font-semibold leading-relaxed md:text-4xl">
              فایل‌های تازه
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-[#0B3A5C]/70 md:mt-3 md:text-base">
              آخرین ملک‌های آماده‌ی معامله در آرشیو ما
            </p>
          </div>
          <Link
            href="/listings"
            className="inline-flex items-center gap-2 rounded-full bg-[#0B3A5C] px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600 md:px-5 md:py-2.5 md:text-sm"
          >
            مشاهده آرشیو کامل ←
          </Link>
        </div>

        {loading ? (
          <PropertyCardSkeletonList count={4} />
        ) : !lead ? (
          <p className="rounded-[1.5rem] bg-white px-6 py-16 text-center text-sm text-[#0B3A5C]/55 ring-1 ring-[#0B3A5C]/8">
            فعلاً فایلی برای نمایش نیست.
          </p>
        ) : (
          <>
            {/* موبایل / تبلت کوچک: دو ستون */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:hidden">
              {newest.map((item, index) => (
                <CompactPropertyCard
                  key={item.id}
                  item={item}
                  variant="grid"
                  priority={index < 2}
                />
              ))}
            </div>

            {/* دسکتاپ: لید + گرید */}
            <div className="hidden space-y-5 lg:block">
              <LeadCard item={lead} />
              {rest.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((item) => (
                    <QuietCard key={item.id} item={item} />
                  ))}
                </div>
              ) : null}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function LeadCard({ item }: { item: PropertyWithAgent }) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_28px_70px_-42px_rgba(11,58,92,0.45)] ring-1 ring-[#0B3A5C]/8">
      <div className="grid lg:grid-cols-12">
        <div className="relative min-h-[16rem] bg-[#E8F1F8] lg:col-span-7 lg:min-h-[26rem]">
          <PropertyGalleryTrigger
            item={item}
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
          />
          <span className="pointer-events-none absolute start-4 top-4 z-[5] rounded-full bg-white px-3 py-1 text-[11px] font-bold text-[#0B3A5C] shadow-sm">
            {listingTypeLabel(item.listingType)}
          </span>
        </div>
        <div className="flex flex-col justify-center gap-4 p-6 md:p-10 lg:col-span-5">
          <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700">
            <MapPin className="h-3.5 w-3.5" />
            {item.neighborhood || item.location}
          </p>
          <Link href={`/listings/${item.id}`}>
            <h3 className="font-vazirmatn text-2xl font-bold leading-relaxed text-[#0B3A5C] md:text-3xl">
              {item.title}
            </h3>
          </Link>
          <PropertyPrice
            price={item.price}
            listingType={item.listingType}
            priceVisible={item.priceVisible}
            className="mt-3 block text-xl font-bold text-sky-700"
          />
          {item.agent ? <AgentProfileLink agent={item.agent} /> : null}
          <Specs item={item} />
          <Link
            href={`/listings/${item.id}`}
            className="mt-2 inline-flex w-fit items-center gap-2 text-sm font-bold text-[#0B3A5C]"
          >
            مشاهده فایل
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

function QuietCard({ item }: { item: PropertyWithAgent }) {
  return (
    <article className="overflow-hidden rounded-[1.4rem] bg-white ring-1 ring-[#0B3A5C]/8 transition hover:-translate-y-0.5 hover:shadow-[0_22px_50px_-32px_rgba(11,58,92,0.4)]">
      <div className="relative aspect-[4/3] bg-[#E8F1F8]">
        <PropertyGalleryTrigger item={item} sizes="(max-width: 640px) 100vw, 33vw" />
        <span className="pointer-events-none absolute start-3 top-3 z-[5] rounded-full bg-white px-2.5 py-1 text-[10px] font-bold text-[#0B3A5C]">
          {listingTypeLabel(item.listingType)}
        </span>
      </div>
      <div className="space-y-2.5 p-4">
        <p className="line-clamp-1 text-xs font-semibold text-[#0B3A5C]/70">
          {item.neighborhood || item.location}
        </p>
        <Link href={`/listings/${item.id}`} className="block space-y-2">
          <h3 className="line-clamp-2 min-h-[3.25rem] font-vazirmatn text-base font-bold leading-7 text-[#0B3A5C]">
            {item.title}
          </h3>
        </Link>
        <PropertyPrice
          price={item.price}
          listingType={item.listingType}
          priceVisible={item.priceVisible}
          compact
          className="block text-base font-bold text-sky-700"
        />
        {item.agent ? <AgentProfileLink agent={item.agent} showTitle={false} /> : null}
        <Specs item={item} compact />
        <Link
          href={`/listings/${item.id}`}
          className="inline-flex items-center gap-1.5 pt-1 text-xs font-bold text-[#0B3A5C]"
        >
          مشاهده فایل
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

function Specs({ item, compact }: { item: PropertyWithAgent; compact?: boolean }) {
  const rows = [
    { icon: BedDouble, value: item.bedrooms, unit: "خواب" },
    { icon: Bath, value: item.bathrooms, unit: "سرویس" },
    { icon: Ruler, value: item.areaSqm, unit: "متر" },
  ];
  return (
    <div className={cn("grid grid-cols-3 border-t border-[#0B3A5C]/10 pt-3", compact ? "gap-1" : "gap-2")}>
      {rows.map((row) => (
        <div key={row.unit} className="text-center">
          <row.icon className="mx-auto h-4 w-4 text-sky-600" strokeWidth={1.75} />
          <p className="mt-1 text-sm font-bold tabular-nums text-[#0B3A5C]">
            {row.value.toLocaleString("fa-IR")}
          </p>
          <p className="text-[10px] font-semibold text-[#0B3A5C]/65">{row.unit}</p>
        </div>
      ))}
    </div>
  );
}
