import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { formatBlogDate, formatReadingTime } from "@/components/blog/format";
import ArticleShare from "@/components/blog/ArticleShare";

type BlogPostHeaderProps = {
  post: BlogPost;
};

/**
 * Premium editorial article hero — category, title, meta, cover, share.
 */
export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  const dateLabel = formatBlogDate(post.publishedAt);

  return (
    <header className="space-y-8 md:space-y-10" dir="rtl">
      <div className="rio-container">
        <Link
          href="/blog"
          className="group/back inline-flex items-center gap-1.5 text-xs font-semibold text-[#0B3A5C]/55 transition-colors duration-200 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
        >
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover/back:translate-x-0.5"
            aria-hidden
          />
          بازگشت به مجله
        </Link>

        <div className="mt-6 max-w-3xl">
          <p className="inline-flex items-center rounded-full border border-sky-200/70 bg-white/70 px-3 py-1 text-[11px] font-semibold tracking-wide text-sky-700 shadow-sm backdrop-blur-md md:text-xs">
            {post.category}
          </p>

          <h1 className="mt-4 font-vazirmatn text-[clamp(1.65rem,3.8vw,2.75rem)] font-black leading-[1.35] tracking-tight text-[#0B3A5C]">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#0B3A5C]/70 md:text-base md:leading-8">
              {post.excerpt}
            </p>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#0B3A5C]/8 pt-5">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#0B3A5C]/55 md:text-[13px]">
              <span>
                نوشته شده توسط{" "}
                <span className="font-semibold text-[#0B3A5C]/75">{post.author.name}</span>
              </span>
              {dateLabel ? (
                <time dateTime={post.publishedAt}>{dateLabel}</time>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5 text-sky-500" aria-hidden />
                {formatReadingTime(post.readingTime)}
              </span>
            </div>
            <ArticleShare title={post.title} />
          </div>
        </div>
      </div>

      {post.coverImage ? (
        <div className="rio-container">
          <figure className="group relative overflow-hidden rounded-[1.5rem] border border-[#0B3A5C]/8 bg-[#E8F1F8] shadow-[0_28px_70px_-48px_rgba(11,58,92,0.4)] md:rounded-[1.75rem]">
            <div className="relative aspect-[16/10] w-full md:aspect-[21/9]">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 92vw, 1120px"
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.02]"
                unoptimized={post.coverImage.startsWith("/uploads/")}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B3A5C]/25 via-transparent to-transparent"
              />
            </div>
          </figure>
        </div>
      ) : null}
    </header>
  );
}
