"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import ContactsSidebar from "@/components/admin/ContactsSidebar";

/**
 * Admin chrome only. Proportional scroll sync is owned by the dashboard page
 * (`useScrollSync`) — this shell does not intercept wheel events or lock overflow.
 */
export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div dir="rtl" lang="fa" className="min-h-dvh bg-admin-canvas font-vazir text-slate-900 antialiased">
      <AdminHeader />

      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:py-6">
        <div className="h-fit lg:sticky lg:top-6 lg:self-start">
          <ContactsSidebar />
        </div>

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
