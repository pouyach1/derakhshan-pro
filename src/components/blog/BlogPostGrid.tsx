import type { BlogPost } from "@/types/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";

type BlogPostGridProps = {
  posts: BlogPost[];
};

/**
 * Editorial article grid — 1 col mobile, 2 tablet, 3 desktop.
 * First card gets wider emphasis for visual rhythm when enough posts exist.
 */
export default function BlogPostGrid({ posts }: BlogPostGridProps) {
  if (!posts.length) {
    return (
      <p className="rounded-[1.5rem] border border-[#0B3A5C]/8 bg-white/80 px-4 py-14 text-center text-sm text-[#0B3A5C]/55 backdrop-blur-md">
        مقاله‌ای برای نمایش نیست.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6" dir="rtl">
      {posts.map((post, index) => (
        <BlogPostCard
          key={post.id}
          post={post}
          emphasis={index === 0 && posts.length > 2 ? "wide" : "default"}
        />
      ))}
    </div>
  );
}
