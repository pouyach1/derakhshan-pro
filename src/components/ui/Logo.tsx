"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/config/site";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  href = "/",
  onDark = false,
}: {
  className?: string;
  href?: string;
  onDark?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      className={cn("group inline-flex flex-col items-start", className)}
      aria-label={`${SITE.nameFa} — صفحه اصلی`}
    >
      <motion.span
        className={cn(
          "font-vazirmatn text-base font-semibold tracking-tight md:text-lg",
          onDark ? "text-white" : "text-[#0B3A5C]",
        )}
        whileHover={reduceMotion ? undefined : { y: -1 }}
        transition={IOS_TAP_SPRING}
      >
        {SITE.nameFa}
      </motion.span>
      <span
        className={cn(
          "mt-0.5 max-w-[14rem] font-vazirmatn text-[11px] leading-relaxed transition",
          onDark ? "text-white/70 group-hover:text-white/90" : "text-[#0B3A5C]/60 group-hover:text-[#0B3A5C]",
        )}
      >
        {SITE.taglineFa}
      </span>
    </Link>
  );
}
