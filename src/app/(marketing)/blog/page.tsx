import type { Metadata } from "next";
import BlogHero from "@/components/blog/BlogHero";
import BlogArchive from "@/components/blog/BlogArchive";
import { getPublishedBlogPosts } from "@/data/blog";
import { siteConfig } from "@/config/siteConfig";

/** Live store — newly published posts must appear immediately. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `مجله املاک | ${siteConfig.brand.nameFa}`,
  description:
    "مجله تخصصی املاک درخشان: تحلیل بازار، راهنمای خرید و فروش، سرمایه‌گذاری و معرفی محله‌های کرج.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: `مجله املاک | ${siteConfig.brand.nameFa}`,
    description:
      "مجله تخصصی املاک درخشان: تحلیل بازار، راهنمای خرید و فروش، سرمایه‌گذاری و معرفی محله‌های کرج.",
    type: "website",
    url: "/blog",
    locale: "fa_IR",
    siteName: siteConfig.brand.nameFa,
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="bg-[#F3F7FB] text-[#0B3A5C]" dir="rtl">
      <BlogHero />
      <BlogArchive posts={posts} />
      <div className="h-8 md:h-12" aria-hidden />
    </div>
  );
}
