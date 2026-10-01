import type { BlogPost } from "@/types/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";

type BlogPostGridProps = {
  posts: BlogPost[];
};

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
  if (!posts.length) {
    return (
      <p className="rounded-2xl bg-white px-4 py-10 text-center text-sm text-[#0B3A5C]/55 ring-1 ring-[#0B3A5C]/10">
        مقاله‌ای برای نمایش نیست.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" dir="rtl">
      {posts.map((post) => (
        <BlogPostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
