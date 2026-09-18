"use client";

import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";

/**
 * ریشهٔ shared-element موبایل — LayoutGroup تا layoutId کارت و جزئیات یکی بمانند.
 */
export default function MobileMotionRoot({ children }: { children: ReactNode }) {
  return <LayoutGroup id="mobile-marketing">{children}</LayoutGroup>;
}
