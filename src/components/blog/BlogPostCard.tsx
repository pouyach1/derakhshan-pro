import Link from "next/link";
import type { BlogPost } from "@/types/blog";

type BlogPostCardProps = {
  post: BlogPost;
};

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="rounded-2xl border border-[#0B3A5C]/10 bg-white p-4" dir="rtl">
      <p className="text-[11px] font-semibold text-sky-600">{post.category}</p>
      <h3 className="mt-2 font-vazirmatn text-base font-bold leading-7 text-[#0B3A5C]">
        <Link href={`/blog/${post.slug}`} className="hover:text-sky-700">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#0B3A5C]/65">{post.excerpt}</p>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#0B3A5C]/50">
        <span>{post.author.name}</span>
        <span>{post.readingTime.toLocaleString("fa-IR")} دقیقه</span>
        <span dir="ltr">{post.slug}</span>
      </div>
    </article>
  );
}
