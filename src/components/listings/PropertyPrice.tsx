"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { formatToman } from "@/lib/money";
import { cn } from "@/lib/utils";
import type { ListingType } from "@/server/db/store";

type PropertyPriceProps = {
  price: number | null | undefined;
  listingType?: ListingType | string;
  priceVisible?: boolean;
  className?: string;
  /** Compact link style for cards */
  compact?: boolean;
};

/**
 * Shows the formatted price for role holders; guests see a login CTA instead.
 */
export default function PropertyPrice({
  price,
  listingType,
  priceVisible,
  className,
  compact = false,
}: PropertyPriceProps) {
  const pathname = usePathname();
  const visible =
    priceVisible !== false && price != null && Number.isFinite(price) && price > 0;

  if (visible) {
    return <span className={className}>{formatToman(price, listingType)}</span>;
  }

  const next = pathname && pathname !== "/login" ? pathname : "/";
  return (
    <Link
      href={`/login?next=${encodeURIComponent(next)}`}
      className={cn(
        "ios-tap-target inline-flex items-center gap-1.5 font-semibold text-sky-700 transition hover:text-sky-800",
        compact ? "text-sm" : "text-base",
        className,
      )}
    >
      <Lock className={cn("shrink-0", compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
      ورود برای مشاهده قیمت
    </Link>
  );
}
