import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPostHeader from "@/components/blog/BlogPostHeader";
import BlogPostContent from "@/components/blog/BlogPostContent";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ArticleReadingProgress from "@/components/blog/ArticleReadingProgress";
import ArticleAuthor from "@/components/blog/ArticleAuthor";
import ArticleCTA from "@/components/blog/ArticleCTA";
import { getRelatedBlogPosts, getPublishedBlogPosts } from "@/data/blog";
import { decodeBlogSlugParam } from "@/lib/blog/slug";
import { getSessionFromRequest } from "@/server/http/guard";
import { getBlogPostBySlug } from "@/server/services/blog";
import { siteConfig } from "@/config/siteConfig";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Always read live store — newly published posts must not 404 behind static cache. */
export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

async function loadPostForRequest(rawSlug: string) {
  const slug = decodeBlogSlugParam(rawSlug);
  const session = await getSessionFromRequest();

  // Public published first.
  let post = await getBlogPostBySlug(slug, { publicOnly: true });
  let isPreview = false;

  // Staff may preview drafts / unpublished they can access.
  if (!post && session && (session.role === "admin" || session.role === "agent")) {
    post = await getBlogPostBySlug(slug, { publicOnly: false, session });
    if (post && post.status !== "published") isPreview = true;
  }

  return { post, isPreview, slug };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug: raw } = await params;
  const { post } = await loadPostForRequest(raw);
  if (!post || post.status !== "published") {
    return { title: `مقاله یافت نشد | ${siteConfig.brand.nameFa}` };
  }
  const canonical = `/blog/${post.slug}`;
  return {
    title: `${post.title} | مجله ${siteConfig.brand.nameFa}`,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: canonical,
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug: raw } = await params;
  const { post, isPreview } = await loadPostForRequest(raw);

  if (!post) {
    notFound();
  }

  const related = await getRelatedBlogPosts(post, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? [new URL(post.coverImage, siteConfig.seo.url).toString()] : undefined,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brand.nameFa,
      url: siteConfig.seo.url,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/blog/${post.slug}`, siteConfig.seo.url).toString(),
    },
  };

  return (
    <article className="relative bg-[#F3F7FB] text-[#0B3A5C]" dir="rtl">
      {post.status === "published" ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      {isPreview ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm font-medium text-amber-900">
          پیش‌نمایش داخلی — این مقاله هنوز منتشر نشده و برای عموم نمایش داده نمی‌شود.
        </div>
      ) : null}

      <ArticleReadingProgress targetId="article-body" />

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
