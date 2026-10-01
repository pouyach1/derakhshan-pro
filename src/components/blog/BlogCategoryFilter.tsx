import { BLOG_CATEGORIES } from "@/data/blog";

type BlogCategoryFilterProps = {
  activeCategory?: string | null;
};

/** Phase 1: structural/display-only category chips (no client filtering yet). */
export default function BlogCategoryFilter({
  activeCategory = null,
}: BlogCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" dir="rtl">
      <span
        className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
          !activeCategory
            ? "bg-[#0B3A5C] text-white ring-[#0B3A5C]"
            : "bg-white text-[#0B3A5C] ring-[#0B3A5C]/15"
        }`}
      >
        همه
      </span>
      {BLOG_CATEGORIES.map((category) => (
        <span
          key={category}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${
            activeCategory === category
              ? "bg-[#0B3A5C] text-white ring-[#0B3A5C]"
              : "bg-white text-[#0B3A5C] ring-[#0B3A5C]/15"
          }`}
        >
          {category}
        </span>
      ))}
    </div>
  );
}
