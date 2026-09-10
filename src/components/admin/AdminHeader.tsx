"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_PILLS = ["Statistics", "Property", "Favorites", "Settings"] as const;

type AdminHeaderProps = {
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
};

export default function AdminHeader({ viewMode, onViewModeChange }: AdminHeaderProps) {
  const [activePill, setActivePill] = useState<(typeof NAV_PILLS)[number]>("Property");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-admin-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center gap-3 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-admin-navy text-white shadow-sm">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 20V9.5L12 4l8 5.5V20" />
              <path d="M9 20v-6h6v6" />
            </svg>
          </span>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-admin-navy">RIO Admin</p>
            <p className="text-[11px] text-slate-500">Property console</p>
          </div>
        </div>

        <div className="flex flex-1 flex-wrap items-center gap-2">
          <FilterChip label="San Francisco" />
          <FilterChip label="District" />
          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition hover:text-admin-sky"
          >
            <SearchIcon />
          </button>
        </div>

        <nav className="flex flex-wrap items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200/80">
          {NAV_PILLS.map((pill) => {
            const active = activePill === pill;
            return (
              <button
                key={pill}
                type="button"
                onClick={() => setActivePill(pill)}
                className={cn(
                  "rounded-full px-3.5 py-2 text-xs font-medium transition sm:text-sm",
                  active
                    ? "bg-admin-navy text-white shadow-sm"
                    : "text-slate-600 hover:bg-admin-soft hover:text-admin-navy",
                )}
              >
                {pill}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm ring-1 ring-slate-200"
          >
            <BellIcon />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-admin-sky" />
          </button>
          <Image
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
            alt="User avatar"
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
          />
          <div className="ml-1 flex items-center gap-1 rounded-full bg-white p-1 shadow-sm ring-1 ring-slate-200">
            <button
              type="button"
              aria-label="Grid view"
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
              aria-label="List view"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-full text-sm transition",
                viewMode === "list" ? "bg-admin-navy text-white" : "text-slate-500 hover:bg-admin-soft",
              )}
            >
              ≡
            </button>
          </div>
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
