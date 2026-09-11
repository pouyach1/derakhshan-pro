"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, LayoutDashboard, LogOut } from "lucide-react";
import { clearClientSession } from "@/lib/auth";
import { cn } from "@/lib/utils";

const nav = [{ href: "/agent/dashboard", label: "داشبورد", icon: LayoutDashboard }];

export default function AgentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearClientSession();
    router.replace("/login");
    router.refresh();
  }

  return (
    <div dir="rtl" lang="fa" className="min-h-dvh bg-admin-canvas font-vazirmatn text-slate-900 antialiased">
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-admin-canvas/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-admin-navy text-white shadow-sm">
              <Building2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-admin-navy">پنل مشاور</p>
              <p className="text-xs text-slate-500">درخشان پرو</p>
            </div>
          </div>

          <nav className="flex items-center gap-1">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition",
                    active
                      ? "bg-admin-navy text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-sm text-slate-600 ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-700 hover:ring-rose-200"
            >
              <LogOut className="h-4 w-4" />
              خروج
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
