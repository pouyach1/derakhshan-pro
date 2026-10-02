"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Search } from "lucide-react";
import { AGENT_NAV_ITEMS } from "@/config/agent-nav";
import { SITE_INFO } from "@/config/SITE_INFO";
import { cn } from "@/lib/utils";
import WorkspaceThemeToggle from "@/components/workspace/WorkspaceThemeToggle";

type AgentMobileHeaderProps = {
  isDark?: boolean;
  onToggleTheme?: () => void;
  subtitle?: string;
  accountSlot?: React.ReactNode;
};

export default function AgentMobileHeader({
  isDark = true,
  onToggleTheme,
  subtitle,
  accountSlot,
}: AgentMobileHeaderProps) {
  const pathname = usePathname();
  const current =
    AGENT_NAV_ITEMS.find(
      (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
    ) ?? AGENT_NAV_ITEMS[0];

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b pt-[env(safe-area-inset-top)] backdrop-blur-xl lg:hidden",
        isDark ? "border-white/10 bg-[#121821]/94" : "border-slate-200/80 bg-admin-canvas/94",
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/agent/dashboard" className="flex min-w-0 items-center gap-2.5">
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              isDark
                ? "bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/30"
                : "bg-[#0B3A5C] text-white shadow-sm",
            )}
          >
            <Building2 className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <p className={cn("truncate text-sm font-bold", isDark ? "text-ws-text" : "text-[#0B3A5C]")}>
              {SITE_INFO.productNameFa}
            </p>
            <p className={cn("truncate text-[11px] font-medium", isDark ? "text-sky-300/90" : "text-sky-600")}>
              {current.label}
              {subtitle ? ` · ${subtitle}` : ""}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1.5">
          <Link
            href="/agent/properties"
            aria-label="جستجوی املاک"
            className={cn(
              "ios-tap-target inline-flex h-10 w-10 items-center justify-center rounded-full transition",
              isDark
                ? "bg-white/5 text-ws-muted ring-1 ring-white/10"
                : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200",
            )}
          >
            <Search className="h-4 w-4" strokeWidth={1.9} />
          </Link>
          {onToggleTheme ? <WorkspaceThemeToggle isDark={isDark} onToggle={onToggleTheme} /> : null}
          {accountSlot}
        </div>
      </div>
    </header>
  );
}
