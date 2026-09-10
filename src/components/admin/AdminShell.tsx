"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import ContactsSidebar from "@/components/admin/ContactsSidebar";
import { cn } from "@/lib/utils";

/**
 * 2-column admin layout:
 * - Contacts: sticky viewport-height column with its own overflow
 * - Main: natural document flow (hero + sections stack, no overlap)
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div dir="rtl" lang="fa" className="min-h-dvh bg-admin-canvas font-vazir text-slate-900 antialiased">
      <AdminHeader />

      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:py-6">
        <aside
          className={cn(
            "h-fit lg:sticky lg:top-6 lg:h-[calc(100vh-120px)] lg:self-start lg:overflow-y-auto lg:overscroll-contain",
            "[scrollbar-width:thin] [scrollbar-color:rgba(14,165,233,0.2)_transparent]",
          )}
        >
          <ContactsSidebar />
        </aside>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0"
            data-admin-main
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
