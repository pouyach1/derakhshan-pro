"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import { fallbackImage, formatToman, listingTypeLabel } from "@/lib/money";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";
import type { PropertyRecord } from "@/server/db/store";

export type CompactPropertyCardVariant = "grid" | "featured" | "paging";

type CompactPropertyCardProps = {
  item: PropertyRecord;
  variant?: CompactPropertyCardVariant;
  className?: string;
  priority?: boolean;
};

const VARIANT_STYLES: Record<
  CompactPropertyCardVariant,
  { wrap: string; media: string; title: string; sizes: string; pad: string; price: string }
> = {
  grid: {
    wrap: "rounded-[1.35rem]",
    media: "aspect-[4/3]",
    title: "text-sm leading-6 lg:text-[0.95rem]",
    sizes: "(max-width: 1023px) 45vw, 280px",
    pad: "px-3 py-3",
    price: "text-xs lg:text-sm",
  },
  featured: {
    wrap: "rounded-[1.55rem]",
    media: "aspect-[5/4]",
    title: "text-base leading-7 lg:text-lg",
    sizes: "(max-width: 1023px) 78vw, 420px",
    pad: "px-4 py-3.5",
    price: "text-sm lg:text-base",
  },
  paging: {
    wrap: "rounded-[1.75rem]",
    media: "aspect-[4/3] lg:aspect-[16/10]",
    title: "text-lg leading-8 lg:text-xl",
    sizes: "(max-width: 1023px) 88vw, 560px",
    pad: "px-4 py-4 lg:px-5 lg:py-5",
    price: "text-base lg:text-lg",
  },
};

/**
 * کارت لوکس ملک — تم سفید / آبی کم‌رنگ برند.
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
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
        animate={{
          boxShadow:
            hovered && !reduceMotion
              ? "0 0 0 1px rgba(0,163,255,0.28), 0 24px 50px -28px rgba(0,163,255,0.35)"
              : "0 0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.4 }}
      />

      <Link href={`/listings/${item.id}`} className="ios-tap-target block" scroll={false}>
        <div className={cn("relative overflow-hidden bg-[#E8F1F8]", styles.media)}>
          <motion.div
            className="absolute inset-0"
            animate={reduceMotion ? undefined : hovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src={fallbackImage(item.imageUrl)}
              alt={item.title}
              fill
              priority={priority}
              sizes={styles.sizes}
              className="object-cover"
            />
          </motion.div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B3A5C]/75 via-[#0B3A5C]/15 to-transparent" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <span className="rounded-full border border-white/40 bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#0B3A5C] shadow-sm backdrop-blur-md">
              {listingTypeLabel(item.listingType)}
            </span>
            <div className="flex flex-col items-end gap-1.5">
              {item.isFeatured ? (
                <span className="rounded-full border border-sky-300/50 bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-[0_8px_20px_-10px_rgba(0,163,255,0.9)]">
                  ویژه
                </span>
              ) : null}
              <span className="rounded-full border border-white/30 bg-[#0B3A5C]/55 px-2.5 py-1 font-mono text-[10px] tracking-wider text-white/90 backdrop-blur-md">
                {item.code}
              </span>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-3.5 pt-10">
            <p className="mb-1.5 inline-flex items-center gap-1.5 text-[11px] text-white/85">
              <MapPin className="h-3 w-3 shrink-0 text-sky-200" />
              <span className="line-clamp-1">{item.neighborhood || item.location}</span>
            </p>
            <h3 className={cn("line-clamp-2 font-vazirmatn font-bold text-white", styles.title)}>
              {item.title}
            </h3>
          </div>
        </div>

        <div className={cn("bg-white", styles.pad)}>
          <p className={cn("font-semibold tracking-tight text-sky-600", styles.price)}>
            {formatToman(item.price, item.listingType)}
          </p>
          <div className="mt-3 grid grid-cols-3 divide-x divide-x-reverse divide-[#0B3A5C]/10 border-t border-[#0B3A5C]/8 pt-3">
            <Spec icon={BedDouble} value={item.bedrooms} unit="خواب" compact={variant === "grid"} />
            <Spec icon={Bath} value={item.bathrooms} unit="سرویس" compact={variant === "grid"} />
            <Spec icon={Ruler} value={item.areaSqm} unit="متر" compact={variant === "grid"} />
          </div>
        </div>
      </Link>
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
      <Icon className={cn("text-sky-500", compact ? "h-3.5 w-3.5" : "h-4 w-4")} strokeWidth={1.75} />
      <p className={cn("font-vazirmatn font-bold tabular-nums text-[#0B3A5C]", compact ? "text-xs" : "text-sm")}>
        {value.toLocaleString("fa-IR")}
      </p>
      <p className={cn("font-medium tracking-wide text-[#0B3A5C]/45", compact ? "text-[9px]" : "text-[10px]")}>
        {unit}
      </p>
    </div>
  );
}
