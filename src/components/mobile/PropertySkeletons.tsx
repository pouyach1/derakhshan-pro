"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SkeletonPulseProps = {
  className?: string;
};

export function SkeletonPulse({ className }: SkeletonPulseProps) {
  return (
    <motion.div
      aria-hidden
      className={cn("rounded-2xl bg-white/[0.07]", className)}
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{ duration: 1.35, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

/** اسکلتون کارت ملک — جایگزین اسپینر متنی */
export function PropertyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.04]">
      <SkeletonPulse className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <SkeletonPulse className="h-3 w-16 rounded-full" />
        <SkeletonPulse className="h-5 w-[88%] rounded-lg" />
        <SkeletonPulse className="h-4 w-2/3 rounded-lg" />
        <SkeletonPulse className="h-4 w-1/3 rounded-lg" />
        <div className="flex gap-3 pt-1">
          <SkeletonPulse className="h-3 w-10 rounded-full" />
          <SkeletonPulse className="h-3 w-10 rounded-full" />
          <SkeletonPulse className="h-3 w-12 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function PropertyCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4" role="status" aria-label="در حال بارگذاری فایل‌ها">
      {Array.from({ length: count }, (_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** اسکلتون تصویر هدر جزئیات */
export function PropertyDetailSkeleton() {
  return (
    <div className="bg-[#070C18] px-4 pb-24 pt-24 text-white lg:hidden" role="status" aria-label="در حال بارگذاری">
      <SkeletonPulse className="aspect-[4/3] w-full rounded-[1.5rem]" />
      <div className="mt-5 space-y-3">
        <SkeletonPulse className="h-3 w-40 rounded-full" />
        <SkeletonPulse className="h-8 w-[92%] rounded-xl" />
        <SkeletonPulse className="h-4 w-2/3 rounded-lg" />
        <SkeletonPulse className="h-6 w-1/3 rounded-lg" />
        <div className="grid grid-cols-3 gap-2 pt-2">
          <SkeletonPulse className="h-16 rounded-2xl" />
          <SkeletonPulse className="h-16 rounded-2xl" />
          <SkeletonPulse className="h-16 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
