"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useCallback, useState, type ReactNode } from "react";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

type IosTapProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  haptic?: boolean;
  asChild?: boolean;
};

/**
 * تپ iOS: scale روی pointerdown با spring سریع، بدون تأخیر ۳۰۰ms کلیک موبایل.
 */
export default function IosTap({
  children,
  className,
  haptic = false,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
  disabled,
  ...rest
}: IosTapProps) {
  const [pressed, setPressed] = useState(false);
  const vibrate = useHaptic();

  const press = useCallback(
    (active: boolean) => {
      if (disabled) return;
      setPressed(active);
      if (active && haptic) vibrate(8);
    },
    [disabled, haptic, vibrate],
  );

  return (
    <motion.button
      type="button"
      disabled={disabled}
      className={cn("ios-tap-target relative", className)}
      animate={{ scale: pressed ? 0.96 : 1 }}
      transition={IOS_TAP_SPRING}
      style={{ willChange: pressed ? "transform" : "auto" }}
      onPointerDown={(e) => {
        press(true);
        onPointerDown?.(e);
      }}
      onPointerUp={(e) => {
        press(false);
        onPointerUp?.(e);
      }}
      onPointerCancel={(e) => {
        press(false);
        onPointerCancel?.(e);
      }}
      onPointerLeave={(e) => {
        press(false);
        onPointerLeave?.(e);
      }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
