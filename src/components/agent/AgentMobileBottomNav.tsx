"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { AGENT_MORE_NAV, AGENT_PRIMARY_NAV } from "@/config/agent-nav";
import { IOS_PAGE_SPRING, IOS_TAP_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";
import BottomSheet from "@/components/mobile/BottomSheet";

type AgentMobileBottomNavProps = {
  isDark?: boolean;
};

/**
 * نوار پایین موبایل پنل مشاور — مسیرهای اصلی + «بیشتر».
 */
export default function AgentMobileBottomNav({ isDark = true }: AgentMobileBottomNavProps) {
  const pathname = usePathname();
  const vibrate = useHaptic();
  const reduceMotion = useReducedMotion();
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMoreOpen(false);
  }, [pathname]);

  const moreActive = AGENT_MORE_NAV.some(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );

  return (
    <>
      <nav
        aria-label="ناوبری موبایل مشاور"
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t lg:hidden",
          "pb-[max(0.55rem,env(safe-area-inset-bottom))]",
          isDark
            ? "border-white/10 bg-[#121821]/94 text-ws-text backdrop-blur-xl"
            : "border-slate-200/80 bg-white/94 text-[#0B3A5C] backdrop-blur-xl",
        )}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1.5 pt-1.5">
          {AGENT_PRIMARY_NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => vibrate(8)}
                className={cn(
                  "ios-tap-target relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition",
                  active
                    ? isDark
                      ? "text-sky-300"
                      : "text-sky-600"
                    : isDark
                      ? "text-ws-muted"
                      : "text-slate-500",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="agent-mobile-tab"
                    className={cn(
                      "absolute inset-x-1 inset-y-0.5 rounded-2xl",
                      isDark
                        ? "bg-sky-500/15 ring-1 ring-sky-400/30"
                        : "bg-sky-50 ring-1 ring-sky-200/80",
                    )}
                    transition={reduceMotion ? { duration: 0 } : IOS_PAGE_SPRING}
                  />
                ) : null}
                <Icon className="relative h-5 w-5" strokeWidth={active ? 2.2 : 1.8} />
                <span className="relative">{item.shortLabel}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              vibrate(10);
              setMoreOpen(true);
            }}
            className={cn(
              "ios-tap-target relative flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1.5 text-[10px] font-semibold transition",
              moreActive || moreOpen
                ? isDark
                  ? "text-sky-300"
                  : "text-sky-600"
                : isDark
                  ? "text-ws-muted"
                  : "text-slate-500",
            )}
          >
            <Menu className="relative h-5 w-5" strokeWidth={1.8} />
            <span className="relative">بیشتر</span>
          </button>
        </div>
      </nav>

      <BottomSheet
        open={moreOpen}
        onClose={() => setMoreOpen(false)}
        title="بخش‌های بیشتر"
        className={cn(
          isDark
            ? "border-white/10 bg-[#121821] text-ws-text"
            : "!bg-white !text-[#0B3A5C] border-slate-200",
        )}
      >
        <div className="space-y-2 px-1 pb-4">
          <p className={cn("px-2 text-xs", isDark ? "text-ws-muted" : "text-slate-500")}>
            مسیرهای تکمیلی پنل مشاور
          </p>
          <div className="grid grid-cols-2 gap-2">
            {AGENT_MORE_NAV.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    vibrate(8);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "ios-tap-target flex min-h-[4.5rem] flex-col items-start justify-center gap-2 rounded-2xl px-3.5 py-3 transition",
                    active
                      ? isDark
                        ? "bg-sky-500/15 text-sky-200 ring-1 ring-sky-400/35"
                        : "bg-sky-50 text-[#0B3A5C] ring-1 ring-sky-200"
                      : isDark
                        ? "bg-white/5 text-ws-text ring-1 ring-white/10"
                        : "bg-[#F3F7FB] text-[#0B3A5C] ring-1 ring-slate-200/70",
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.9} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Utility: public site — full-width so it stays clear of bottom-tab chrome */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="مشاهده سایت عمومی"
            onClick={() => {
              vibrate(8);
              setMoreOpen(false);
            }}
            className={cn(
              "group ios-tap-target mt-1 flex min-h-12 items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
              isDark
                ? "bg-white/5 text-ws-text ring-1 ring-white/10 hover:bg-white/10"
                : "bg-[#F3F7FB] text-[#0B3A5C] ring-1 ring-slate-200/70 hover:bg-white",
            )}
          >
            <ExternalLink
              className="h-5 w-5 opacity-80 transition duration-150 group-hover:translate-x-[-2px] group-hover:opacity-100"
              strokeWidth={1.9}
            />
            <span>مشاهده سایت</span>
          </a>

          <motion.div
            whileTap={{ scale: 0.99 }}
            transition={IOS_TAP_SPRING}
            className={cn(
              "mt-1 rounded-2xl px-4 py-3 text-xs leading-6",
              isDark ? "bg-white/5 text-ws-muted" : "bg-[#F3F7FB] text-slate-500",
            )}
          >
            برای بازگشت به داشبورد از تب «خانه» استفاده کنید.
          </motion.div>
        </div>
      </BottomSheet>
    </>
  );
}
