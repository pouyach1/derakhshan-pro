"use client";

import { LayoutGroup } from "framer-motion";
import type { ReactNode } from "react";
import MobilePageTransition from "@/components/mobile/MobilePageTransition";

/**
 * ریشهٔ موشن موبایل: LayoutGroup برای shared-element + انتقال صفحه با spring.
 */
export default function MobileMotionRoot({ children }: { children: ReactNode }) {
  return (
    <LayoutGroup id="mobile-marketing">
      <MobilePageTransition>{children}</MobilePageTransition>
    </LayoutGroup>
  );
}
