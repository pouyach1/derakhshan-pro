import type { BlogPost } from "@/types/blog";
import BlogPostCard from "@/components/blog/BlogPostCard";

type RelatedPostsProps = {
  posts: BlogPost[];
  title?: string;
};

export default function RelatedPosts({
  posts,
  title = "مطالب مرتبط",
}: RelatedPostsProps) {
  if (!posts.length) return null;

  return (
    <section className="space-y-4" dir="rtl">
      <h2 className="font-vazirmatn text-xl font-bold text-[#0B3A5C]">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <BlogPostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
