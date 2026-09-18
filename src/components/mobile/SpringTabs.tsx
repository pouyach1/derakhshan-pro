"use client";

import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { IOS_PAGE_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

export type SpringTabItem<T extends string> = {
  id: T;
  label: string;
};

type SpringTabsProps<T extends string> = {
  items: SpringTabItem<T>[];
  value: T;
  onChange: (id: T) => void;
  className?: string;
};

/**
 * تب‌ها با underline/indicator که با spring بین تب‌ها اسلاید می‌کند.
 */
export default function SpringTabs<T extends string>({
  items,
  value,
  onChange,
  className,
}: SpringTabsProps<T>) {
  const listRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const vibrate = useHaptic();

  useLayoutEffect(() => {
    const btn = btnRefs.current.get(value);
    const list = listRef.current;
    if (!btn || !list) return;
    const listRect = list.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    setIndicator({
      left: btnRect.left - listRect.left + list.scrollLeft,
      width: btnRect.width,
    });
  }, [value, items]);

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn("relative flex gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10", className)}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
            ref={(node) => {
              if (node) btnRefs.current.set(item.id, node);
              else btnRefs.current.delete(item.id);
            }}
            type="button"
            role="tab"
            aria-selected={active}
            className={cn(
              "ios-tap-target relative z-10 flex-1 rounded-full px-3 py-2 text-sm transition-colors",
              active ? "text-slate-950" : "text-slate-400",
            )}
            onClick={() => {
              if (item.id === value) return;
              vibrate(8);
              onChange(item.id);
            }}
          >
            {item.label}
          </button>
        );
      })}
      <motion.div
        aria-hidden
        className="absolute inset-y-1 z-0 rounded-full bg-cyan-400"
        initial={false}
        animate={{ x: indicator.left, width: indicator.width }}
        transition={IOS_PAGE_SPRING}
        style={{ left: 0, willChange: "transform, width" }}
      />
    </div>
  );
}
