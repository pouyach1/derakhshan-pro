"use client";

import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type WorkspaceThemeToggleProps = {
  isDark: boolean;
  onToggle: () => void;
  className?: string;
};

/**
 * Icon-only light/dark switch for Admin & Agent panels.
 */
export default function WorkspaceThemeToggle({
  isDark,
  onToggle,
  className,
}: WorkspaceThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? "روشن کردن پنل" : "تاریک کردن پنل"}
      title={isDark ? "حالت روشن" : "حالت تاریک"}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50",
        isDark
          ? "bg-white/5 text-sky-300 ring-1 ring-white/10 hover:bg-white/10 hover:text-sky-200"
          : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:ring-sky-300/50 hover:text-sky-600",
        className,
      )}
    >
      {isDark ? (
        <Sun className="h-[1.125rem] w-[1.125rem]" aria-hidden strokeWidth={1.9} />
      ) : (
        <Moon className="h-[1.125rem] w-[1.125rem]" aria-hidden strokeWidth={1.9} />
      )}
    </button>
  );
}
