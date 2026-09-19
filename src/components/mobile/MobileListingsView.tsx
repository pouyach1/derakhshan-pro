"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import { motion } from "framer-motion";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import BottomSheet from "@/components/mobile/BottomSheet";
import CompactPropertyCard from "@/components/mobile/CompactPropertyCard";
import IosTap from "@/components/mobile/IosTap";
import PullToRefresh from "@/components/mobile/PullToRefresh";
import { PropertyCardSkeletonList } from "@/components/mobile/PropertySkeletons";
import SpringTabs from "@/components/mobile/SpringTabs";
import PublicLoadError from "@/components/listings/PublicLoadError";
import { siteConfig } from "@/config/siteConfig";
import { useHaptic } from "@/hooks/useHaptic";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
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
 * آرشیو موبایل — تم سفید / آبی کم‌رنگ برند.
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
    estimateSize: () => 380,
    overscan: 4,
  });

  return (
    <div className="bg-[#F3F7FB] text-[#0B3A5C] lg:hidden">
      <section className="relative overflow-hidden px-4 pb-3 pt-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,163,255,0.12),transparent_55%)]"
        />
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={IOS_PAGE_SPRING}
          className="relative"
        >
          <p className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.18em] text-sky-600">
            <Sparkles className="h-3 w-3" />
            آرشیو اختصاصی
          </p>
          <h1 className="mt-2 font-vazirmatn text-2xl font-black leading-tight text-[#0B3A5C]">
            فایل‌های {siteConfig.brand.nameFa}
          </h1>
        </motion.div>

        <div className="relative mt-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="جستجوی محله یا کد…"
            className="h-11 flex-1 rounded-full border border-[#0B3A5C]/10 bg-white px-4 text-sm text-[#0B3A5C] outline-none placeholder:text-[#0B3A5C]/40 shadow-sm focus:border-sky-400"
          />
          <IosTap
            haptic
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0B3A5C]/10 bg-white shadow-sm"
            aria-label="فیلترها"
            onClick={() => {
              setSheetOpen(true);
              vibrate(10);
            }}
          >
            <SlidersHorizontal className="h-4 w-4 text-sky-600" />
          </IosTap>
        </div>

        <SpringTabs
          className="mt-3"
          layoutGroupId="listing-filter-header"
          tone="light"
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
          <p className="py-10 text-sm text-[#0B3A5C]/50">فایل منطبقی پیدا نشد.</p>
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
                  <CompactPropertyCard
                    item={item}
                    variant="featured"
                    priority={row.index < 2}
                  />
                </div>
              );
            })}
          </div>
        )}
      </PullToRefresh>

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="فیلتر فایل‌ها">
        <p className="mb-3 text-xs text-[#0B3A5C]/55">نوع معامله</p>
        <SpringTabs
          items={FILTER_TABS}
          layoutGroupId="listing-filter-sheet"
          tone="light"
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
