"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ClientOnboardingForm from "@/components/client/ClientOnboardingForm";
import { homeForRole, needsClientOnboarding, type AuthSession } from "@/lib/auth";

export default function ClientOnboardingPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/auth/me");
        const payload = await res.json();
        if (!res.ok || !payload?.ok || !payload.data?.session) {
          router.replace("/login");
          return;
        }
        const session = payload.data.session as AuthSession;
        if (session.role !== "client") {
          router.replace(homeForRole(session.role));
          return;
        }
        if (!needsClientOnboarding(session)) {
          router.replace("/client/dashboard");
          return;
        }
        setReady(true);
      } catch {
        router.replace("/login");
      }
    })();
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-[#F3F7FB] text-sm text-[#0B3A5C]/55">
        در حال آماده‌سازی پروفایل…
      </main>
    );
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(16,185,129,0.12),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(148,163,184,0.18),_transparent_45%)]"
      />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full"
      >
        <ClientOnboardingForm />
      </motion.div>
    </main>
  );
}
