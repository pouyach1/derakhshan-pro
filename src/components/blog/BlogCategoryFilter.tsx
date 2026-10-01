"use client";

import { BLOG_CATEGORIES } from "@/data/blog";
import { cn } from "@/lib/utils";

type BlogCategoryFilterProps = {
  activeCategory?: string | null;
  onChange?: (category: string | null) => void;
};

/**
 * Interactive category chips — horizontal scroll on narrow viewports.
 */
export default function BlogCategoryFilter({
  activeCategory = null,
  onChange,
}: BlogCategoryFilterProps) {
  const items = ["همه", ...BLOG_CATEGORIES] as const;

  return (
    <nav aria-label="دسته‌بندی مطالب" dir="rtl">
      <div
        role="radiogroup"
        aria-label="فیلتر دسته‌بندی"
        className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100/80 bg-white/65 p-1.5 shadow-[0_16px_40px_-32px_rgba(11,58,92,0.35)] backdrop-blur-xl">
          {items.map((category) => {
            const isAll = category === "همه";
            const active = isAll ? !activeCategory : activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onChange?.(isAll ? null : category)}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition duration-200 ease-out md:px-4 md:text-[13px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white/40",
                  active
                    ? "bg-[#0B3A5C] text-white shadow-sm"
                    : "bg-transparent text-[#0B3A5C]/70 hover:bg-sky-50 hover:text-[#0B3A5C] active:bg-sky-100/80",
                )}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
