import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogFeaturedPost from "@/components/blog/BlogFeaturedPost";
import BlogCategoryFilter from "@/components/blog/BlogCategoryFilter";
import BlogPostGrid from "@/components/blog/BlogPostGrid";
import { getPublishedBlogPosts } from "@/data/blog";
import { siteConfig } from "@/config/siteConfig";

export const metadata: Metadata = {
  title: `مجله | ${siteConfig.brand.nameFa}`,
  description: "راهنمای خرید، فروش و سرمایه‌گذاری در بازار املاک کرج",
};

export default function BlogIndexPage() {
  const posts = getPublishedBlogPosts();
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="bg-[#F3F7FB] pb-20" dir="rtl">
      <BlogHero />
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 md:px-6">
        <BlogCategoryFilter />
        {featured ? <BlogFeaturedPost post={featured} /> : null}
        <BlogPostGrid posts={rest} />
      </div>
    </div>
  );
}
