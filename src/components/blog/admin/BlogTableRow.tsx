import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import type { BlogPost } from "@/types/blog";
import BlogStatusBadge from "@/components/blog/admin/BlogStatusBadge";
import BlogDeleteButton from "@/components/blog/admin/BlogDeleteButton";
import { formatBlogDate, formatReadingTime } from "@/components/blog/format";

type BlogTableRowProps = {
  post: BlogPost;
  /** Management root, e.g. /admin/blog or /agent/blog */
  basePath: string;
};

export default function BlogTableRow({ post, basePath }: BlogTableRowProps) {
  const dateLabel = formatBlogDate(post.publishedAt);
  const canPreview = post.status === "published";

  return (
    <tr className="border-b border-slate-100/90 text-sm text-[#0B3A5C] transition hover:bg-sky-50/40">
      <td className="px-3 py-3.5">
        <Link
          href={`${basePath}/${post.id}`}
          className="font-semibold transition hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
        >
          {post.title}
        </Link>
        <p className="mt-1 text-[11px] text-[#0B3A5C]/45 sm:hidden">{post.category}</p>
      </td>
      <td className="hidden px-3 py-3.5 sm:table-cell">{post.category}</td>
      <td className="hidden px-3 py-3.5 md:table-cell">{post.author.name}</td>
      <td className="px-3 py-3.5">
        <BlogStatusBadge status={post.status} />
      </td>
      <td className="hidden px-3 py-3.5 lg:table-cell">
        {dateLabel ?? "—"}
      </td>
      <td className="hidden px-3 py-3.5 xl:table-cell tabular-nums text-[#0B3A5C]/65">
        {formatReadingTime(post.readingTime)}
      </td>
      <td className="px-3 py-3.5">
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {canPreview ? (
            <Link
              href={`/blog/${post.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B3A5C]/70 ring-1 ring-sky-100 transition hover:bg-sky-50 hover:text-[#0B3A5C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
              aria-label={`پیش‌نمایش ${post.title}`}
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              مشاهده
            </Link>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B3A5C]/35 ring-1 ring-slate-100"
              title="پیش‌نمایش عمومی فقط برای مقالات منتشرشده"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden />
              مشاهده
            </span>
          )}
          <Link
            href={`${basePath}/${post.id}`}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B3A5C] ring-1 ring-sky-100 transition hover:bg-sky-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/50"
            aria-label={`ویرایش ${post.title}`}
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden />
            ویرایش
          </Link>
          <BlogDeleteButton postId={post.id} title={post.title} />
        </div>
      </td>
    </tr>
  );
}
