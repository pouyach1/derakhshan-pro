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
      aria-label={`${SITE.brandEn} — صفحه اصلی`}
    >
      <motion.span
        className={cn(
          "bg-clip-text font-sans text-sm font-semibold uppercase tracking-[0.28em] text-transparent md:text-base",
          onDark
            ? "bg-gradient-to-l from-cyan-200 via-sky-300 to-cyan-400"
            : "bg-gradient-to-l from-[#0B3A5C] via-sky-600 to-sky-500",
        )}
        whileHover={reduceMotion ? undefined : { letterSpacing: "0.34em" }}
        transition={IOS_TAP_SPRING}
      >
        {SITE.brandEn}
      </motion.span>
      <span
        className={cn(
          "mt-0.5 font-vazirmatn text-[11px] transition",
          onDark ? "text-white/75 group-hover:text-white" : "text-[#0B3A5C]/65 group-hover:text-[#0B3A5C]",
        )}
      >
        {SITE.nameFa}
      </span>
    </Link>
  );
}
