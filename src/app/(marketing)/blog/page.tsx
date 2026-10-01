import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogFeaturedPost from "@/components/blog/BlogFeaturedPost";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import { getPublishedBlogPosts } from "@/data/blog";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `مجله املاک | ${siteConfig.brand.nameFa}`,
  description:
    "مجله تخصصی املاک درخشان: تحلیل بازار، راهنمای خرید و فروش، سرمایه‌گذاری و معرفی محله‌های کرج.",
};

export default function BlogIndexPage() {
  const posts = getPublishedBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-[#F3F7FB] text-[#0B3A5C]" dir="rtl">
      <BlogHero />

      <div className="rio-container space-y-10 py-10 md:space-y-14 md:py-14 lg:space-y-16 lg:py-16">
        {featured ? (
          <section aria-label="مقاله منتخب">
            <BlogFeaturedPost post={featured} />
          </section>
        ) : null}

        <section className="space-y-6" aria-label="دسته‌بندی و فهرست مقالات">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">ARCHIVE</p>
            <h2 className="font-vazirmatn text-xl font-bold md:text-2xl">آخرین مطالب</h2>
          </div>

          <BlogCategoryFilter />

          <BlogPostGrid posts={rest} />
        </section>

        {/* Editorial rhythm — restrained closing band before footer */}
        <section className="relative overflow-hidden rounded-[1.75rem] border border-sky-100/80 bg-white/55 px-6 py-8 shadow-[0_24px_60px_-44px_rgba(11,58,92,0.35)] backdrop-blur-xl md:px-10 md:py-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(125,211,252,0.22),transparent_55%)]"
          />
          <div className="relative z-10 grid gap-4 md:grid-cols-12 md:items-center">
            <div className="md:col-span-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-sky-600">DERAKHSHAN JOURNAL</p>
              <p className="mt-2 max-w-2xl font-vazirmatn text-lg font-bold leading-8 text-[#0B3A5C] md:text-xl">
                هر معامله ارزش یک نگاه دقیق‌تر را دارد.
              </p>
              <p className="mt-2 max-w-xl text-sm leading-7 text-[#0B3A5C]/65">
                از تحلیل بازار تا نکات قرارداد — محتوایی برای تصمیم‌گیری آرام‌تر و حرفه‌ای‌تر.
              </p>
            </div>
            <div className="md:col-span-4 md:text-start">
              <p className="text-xs leading-6 text-[#0B3A5C]/45">
                {posts.length.toLocaleString("fa-IR")} مطلب منتشرشده در آرشیو فعلی
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="h-8 md:h-12" aria-hidden />
    </div>
  );
}
