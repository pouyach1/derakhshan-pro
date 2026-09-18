"use client";

import { motion } from "framer-motion";
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
  /** جدا کردن layoutId وقتی چند گروه تب در صفحه هست */
  layoutGroupId?: string;
};

/**
 * تب‌ها با indicator که با spring (layoutId) بین تب‌ها اسلاید می‌کند.
 */
export default function SpringTabs<T extends string>({
  items,
  value,
  onChange,
  className,
  layoutGroupId = "spring-tabs",
}: SpringTabsProps<T>) {
  const vibrate = useHaptic();

  return (
    <div
      role="tablist"
      className={cn("relative flex gap-1 rounded-full bg-white/[0.04] p-1 ring-1 ring-white/10", className)}
    >
      {items.map((item) => {
        const active = item.id === value;
        return (
          <button
            key={item.id}
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
            {active ? (
              <motion.span
                layoutId={`${layoutGroupId}-indicator`}
                className="absolute inset-0 -z-10 rounded-full bg-cyan-400"
                transition={IOS_PAGE_SPRING}
                style={{ willChange: "transform" }}
              />
            ) : null}
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
