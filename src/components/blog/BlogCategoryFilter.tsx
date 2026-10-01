import { BLOG_CATEGORIES } from "@/data/blog";
import { cn } from "@/lib/utils";

type BlogCategoryFilterProps = {
  activeCategory?: string | null;
};

/**
 * Premium category navigation — display-only in Phase 2 (filtering later).
 * Horizontal scroll on narrow viewports; no ugly multi-line wrap.
 */
export default function BlogCategoryFilter({
  activeCategory = null,
}: BlogCategoryFilterProps) {
  const items = ["همه", ...BLOG_CATEGORIES] as const;

  return (
    <nav aria-label="دسته‌بندی مطالب" dir="rtl">
      <div className="overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-100/80 bg-white/65 p-1.5 shadow-[0_16px_40px_-32px_rgba(11,58,92,0.35)] backdrop-blur-xl">
          {items.map((category) => {
            const active =
              category === "همه" ? !activeCategory : activeCategory === category;
            return (
              <span
                key={category}
                className={cn(
                  "shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition md:px-4 md:text-[13px]",
                  active
                    ? "bg-[#0B3A5C] text-white shadow-sm"
                    : "bg-transparent text-[#0B3A5C]/70 hover:bg-sky-50 hover:text-[#0B3A5C]",
                )}
              >
                {category}
              </span>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
