"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "داشبورد" },
  { href: "/admin/properties", label: "املاک" },
  { href: "/admin/leads", label: "سرنخ‌ها" },
  { href: "/admin/agents", label: "مشاوران" },
  { href: "/admin/settings", label: "تنظیمات" },
] as const;

type AdminHeaderProps = {
  viewMode?: "grid" | "list";
  onViewModeChange?: (mode: "grid" | "list") => void;
  showViewToggle?: boolean;
};

export default function AdminHeader({
  viewMode = "grid",
  onViewModeChange,
  showViewToggle = false,
}: AdminHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-admin-canvas/90 font-vazir backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-admin-navy text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 20V9.5L12 4l8 5.5V20" />
              <path d="M9 20v-6h6v6" />
            </svg>
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-admin-navy">RIO ادمین</p>
            <p className="text-[11px] text-slate-500">کنسول املاک</p>
          </div>
        </Link>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          <FilterChip label="تهران" />
          <FilterChip label="منطقه یک" />
          <button
            type="button"
            aria-label="جستجو"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-admin-sky"
          >
            <SearchIcon />
          </button>
        </div>

        <nav className="flex flex-wrap items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200/80">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-medium transition sm:text-sm",
                  active
                    ? "bg-admin-navy text-white shadow-sm"
                    : "text-slate-600 hover:bg-admin-soft hover:text-admin-navy",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="اعلان‌ها"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"
          >
            <BellIcon />
            <span className="absolute left-2 top-2 h-2 w-2 rounded-full bg-admin-sky" />
          </button>
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
            alt="آواتار کاربر"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
          />
          {showViewToggle && onViewModeChange ? (
            <div className="ms-1 flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
              <button
                type="button"
                aria-label="نمای شبکه‌ای"
                onClick={() => onViewModeChange("grid")}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition",
                  viewMode === "grid" ? "bg-admin-navy text-white" : "text-slate-500 hover:bg-admin-soft",
                )}
              >
                ⊞
              </button>
              <button
                type="button"
                aria-label="نمای لیستی"
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition",
                  viewMode === "list" ? "bg-admin-navy text-white" : "text-slate-500 hover:bg-admin-soft",
                )}
              >
                ≡
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:ring-admin-sky/40"
    >
      <span>{label}</span>
      <ChevronIcon />
    </button>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 9a6 6 0 1 1 12 0c0 7 3 7 3 7H3s3 0 3-7" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
