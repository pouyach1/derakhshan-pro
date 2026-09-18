import type { ListingType, PropertyStatus } from "@/server/db/store";

export function formatToman(value: number, listingType?: ListingType | string) {
  if (!Number.isFinite(value) || value <= 0) return "قیمت توافقی";
  if (listingType === "rent") {
    return `${value.toLocaleString("fa-IR")} تومان / ماه`;
  }
  if (value >= 1_000_000_000) {
    const billions = value / 1_000_000_000;
    return `${billions.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد تومان`;
  }
  if (value >= 1_000_000) {
    return `${Math.round(value / 1_000_000).toLocaleString("fa-IR")} میلیون تومان`;
  }
  return `${value.toLocaleString("fa-IR")} تومان`;
}

export function listingTypeLabel(type: ListingType | string) {
  return type === "rent" ? "اجاره" : "فروش";
}

export function propertyStatusLabel(status: PropertyStatus | string) {
  const map: Record<string, string> = {
    draft: "پیش‌نویس",
    published: "منتشرشده",
    negotiation: "در حال مذاکره",
    sold: "واگذار شده",
    archived: "بایگانی",
  };
  return map[status] ?? status;
}

export function fallbackImage(src?: string | null) {
  return src && src.trim() ? src : "/images/landing/hero/banner.jpg";
}
