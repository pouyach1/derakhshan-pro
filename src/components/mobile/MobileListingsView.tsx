"use client";

import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";
import { Bath, BedDouble, MapPin, Ruler, SlidersHorizontal } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import BottomSheet from "@/components/mobile/BottomSheet";
import IosTap from "@/components/mobile/IosTap";
import LikeButton from "@/components/mobile/LikeButton";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import { PropertyCardSkeletonList } from "@/components/mobile/PropertySkeletons";
import { SharedPropertyImage, SharedPropertyTitle } from "@/components/mobile/SharedPropertyHero";
import SpringTabs from "@/components/mobile/SpringTabs";
import PublicLoadError from "@/components/listings/PublicLoadError";
import { siteConfig } from "@/config/siteConfig";
import { useHaptic } from "@/hooks/useHaptic";
import { formatToman, listingTypeLabel } from "@/lib/money";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import type { PropertyRecord } from "@/server/db/store";

type Filter = "all" | "sale" | "rent";

const FILTER_TABS = [
  { id: "all" as const, label: "همه" },
  { id: "sale" as const, label: "فروش" },
  { id: "rent" as const, label: "اجاره" },
];

type MobileListingsViewProps = {
  items: PropertyRecord[];
  loading: boolean;
  failed: boolean;
  onRetry: () => void | Promise<void>;
};

/**
 * آرشیو موبایل: لیست مجازی + تب فیلتر spring + اسکلتون + لایک bounce.
 */
export default function MobileListingsView({ items, loading, failed, onRetry }: MobileListingsViewProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const vibrate = useHaptic();

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

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 316,
    overscan: 4,
  });

  return (
    <div className="bg-[#070C18] text-white lg:hidden">
      <section className="px-4 pb-3 pt-24">
        <p className="text-[11px] font-semibold tracking-[0.2em] text-cyan-300">آرشیو موبایل</p>
        <h1 className="mt-2 font-vazirmatn text-2xl font-black leading-tight">
          فایل‌های {siteConfig.brand.nameFa}
        </h1>

        <div className="mt-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محله یا کد…"
            className="h-11 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
          />
          <IosTap
            haptic
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10"
            aria-label="فیلترها"
            onClick={() => {
              setSheetOpen(true);
              vibrate(10);
            }}
          >
            <SlidersHorizontal className="h-4 w-4 text-cyan-300" />
          </IosTap>
        </div>

        <SpringTabs
          className="mt-3"
          layoutGroupId="listing-filter-header"
          items={FILTER_TABS}
          value={filter}
          onChange={setFilter}
        />
      </section>

      <PullToRefresh
        ref={parentRef}
        className="h-[calc(100dvh-15rem)]"
        scrollerClassName="h-full px-4 pb-10"
        onRefresh={onRetry}
      >
        {loading && items.length === 0 ? (
          <PropertyCardSkeletonList count={3} />
        ) : failed && items.length === 0 ? (
          <PublicLoadError onRetry={onRetry} />
        ) : filtered.length === 0 ? (
          <p className="py-10 text-sm text-slate-400">فایل منطبقی پیدا نشد.</p>
        ) : (
          <div className="relative w-full" style={{ height: `${virtualizer.getTotalSize()}px` }}>
            {virtualizer.getVirtualItems().map((row) => {
              const item = filtered[row.index];
              return (
                <div
                  key={item.id}
                  className="absolute start-0 top-0 w-full pb-4"
                  style={{
                    transform: `translateY(${row.start}px)`,
                    height: `${row.size}px`,
                  }}
                >
                  <MobilePropertyCard item={item} index={row.index} />
                </div>
              );
            })}
          </div>
        )}
      </PullToRefresh>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="فیلتر فایل‌ها">
        <p className="mb-3 text-xs text-slate-400">نوع معامله</p>
        <SpringTabs
          items={FILTER_TABS}
          layoutGroupId="listing-filter-sheet"
          value={filter}
          onChange={(id) => {
            setFilter(id);
            setSheetOpen(false);
          }}
        />
      </BottomSheet>
    </div>
  );
}

function MobilePropertyCard({ item, index }: { item: PropertyRecord; index: number }) {
  const [pressed, setPressed] = useState(false);

  return (
    <motion.article
      className="ios-contain ios-glow-active relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0, scale: pressed ? 0.96 : 1 }}
      transition={pressed ? IOS_TAP_SPRING : { ...IOS_PAGE_SPRING, delay: Math.min(index, 6) * 0.03 }}
      style={{ willChange: pressed ? "transform" : "auto" }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <span className="ios-glow-layer" />
      <Link href={`/listings/${item.id}`} className="ios-tap-target block" scroll={false}>
        <div className="ios-media-frame relative">
          <SharedPropertyImage
            id={item.id}
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 h-full w-full"
            priority={index < 2}
            sizes="(max-width: 428px) 100vw, 390px"
          />
          <span className="absolute start-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] text-cyan-200 backdrop-blur">
            {listingTypeLabel(item.listingType)}
          </span>
          <LikeButton propertyId={item.id} className="absolute end-3 top-3" />
        </div>
        <div className="space-y-2 p-4">
          <p className="text-[11px] text-slate-500">{item.code}</p>
          <SharedPropertyTitle
            id={item.id}
            title={item.title}
            className="line-clamp-2 text-base font-semibold leading-7"
          />
          <p className="inline-flex items-center gap-1.5 text-sm text-slate-400">
            <MapPin className="h-3.5 w-3.5 text-cyan-300" />
            <span className="line-clamp-1">{item.location}</span>
          </p>
          <p className="text-cyan-300">{formatToman(item.price, item.listingType)}</p>
          <div className="flex gap-3 text-[11px] text-slate-400">
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {item.bedrooms.toLocaleString("fa-IR")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {item.bathrooms.toLocaleString("fa-IR")}
            </span>
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5" />
              {item.areaSqm.toLocaleString("fa-IR")} م
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
