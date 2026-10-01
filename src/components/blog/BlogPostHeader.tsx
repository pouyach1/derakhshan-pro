import type { BlogPost } from "@/types/blog";

type BlogPostHeaderProps = {
  post: BlogPost;
};

export default function BlogPostHeader({ post }: BlogPostHeaderProps) {
  return (
    <header className="space-y-3" dir="rtl">
      <p className="text-xs font-semibold text-sky-600">{post.category}</p>
      <h1 className="font-vazirmatn text-3xl font-bold leading-relaxed text-[#0B3A5C] md:text-4xl">
        {post.title}
      </h1>
      <p className="text-sm leading-7 text-[#0B3A5C]/70">{post.excerpt}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#0B3A5C]/55">
        <span>{post.author.name}</span>
        <span>{post.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه</span>
        {post.publishedAt ? (
          <span>
            {new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
              new Date(post.publishedAt),
            )}
          </span>
        ) : null}
      </div>
    </header>
  );
}
