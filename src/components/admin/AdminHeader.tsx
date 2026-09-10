"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutGrid, List, Bell, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "خانه" },
  { href: "/admin/properties", label: "آگهی‌ها" },
  { href: "/admin/leads", label: "پیگیری‌ها" },
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
            <p className="text-sm font-semibold text-admin-navy">درخشان پرو</p>
            <p className="text-[11px] text-slate-500">سامانه مدیریت آگهی</p>
          </div>
        </Link>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <FilterChip label="تهران" />
          <FilterChip label="منطقه ۱" />
          <LuxurySearch />
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
            <Bell className="h-5 w-5" strokeWidth={1.8} />
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
                  "inline-flex h-8 w-8 items-center justify-center rounded-full transition",
                  viewMode === "grid" ? "bg-admin-navy text-white" : "text-slate-500 hover:bg-admin-soft",
                )}
              >
                <LayoutGrid className="h-4 w-4" strokeWidth={1.9} />
              </button>
              <button
                type="button"
                aria-label="نمای لیستی"
                onClick={() => onViewModeChange("list")}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full transition",
                  viewMode === "list" ? "bg-admin-navy text-white" : "text-slate-500 hover:bg-admin-soft",
                )}
              >
                <List className="h-4 w-4" strokeWidth={1.9} />
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function LuxurySearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad|iPod/i.test(navigator.platform) || /Mac OS/i.test(navigator.userAgent));
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
        setQuery("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "group relative flex h-11 min-w-[12rem] flex-1 items-center gap-2 rounded-2xl px-3 transition-all duration-300",
        "border border-white/30 bg-white/40 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-900/20",
        "sm:max-w-md",
        "focus-within:border-sky-500/40 focus-within:ring-4 focus-within:ring-sky-500/10",
        focused && "border-sky-500/40 ring-4 ring-sky-500/10",
      )}
    >
      <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-slate-200/70 bg-white/50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-slate-500 sm:inline-flex dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
        {isMac ? "⌘" : "Ctrl"}
        <span>K</span>
      </kbd>
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="جستجوی کد، محله یا مشاور…"
        className="h-full w-full min-w-0 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
        aria-label="جستجو"
      />
      <AnimatePresence initial={false}>
        {query ? (
          <motion.button
            type="button"
            aria-label="پاک کردن جستجو"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.18 }}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-white/70 hover:text-slate-700 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <X className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.button>
        ) : null}
      </AnimatePresence>
      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500">
        <Search className="h-4 w-4" strokeWidth={1.9} />
      </span>
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-3.5 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:ring-admin-sky/40"
    >
      <span>{label}</span>
      <ChevronDown className="h-4 w-4 text-slate-400" strokeWidth={2} />
    </button>
  );
}
