"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminMobileBottomNav from "@/components/admin/AdminMobileBottomNav";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import ContactsSidebar from "@/components/admin/ContactsSidebar";
import BackButton from "@/components/navigation/BackButton";
import { useWorkspaceTheme } from "@/hooks/useWorkspaceTheme";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";
import { AdminAccountMenu } from "@/components/admin/AdminHeader";

/**
 * Admin shell:
 * - Desktop: sticky contacts + multi-link header
 * - Mobile: compact header + bottom tabs + contacts in sheet
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useWorkspaceTheme();
  const reduceMotion = useReducedMotion();
  const isAdminHome = pathname === "/admin/dashboard";
  const backFallback = isAdminHome ? "/" : "/admin/dashboard";
  const backLabel = isAdminHome ? "بازگشت به سایت" : "بازگشت";

  return (
    <div
      dir="rtl"
      lang="fa"
      className={cn(
        "min-h-dvh bg-admin-canvas font-vazirmatn antialiased",
        isDark ? "workspace-dark text-ws-text" : "text-slate-900",
      )}
    >
      {/* Desktop header */}
      <div className="hidden lg:block">
        <AdminHeader isDark={isDark} onToggleTheme={toggleTheme} />
      </div>

      {/* Mobile header */}
      <AdminMobileHeader
        isDark={isDark}
        onToggleTheme={toggleTheme}
        accountSlot={<AdminAccountMenu isDark={isDark} compact />}
      />

      <div
        className={cn(
          "mx-auto grid max-w-[1600px] gap-4 px-3 py-3 sm:px-4 sm:py-4",
          "lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:py-6",
          // Room for fixed bottom nav + home indicator
          "pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-6",
        )}
      >
        <aside
          className={cn(
            "hidden h-fit lg:sticky lg:top-6 lg:block lg:h-[calc(100vh-120px)] lg:self-start lg:overflow-y-auto lg:overscroll-contain",
            "[scrollbar-width:thin] [scrollbar-color:rgba(14,165,233,0.2)_transparent]",
          )}
          aria-label="مخاطبین"
        >
          <ContactsSidebar />
        </aside>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={IOS_PAGE_SPRING}
            className="min-w-0"
            data-admin-main
          >
            <main className="min-w-0">
              <div className="mb-3 sm:mb-4">
                <BackButton
                  fallbackHref={backFallback}
                  label={backLabel}
                  tone={isDark ? "dark" : "soft"}
                />
              </div>
              {children}
            </main>
          </motion.div>
        </AnimatePresence>
      </div>

      <AdminMobileBottomNav isDark={isDark} />
    </div>
  );
}
