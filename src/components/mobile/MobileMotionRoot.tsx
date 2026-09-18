"use client";

import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";

/** LayoutGroup برای shared-element بین مسیرهای بازاریابی موبایل */
export default function MobileMotionRoot({ children }: { children: ReactNode }) {
  return <LayoutGroup id="mobile-marketing">{children}</LayoutGroup>;
}
