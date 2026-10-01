import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";

type RelatedPostsProps = {
  posts: BlogPost[];
  title?: string;
};

/**
 * Related editorial strip — Phase 2 card language, clear section identity.
 */
export default function RelatedPosts({
  posts,
  title = "مطالب مرتبط",
}: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="space-y-6" aria-label={title} dir="rtl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] text-sky-600">RELATED</p>
          <h2 className="mt-2 font-vazirmatn text-xl font-bold text-[#0B3A5C] md:text-2xl">
            {title}
          </h2>
        </div>
        <Link
          href="/blog"
          className="text-xs font-semibold text-[#0B3A5C]/55 transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60"
        >
          همه مطالب مجله
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
