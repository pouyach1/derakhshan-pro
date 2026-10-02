"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import PropertyGalleryTrigger from "@/components/listings/PropertyGalleryTrigger";
import AgentProfileLink from "@/components/agents/AgentProfileLink";
import { frameLabel, listPropertyImages } from "@/lib/property-images";
import { listingTypeLabel } from "@/lib/money";
import PropertyPrice from "@/components/listings/PropertyPrice";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";
import type { ListingType } from "@/server/db/store";
import type { PropertyAgentSummary } from "@/server/services/agents-public";

export type CompactPropertyCardVariant = "grid" | "featured" | "paging";

type CardItem = {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number | null;
  priceVisible?: boolean;
  listingType: ListingType | string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  imageUrl: string;
  gallery?: string[];
  isFeatured?: boolean;
  code?: string;
  agent?: PropertyAgentSummary | null;
};

type CompactPropertyCardProps = {
  item: CardItem;
  variant?: CompactPropertyCardVariant;
  className?: string;
  priority?: boolean;
};

const VARIANT_STYLES: Record<
  CompactPropertyCardVariant,
  { wrap: string; media: string; title: string; sizes: string; pad: string; price: string }
> = {
  grid: {
    wrap: "rounded-[1.15rem]",
    media: "aspect-[4/3]",
    title: "text-sm leading-6 sm:text-[0.95rem] sm:leading-7",
    sizes: "(max-width: 1023px) 45vw, 280px",
    pad: "px-3 py-3 sm:px-3.5 sm:py-3.5",
    price: "text-sm sm:text-base",
  },
  featured: {
    wrap: "rounded-[1.55rem]",
    media: "aspect-[5/4]",
    title: "text-base leading-7 lg:text-lg lg:leading-8",
    sizes: "(max-width: 1023px) 78vw, 420px",
    pad: "px-4 py-4",
    price: "text-base lg:text-lg",
  },
  paging: {
    wrap: "rounded-[1.75rem]",
    media: "aspect-[4/3] lg:aspect-[16/10]",
    title: "text-lg leading-8 lg:text-xl",
    sizes: "(max-width: 1023px) 88vw, 560px",
    pad: "px-4 py-4 lg:px-5 lg:py-5",
    price: "text-lg lg:text-xl",
  },
};

/**
 * کارت لوکس ملک — عنوان و قیمت روی زمینه روشن برای خوانایی کامل.
 */
export default function CompactPropertyCard({
  item,
  variant = "grid",
  className,
  priority = false,
}: CompactPropertyCardProps) {
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const reduceMotion = useReducedMotion();
  const styles = VARIANT_STYLES[variant];
  const photoCount = listPropertyImages(item).length;

  return (
    <motion.article
      className={cn(
        "ios-contain group relative overflow-hidden border border-[#0B3A5C]/10 bg-white",
        "shadow-[0_22px_60px_-36px_rgba(11,58,92,0.35)]",
        styles.wrap,
        className,
      )}
      animate={{ scale: pressed ? 0.975 : 1, y: hovered && !reduceMotion ? -5 : 0 }}
      transition={IOS_TAP_SPRING}
      style={{ willChange: pressed || hovered ? "transform" : "auto" }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => {
        setPressed(false);
        setHovered(false);
      }}
      onPointerEnter={() => setHovered(true)}
    >
      <div className={cn("relative overflow-hidden bg-[#E8F1F8]", styles.media)}>
        <PropertyGalleryTrigger
          item={item}
          sizes={styles.sizes}
          priority={priority}
          showCount={false}
        />
        <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-[#0B3A5C]/45 via-transparent to-[#0B3A5C]/15" />

        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-[3] flex items-start justify-between gap-2",
            variant === "grid" ? "p-2" : "p-3",
          )}
        >
          <span
            className={cn(
              "rounded-full border border-white/50 bg-white font-bold tracking-wide text-[#0B3A5C] shadow-sm",
              variant === "grid" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]",
            )}
          >
            {listingTypeLabel(item.listingType)}
          </span>
          {variant !== "grid" ? (
            <div className="flex flex-col items-end gap-1.5">
              {item.isFeatured ? (
                <span className="rounded-full bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                  ویژه
                </span>
              ) : null}
              {item.code ? (
                <span className="rounded-full bg-white/95 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-[#0B3A5C]">
                  {item.code}
                </span>
              ) : null}
              {photoCount > 1 ? (
                <span className="rounded-full bg-black/55 px-2.5 py-1 font-mono text-[10px] tracking-[0.16em] text-white">
                  {frameLabel(1, photoCount)}
                </span>
              ) : null}
            </div>
          ) : item.isFeatured ? (
            <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-bold text-white">
              ویژه
            </span>
          ) : null}
        </div>
      </div>

      <div className={cn("bg-white", styles.pad)}>
        <p className="mb-1.5 inline-flex max-w-full items-center gap-1 text-[11px] font-semibold text-[#0B3A5C]/70 sm:text-xs">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-sky-600" />
          <span className="line-clamp-1">{item.neighborhood || item.location}</span>
        </p>
        <Link href={`/listings/${item.id}`} className="ios-tap-target block" scroll={false}>
          <h3
            className={cn(
              "line-clamp-2 font-vazirmatn font-bold text-[#0B3A5C]",
              styles.title,
            )}
          >
            {item.title}
          </h3>
          <PropertyPrice
            price={item.price}
            listingType={item.listingType}
            priceVisible={item.priceVisible}
            compact
            className={cn("mt-2 block font-bold tracking-tight", styles.price)}
          />
        </Link>

        {item.agent ? (
          <div className="mt-3">
            <AgentProfileLink agent={item.agent} showTitle={variant !== "grid"} />
          </div>
        ) : null}

        <div
          className={cn(
            "grid grid-cols-3 divide-x divide-x-reverse divide-[#0B3A5C]/10 border-t border-[#0B3A5C]/10",
            variant === "grid" ? "mt-3 pt-2.5" : "mt-3.5 pt-3",
          )}
        >
          <Spec icon={BedDouble} value={item.bedrooms} unit="خواب" compact={variant === "grid"} />
          <Spec icon={Bath} value={item.bathrooms} unit="سرویس" compact={variant === "grid"} />
          <Spec icon={Ruler} value={item.areaSqm} unit="متر" compact={variant === "grid"} />
        </div>
      </div>
    </motion.article>
  );
}

function Spec({
  icon: Icon,
  value,
  unit,
  compact,
}: {
  icon: typeof BedDouble;
  value: number;
  unit: string;
  compact?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-0.5 text-center">
      <Icon className={cn("text-sky-600", compact ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={1.75} />
      <p className={cn("font-vazirmatn font-bold tabular-nums text-[#0B3A5C]", compact ? "text-xs" : "text-sm")}>
        {value.toLocaleString("fa-IR")}
      </p>
      <p className={cn("font-semibold tracking-wide text-[#0B3A5C]/65", compact ? "text-[10px]" : "text-[11px]")}>
        {unit}
      </p>
    </div>
  );
}
