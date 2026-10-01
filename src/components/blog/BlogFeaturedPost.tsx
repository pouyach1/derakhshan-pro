import Link from "next/link";
import type { BlogPost } from "@/types/blog";

type BlogFeaturedPostProps = {
  post: BlogPost;
};

export default function BlogFeaturedPost({ post }: BlogFeaturedPostProps) {
  return (
    <article className="rounded-2xl border border-[#0B3A5C]/10 bg-white p-5 md:p-6" dir="rtl">
      <p className="text-xs font-semibold text-sky-600">منتخب تحریریه</p>
      <h2 className="mt-2 font-vazirmatn text-xl font-bold text-[#0B3A5C] md:text-2xl">
        <Link href={`/blog/${post.slug}`} className="hover:text-sky-700">
          {post.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-7 text-[#0B3A5C]/70">{post.excerpt}</p>
      <p className="mt-3 text-xs text-[#0B3A5C]/55">
        {post.category} · {post.author.name} · {post.readingTime.toLocaleString("fa-IR")} دقیقه مطالعه
      </p>
    </article>
  );
}
