"use client";

import { useCallback } from "react";

/** هپتیک کوتاه شبیه تپ iOS — فقط در صورت پشتیبانی مرورگر */
export function useHaptic() {
  return useCallback((pattern: number | number[] = 10) => {
    if (typeof navigator === "undefined") return;
    if (typeof navigator.vibrate !== "function") return;
    try {
      navigator.vibrate(pattern);
    } catch {
      /* ignore unsupported environments */
    }
  }, []);
}
