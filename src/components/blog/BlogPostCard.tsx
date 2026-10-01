import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { formatBlogDate, formatReadingTime } from "@/components/blog/format";
import { cn } from "@/lib/utils";

type BlogPostCardProps = {
  post: BlogPost;
  /** Optional visual weight for editorial rhythm */
  emphasis?: "default" | "wide";
};

export default function BlogPostCard({ post, emphasis = "default" }: BlogPostCardProps) {
  const dateLabel = formatBlogDate(post.publishedAt);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-[1.45rem] border border-[#0B3A5C]/8 bg-white shadow-[0_18px_48px_-40px_rgba(11,58,92,0.35)] transition duration-300 hover:-translate-y-0.5 hover:border-sky-200/80 hover:shadow-[0_26px_60px_-36px_rgba(14,165,233,0.35)]",
        emphasis === "wide" && "sm:col-span-2 lg:col-span-2",
      )}
      dir="rtl"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={cn(
          "relative block overflow-hidden bg-[#E8F1F8]",
          emphasis === "wide" ? "aspect-[16/9] sm:aspect-[21/9]" : "aspect-[16/10]",
        )}
        aria-label={post.title}
      >
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={
            emphasis === "wide"
              ? "(max-width: 1024px) 100vw, 66vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          }
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.035]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B3A5C]/35 via-transparent to-transparent opacity-80" />
        <span className="absolute start-3 top-3 rounded-full border border-white/45 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#0B3A5C] shadow-sm backdrop-blur-md">
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className="font-vazirmatn text-base font-bold leading-7 text-[#0B3A5C] transition group-hover:text-sky-700 md:text-[1.05rem] md:leading-8">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#0B3A5C]/65">{post.excerpt}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-[#0B3A5C]/8 pt-3.5 mt-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#0B3A5C]/50">
            <span className="font-medium text-[#0B3A5C]/65">{post.author.name}</span>
            {dateLabel ? <span>{dateLabel}</span> : null}
            <span className="inline-flex items-center gap-1">
              <Clock3 className="h-3 w-3 text-sky-500" />
              {formatReadingTime(post.readingTime)}
            </span>
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3A5C] transition group-hover:text-sky-600"
          >
            بخوانید
            <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
