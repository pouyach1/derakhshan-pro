"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { BLOG_SECTION } from "@/lib/motion/blog";
import { cn } from "@/lib/utils";

type BlogRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Subtle section reveal — transform/opacity only; respects reduced motion. */
export default function BlogReveal({ children, className, delay = 0 }: BlogRevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{ ...BLOG_SECTION, delay }}
    >
      {children}
    </motion.div>
  );
}
