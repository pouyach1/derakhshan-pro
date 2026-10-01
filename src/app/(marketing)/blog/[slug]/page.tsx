import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ArticleReadingProgress from "@/components/blog/ArticleReadingProgress";
import ArticleAuthor from "@/components/blog/ArticleAuthor";
import ArticleCTA from "@/components/blog/ArticleCTA";
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
    title: `${post.title} | مجله ${siteConfig.brand.nameFa}`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  const relatedSameCategory = getRelatedBlogPosts(post);
  const related =
    relatedSameCategory.length >= 3
      ? relatedSameCategory
      : [
          ...relatedSameCategory,
          ...getPublishedBlogPosts()
            .filter(
              (item) =>
                item.id !== post.id &&
                !relatedSameCategory.some((related) => related.id === item.id),
            )
            .slice(0, 3 - relatedSameCategory.length),
        ];

  return (
    <article className="relative bg-[#F3F7FB] text-[#0B3A5C]" dir="rtl">
      <ArticleReadingProgress targetId="article-body" />

      {/* Subtle editorial atmosphere — matches Phase 2 crystal language */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,rgba(125,211,252,0.22),transparent_60%)]"
      />

      <div className="relative z-10 space-y-10 pb-10 pt-8 md:space-y-14 md:pb-14 md:pt-12 lg:space-y-16 lg:pb-16">
        <BlogPostHeader post={post} />

        <div className="rio-container">
          <div className="mx-auto max-w-[42rem]" id="article-body">
            <BlogPostContent content={post.content} />
          </div>
        </div>

        <div className="rio-container space-y-10 md:space-y-12">
          <div className="mx-auto max-w-[42rem] space-y-8">
            <ArticleAuthor author={post.author} />
            <ArticleCTA />
          </div>

          <RelatedPosts posts={related} />
        </div>

        <div className="h-6 md:h-10" aria-hidden />
      </div>
    </article>
  );
}
