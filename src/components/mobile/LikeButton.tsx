"use client";

import { motion, useAnimationControls } from "framer-motion";
import { Heart } from "lucide-react";
import { useCallback, useState } from "react";
import { IOS_TAP_SPRING } from "@/lib/motion/ios";
import { useHaptic } from "@/hooks/useHaptic";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  className?: string;
  propertyId: string;
  initialLiked?: boolean;
};

const STORAGE_KEY = "derakhshan-liked-properties";

function readLiked(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) && parsed.includes(id);
  } catch {
    return false;
  }
}

function writeLiked(id: string, liked: boolean) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    const next = liked ? Array.from(new Set([...list, id])) : list.filter((x) => x !== id);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* ignore quota / private mode */
  }
}

/**
 * دکمه لایک/ذخیره با bounce/pop هنگام تپ.
 */
export default function LikeButton({ className, propertyId, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(() => initialLiked ?? readLiked(propertyId));
  const controls = useAnimationControls();
  const vibrate = useHaptic();

  const toggle = useCallback(async () => {
    const next = !liked;
    setLiked(next);
    writeLiked(propertyId, next);
    vibrate(next ? [8, 20, 8] : 8);
    await controls.start({
      scale: [1, 1.35, 0.88, 1.12, 1],
      transition: { duration: 0.42, times: [0, 0.22, 0.45, 0.72, 1], ease: "easeOut" },
    });
  }, [controls, liked, propertyId, vibrate]);

  return (
    <motion.button
      type="button"
      aria-label={liked ? "حذف از ذخیره‌ها" : "ذخیره ملک"}
      aria-pressed={liked}
      className={cn(
        "ios-tap-target inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white ring-1 ring-white/15 backdrop-blur-md",
        className,
      )}
      animate={controls}
      whileTap={{ scale: 0.9 }}
      transition={IOS_TAP_SPRING}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void toggle();
      }}
    >
      <Heart
        className={cn("h-4 w-4 transition-colors", liked ? "fill-rose-400 text-rose-400" : "text-white")}
        strokeWidth={liked ? 0 : 2}
      />
    </motion.button>
  );
}
