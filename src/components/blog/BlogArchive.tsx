"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import type { BlogPost } from "@/types/blog";
import BlogFeaturedPost from "@/components/blog/BlogFeaturedPost";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogEmptyState from "@/components/blog/BlogEmptyState";
import BlogReveal from "@/components/blog/BlogReveal";
import { filterBlogPosts } from "@/lib/blog/search";

type BlogArchiveProps = {
  posts: BlogPost[];
};

/**
 * Client archive orchestrator — search + category filter + result states.
 */
export default function BlogArchive({ posts }: BlogArchiveProps) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    const id = window.setTimeout(() => {
      startTransition(() => setDebouncedQuery(query));
    }, 180);
    return () => window.clearTimeout(id);
  }, [query]);

  const isFiltering = Boolean(debouncedQuery.trim() || category);

  const filtered = useMemo(
    () => filterBlogPosts(posts, { query: debouncedQuery, category }),
    [posts, debouncedQuery, category],
  );

  const featured = !isFiltering ? posts[0] : undefined;
  const gridPosts = isFiltering ? filtered : posts.slice(1);

  function resetAll() {
    setQuery("");
    setDebouncedQuery("");
    setCategory(null);
  }

  return (
    <div className="rio-container space-y-10 py-10 md:space-y-14 md:py-14 lg:space-y-16 lg:py-16">
      {featured ? (
        <BlogReveal>
          <section aria-label="مقاله منتخب">
            <BlogFeaturedPost post={featured} />
          </section>
        </BlogReveal>
      ) : null}

      <section className="space-y-6" aria-label="دسته‌بندی و فهرست مقالات">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">ARCHIVE</p>
            <h2 className="font-vazirmatn text-xl font-bold md:text-2xl">
              {isFiltering ? "نتایج" : "آخرین مطالب"}
            </h2>
            <p className="text-xs text-[#0B3A5C]/50" aria-live="polite">
              {isFiltering
                ? `${filtered.length.toLocaleString("fa-IR")} مطلب مطابق فیلتر فعلی`
                : `${posts.length.toLocaleString("fa-IR")} مطلب در آرشیو`}
            </p>
          </div>

          <div className="w-full max-w-md lg:ms-auto">
            <BlogSearch
              value={query}
              onChange={setQuery}
              onClear={() => {
                setQuery("");
                setDebouncedQuery("");
              }}
              resultCount={isFiltering ? filtered.length : undefined}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <BlogCategoryFilter
            activeCategory={category}
            onChange={(next) => startTransition(() => setCategory(next))}
          />
          {isFiltering ? (
            <button
              type="button"
              onClick={resetAll}
              className="shrink-0 self-start text-xs font-semibold text-sky-700 transition duration-200 hover:text-sky-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 sm:self-auto"
            >
              پاک کردن همه
            </button>
          ) : null}
        </div>

        {filtered.length === 0 && isFiltering ? (
          <BlogEmptyState query={debouncedQuery} category={category} onReset={resetAll} />
        ) : (
          <BlogPostGrid posts={gridPosts} emphasizeFirst={!isFiltering} />
        )}
      </section>

      <BlogReveal delay={0.05}>
        <section className="relative overflow-hidden rounded-[1.75rem] border border-sky-100/80 bg-white/55 px-6 py-8 shadow-[0_24px_60px_-44px_rgba(11,58,92,0.35)] backdrop-blur-xl md:px-10 md:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,211,252,0.22),transparent_55%)]"
          />
          <div className="relative z-10 grid gap-4 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-sky-600">
                DERAKHSHAN JOURNAL
              </p>
              <p className="mt-2 max-w-2xl font-vazirmatn text-lg font-bold leading-8 text-[#0B3A5C] md:text-xl">
                هر معامله ارزش یک نگاه دقیق‌تر را دارد.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#0B3A5C]/65">
                از تحلیل بازار تا نکات قرارداد — محتوایی برای تصمیم‌گیری آرام‌تر و حرفه‌ای‌تر.
              </p>
            </div>
            <div className="md:col-span-4 md:text-start">
              <p className="text-xs leading-6 text-[#0B3A5C]/45">
                {(isFiltering ? filtered.length : posts.length).toLocaleString("fa-IR")} مطلب در
                نمای فعلی
              </p>
            </div>
          </div>
        </section>
      </BlogReveal>
    </div>
  );
}
