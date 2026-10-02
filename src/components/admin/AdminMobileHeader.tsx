"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/config/admin-nav";
import { SITE_INFO } from "@/config/SITE_INFO";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import WorkspaceThemeToggle from "@/components/workspace/WorkspaceThemeToggle";

type AdminMobileHeaderProps = {
  isDark?: boolean;
  onToggleTheme?: () => void;
  accountSlot?: React.ReactNode;
};

export default function AdminMobileHeader({
  isDark = true,
  onToggleTheme,
  accountSlot,
}: AdminMobileHeaderProps) {
  const pathname = usePathname();
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    void (async () => {
      const res = await api<{ newLeads: number; unreadMessages: number }>("/api/stats");
      if (res.ok) setAlertCount((res.data.newLeads || 0) + (res.data.unreadMessages || 0));
    })();
  }, []);

  const current =
    ADMIN_NAV_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? ADMIN_NAV_ITEMS[0];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden",
        isDark ? "border-white/10 bg-[#121821]/94" : "border-slate-200/80 bg-admin-canvas/94",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/admin/dashboard" className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              isDark
                ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30"
                : "bg-admin-navy text-white shadow-sm",
            )}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 20V9.5L12 4l8 5.5V20" />
              <path d="M9 20v-6h6v6" />
            </svg>
          </span>
          <div className="min-w-0">
            <p className={cn("truncate text-sm font-bold", isDark ? "text-ws-text" : "text-admin-navy")}>
              {SITE_INFO.productNameFa}
            </p>
            <p className={cn("truncate text-[11px] font-medium", isDark ? "text-sky-300/90" : "text-admin-sky")}>
              {current.label}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/admin/properties"
            aria-label="جستجوی آگهی"
            className={cn(
              "ios-tap-target inline-flex h-10 w-10 items-center justify-center rounded-full transition",
              isDark
                ? "bg-white/5 text-ws-muted ring-1 ring-white/10"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200",
            )}
          >
            <Search className="h-4 w-4" strokeWidth={1.9} />
          </Link>
          <button
            type="button"
            aria-label="اعلان‌ها"
            className={cn(
              "ios-tap-target relative inline-flex h-10 w-10 items-center justify-center rounded-full transition",
              isDark
                ? "bg-white/5 text-ws-muted ring-1 ring-white/10"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200",
            )}
          >
            <Bell className="h-5 w-5" strokeWidth={1.8} />
            {alertCount > 0 ? (
              <span className="absolute start-2.5 top-2.5 h-2 w-2 rounded-full bg-sky-400" />
            ) : null}
          </button>
          {onToggleTheme ? <WorkspaceThemeToggle isDark={isDark} onToggle={onToggleTheme} /> : null}
          {accountSlot}
        </div>
      </div>
    </header>
  );
}
