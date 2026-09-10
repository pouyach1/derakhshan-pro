"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import AdminHeader from "@/components/admin/AdminHeader";
import ContactsSidebar from "@/components/admin/ContactsSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const contactsScrollRef = useRef<HTMLElement>(null);
  const isDashboard = pathname === "/admin/dashboard";

  useEffect(() => {
    if (!isDashboard) return;

    const onWheel = (event: WheelEvent) => {
      const sidebar = contactsScrollRef.current;
      if (!sidebar) return;

      // Touchpads / nested scrollables: if event targets an element that can scroll itself
      // (e.g. the carousel), let it handle wheel unless it's the sidebar priority phase.
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-wheel-self]")) return;

      const maxScroll = sidebar.scrollHeight - sidebar.clientHeight;
      if (maxScroll <= 1) return; // nothing to prioritize

      const atTop = sidebar.scrollTop <= 1;
      const atBottom = sidebar.scrollTop >= maxScroll - 1;
      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;
      const pageAtTop = window.scrollY <= 1;

      // Priority 1: drain contacts sidebar before the page moves down.
      if (scrollingDown && !atBottom) {
        event.preventDefault();
        sidebar.scrollTop = Math.min(maxScroll, sidebar.scrollTop + event.deltaY);
        return;
      }

      // When returning upward at the top of the page, refill the sidebar first.
      if (scrollingUp && pageAtTop && !atTop) {
        event.preventDefault();
        sidebar.scrollTop = Math.max(0, sidebar.scrollTop + event.deltaY);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isDashboard]);

  return (
    <div dir="rtl" lang="fa" className="min-h-dvh bg-admin-canvas font-vazir text-slate-900 antialiased">
      <AdminHeader />

      <div className="mx-auto grid max-w-[1600px] gap-4 px-4 py-4 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-5 lg:px-6 lg:py-6">
        <div className="h-fit lg:sticky lg:top-6 lg:self-start">
          <ContactsSidebar scrollRef={contactsScrollRef} />
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
