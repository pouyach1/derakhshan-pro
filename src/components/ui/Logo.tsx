"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { SITE } from "@/config/site";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { cn } from "@/lib/utils";

export default function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={href}
      className={cn("group inline-flex flex-col items-start", className)}
      aria-label={`${SITE.brandEn} — صفحه اصلی`}
    >
      <motion.span
        className="font-sans text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300 md:text-base"
        whileHover={reduceMotion ? undefined : { letterSpacing: "0.34em", color: "#A5F3FC" }}
        transition={IOS_TAP_SPRING}
      >
        {SITE.brandEn}
      </motion.span>
      <span className="mt-0.5 font-vazirmatn text-[11px] text-beige/70 transition group-hover:text-beige/90">
        {SITE.nameFa}
      </span>
    </Link>
  );
}
