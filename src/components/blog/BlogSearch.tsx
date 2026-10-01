"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  resultCount?: number;
  className?: string;
};

/**
 * Premium crystal editorial search control for /blog archive.
 */
export default function BlogSearch({
  value,
  onChange,
  onClear,
  resultCount,
  className,
}: BlogSearchProps) {
  const active = value.trim().length > 0;

  return (
    <div className={cn("w-full", className)} dir="rtl">
      <label htmlFor="blog-search" className="sr-only">
        جستجو در مجله
      </label>
      <div
        className={cn(
          "group relative flex h-12 items-center gap-2 rounded-full border bg-white/65 px-4 shadow-[0_16px_40px_-32px_rgba(11,58,92,0.35)] backdrop-blur-xl transition duration-300 ease-out",
          "border-sky-100/80",
          "focus-within:border-sky-300/80 focus-within:bg-white/90 focus-within:shadow-[0_22px_50px_-28px_rgba(14,165,233,0.35)] focus-within:ring-4 focus-within:ring-sky-400/15",
          active && "border-sky-200/90 bg-white/85",
        )}
      >
        <Search
          className="h-4 w-4 shrink-0 text-sky-500 transition duration-200 group-focus-within:text-sky-600"
          aria-hidden
        />
        <input
          id="blog-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="جستجو در عنوان، دسته، نویسنده…"
          autoComplete="off"
          className="h-full w-full min-w-0 bg-transparent text-sm text-[#0B3A5C] outline-none placeholder:text-[#0B3A5C]/40 [&::-webkit-search-cancel-button]:hidden"
        />
        {active ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#0B3A5C]/45 transition duration-200 hover:bg-sky-50 hover:text-[#0B3A5C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
            aria-label="پاک کردن جستجو"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
      {active && typeof resultCount === "number" ? (
        <p className="mt-2 text-xs text-[#0B3A5C]/50" aria-live="polite">
          {resultCount.toLocaleString("fa-IR")} نتیجه
        </p>
      ) : null}
    </div>
  );
}
