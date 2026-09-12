"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ClientOnboardingForm from "@/components/client/ClientOnboardingForm";
import { needsClientOnboarding, readClientSession } from "@/lib/auth";

export default function ClientOnboardingPage() {
  const router = useRouter();

  useEffect(() => {
    const session = readClientSession();
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.role !== "client") {
      router.replace("/");
      return;
    }
    if (!needsClientOnboarding(session)) {
      router.replace("/");
    }
  }, [router]);

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
