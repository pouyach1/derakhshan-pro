import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import {
  getBlogPostBySlug,
  getPublishedBlogPosts,
  getRelatedBlogPosts,
} from "@/data/blog";
import { siteConfig } from "@/config/siteConfig";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || post.status !== "published") {
    return { title: `مقاله یافت نشد | ${siteConfig.brand.nameFa}` };
  }
  return {
    title: `${post.title} | ${siteConfig.brand.nameFa}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const related = getRelatedBlogPosts(post);

  return (
    <article className="bg-[#F3F7FB] pb-20" dir="rtl">
      <div className="mx-auto max-w-3xl space-y-10 px-4 py-10 md:px-6 md:py-14">
        <BlogPostHeader post={post} />
        <BlogPostContent content={post.content} />
        <RelatedPosts posts={related} />
      </div>
    </article>
  );
}
