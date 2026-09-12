"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type AuthToastProps = {
  open: boolean;
  message: string;
};

export default function AuthToast({ open, message }: AuthToastProps) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-[80] flex w-[min(92vw,24rem)] -translate-x-1/2 items-center gap-3 rounded-2xl border border-emerald-200/80 bg-white/95 px-4 py-3 text-sm text-emerald-800 shadow-xl shadow-emerald-900/10 backdrop-blur-md"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" strokeWidth={1.9} />
          </span>
          <p className="font-vazirmatn leading-relaxed">{message}</p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
