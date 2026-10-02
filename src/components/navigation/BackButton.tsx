"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type BackButtonProps = {
  /** Used when history cannot go back (direct entry / refresh). */
  fallbackHref: string;
  label?: string;
  className?: string;
  /** Prefer history.back(); falls back to fallbackHref. */
  preferHistory?: boolean;
  tone?: "light" | "dark" | "soft";
};

/**
 * RTL back control — ArrowRight points toward previous in Persian layouts.
 */
export default function BackButton({
  fallbackHref,
  label = "بازگشت",
  className,
  preferHistory = true,
  tone = "soft",
}: BackButtonProps) {
  const router = useRouter();

  function onClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (!preferHistory) return;
    if (typeof window === "undefined") return;
    // Only use history when there is an in-app previous entry.
    if (window.history.length > 1) {
      event.preventDefault();
      router.back();
    }
  }

  return (
    <Link
      href={fallbackHref}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition",
        tone === "dark" &&
          "bg-white/10 text-white ring-1 ring-white/15 hover:bg-white/15",
        tone === "light" &&
          "bg-white text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300",
        tone === "soft" &&
          "bg-admin-soft text-admin-navy ring-1 ring-slate-200/70 hover:bg-white hover:text-admin-sky",
        className,
      )}
    >
      <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </Link>
  );
}
