"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
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
  { wrap: string; media: string; title: string; sizes: string; radius: string }
> = {
  grid: {
    wrap: "rounded-2xl",
    media: "aspect-[4/3]",
    title: "text-xs leading-5",
    sizes: "(max-width: 428px) 45vw, 180px",
    radius: "rounded-2xl",
  },
  featured: {
    wrap: "rounded-[1.35rem]",
    media: "aspect-[5/4]",
    title: "text-sm leading-6",
    sizes: "(max-width: 428px) 78vw, 300px",
    radius: "rounded-[1.35rem]",
  },
  paging: {
    wrap: "rounded-[1.5rem]",
    media: "aspect-[4/3]",
    title: "text-base leading-7",
    sizes: "(max-width: 428px) 88vw, 360px",
    radius: "rounded-[1.5rem]",
  },
};

/**
 * کارت فشرده موبایل — گرید ۲ستونه / ویژه / جدیدترین.
 */
export default function CompactPropertyCard({
  item,
  variant = "grid",
  className,
  priority = false,
}: CompactPropertyCardProps) {
  const [pressed, setPressed] = useState(false);
  const styles = VARIANT_STYLES[variant];

  return (
    <motion.article
      className={cn(
        "ios-contain relative overflow-hidden border border-white/10 bg-white/[0.04]",
        styles.wrap,
        className,
      )}
      animate={{ scale: pressed ? 0.97 : 1 }}
      transition={IOS_TAP_SPRING}
      style={{ willChange: pressed ? "transform" : "auto" }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
    >
      <Link href={`/listings/${item.id}`} className="ios-tap-target block" scroll={false}>
        <div className={cn("relative overflow-hidden bg-slate-950", styles.media, styles.radius)}>
          <Image
            src={fallbackImage(item.imageUrl)}
            alt={item.title}
            fill
            priority={priority}
            sizes={styles.sizes}
            className="object-cover"
          />
          <span className="absolute start-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] text-cyan-200 backdrop-blur">
            {listingTypeLabel(item.listingType)}
          </span>
        </div>
        <div className={cn("space-y-1", variant === "grid" ? "p-2.5" : "p-3.5")}>
          <h3 className={cn("line-clamp-2 font-semibold text-white", styles.title)}>{item.title}</h3>
          <p className={cn("font-medium text-cyan-300", variant === "grid" ? "text-[11px]" : "text-sm")}>
            {formatToman(item.price, item.listingType)}
          </p>
        </div>
      </Link>
    </motion.article>
  );
}
