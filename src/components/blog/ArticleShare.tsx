"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

type ArticleShareProps = {
  title: string;
  className?: string;
};

/**
 * Subtle share control — native share when available, otherwise copy link.
 */
export default function ArticleShare({ title, className }: ArticleShareProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      /* cancelled or unavailable — fall through */
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-sky-100/90 bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#0B3A5C]/75 shadow-sm backdrop-blur-md transition hover:border-sky-200 hover:bg-white hover:text-[#0B3A5C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60",
        className,
      )}
      aria-label={copied ? "لینک کپی شد" : "اشتراک‌گذاری مقاله"}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-sky-600" aria-hidden />
          لینک کپی شد
        </>
      ) : (
        <>
          <Share2 className="h-3.5 w-3.5 text-sky-600" aria-hidden />
          اشتراک‌گذاری
        </>
      )}
    </button>
  );
}
