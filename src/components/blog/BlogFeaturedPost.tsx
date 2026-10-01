import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock3 } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import { formatBlogDate, formatReadingTime } from "@/components/blog/format";

type BlogFeaturedPostProps = {
  post: BlogPost;
};

/**
 * Cover-story featured article — stronger but restrained interaction.
 */
export default function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  const dateLabel = formatBlogDate(post.publishedAt);

  return (
    <article
      className="group overflow-hidden rounded-[1.75rem] border border-[#0B3A5C]/8 bg-white shadow-[0_28px_70px_-48px_rgba(11,58,92,0.4)] transition-[box-shadow,border-color,transform] duration-300 ease-out hover:border-sky-200/70 hover:shadow-[0_34px_80px_-44px_rgba(14,165,233,0.4)]"
      dir="rtl"
    >
      <div className="grid lg:grid-cols-12">
        <Link
          href={`/blog/${post.slug}`}
          className="relative block min-h-[16rem] overflow-hidden bg-[#E8F1F8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400/50 lg:col-span-7 lg:min-h-[26rem]"
          aria-label={post.title}
        >
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B3A5C]/45 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-95 lg:bg-gradient-to-l" />
          <span className="absolute start-4 top-4 z-[1] rounded-full border border-white/50 bg-white/90 px-3 py-1 text-[11px] font-semibold text-[#0B3A5C] shadow-sm backdrop-blur-md">
            منتخب تحریریه
          </span>
        </Link>

        <div className="flex flex-col justify-center gap-4 p-6 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 md:p-8 lg:col-span-5 lg:p-10">
          <p className="text-xs font-semibold tracking-wide text-sky-600">{post.category}</p>
          <h2 className="font-vazirmatn text-2xl font-black leading-9 tracking-tight text-[#0B3A5C] md:text-3xl md:leading-10">
            <Link
              href={`/blog/${post.slug}`}
              className="transition-colors duration-200 hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
            >
              {post.title}
            </Link>
          </h2>
          {post.excerpt ? (
            <p className="text-sm leading-8 text-[#0B3A5C]/70 md:text-[0.95rem]">{post.excerpt}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#0B3A5C]/55">
            <span className="font-medium text-[#0B3A5C]/70">{post.author.name}</span>
            {dateLabel ? <span>{dateLabel}</span> : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="h-3.5 w-3.5 text-sky-500" aria-hidden />
              {formatReadingTime(post.readingTime)}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-[#0B3A5C] px-5 py-2.5 text-sm font-semibold text-white transition duration-200 hover:bg-sky-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
          >
            مطالعه مقاله
            <ArrowLeft
              className="h-4 w-4 transition-transform duration-200 ease-out group-hover:-translate-x-1"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
