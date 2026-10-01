import Link from "next/link";
import type { BlogPost } from "@/types/blog";
import BlogStatusBadge from "@/components/blog/admin/BlogStatusBadge";

type BlogTableRowProps = {
  post: BlogPost;
};

export default function BlogTableRow({ post }: BlogTableRowProps) {
  return (
    <tr className="border-b border-slate-100 text-sm text-admin-navy">
      <td className="px-3 py-3 font-semibold">
        <Link href={`/admin/blog/${post.id}`} className="hover:text-admin-sky">
          {post.title}
        </Link>
      </td>
      <td className="px-3 py-3">{post.category}</td>
      <td className="px-3 py-3">{post.author.name}</td>
      <td className="px-3 py-3">
        <BlogStatusBadge status={post.status} />
      </td>
      <td className="px-3 py-3 tabular-nums">
        {post.readingTime.toLocaleString("fa-IR")} دقیقه
      </td>
    </tr>
  );
}
