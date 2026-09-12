"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const glass =
  "rounded-[1.75rem] border border-slate-200/80 bg-white/70 shadow-2xl shadow-slate-200/50 backdrop-blur-xl";

export function AnimatedCounter({
  value,
  duration = 950,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <span className={cn("tabular-nums", className)}>
      {display.toLocaleString("fa-IR")}
    </span>
  );
}
