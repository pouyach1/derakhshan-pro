import type { BlogPost } from "@/types/blog";
import BlogTableRow from "@/components/blog/admin/BlogTableRow";
import BlogStatusBadge from "@/components/blog/admin/BlogStatusBadge";
import BlogDeleteButton from "@/components/blog/admin/BlogDeleteButton";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import { formatBlogDate, formatReadingTime } from "@/components/blog/format";

type BlogTableProps = {
  posts: BlogPost[];
  basePath: string;
};

export default function BlogTable({ posts, basePath }: BlogTableProps) {
  if (!posts.length) {
    return (
      <div className="rounded-[1.5rem] border border-sky-100/80 bg-white/80 px-4 py-14 text-center shadow-[0_18px_48px_-40px_rgba(11,58,92,0.3)] backdrop-blur-md">
        <p className="text-sm text-[#0B3A5C]/55">مقاله‌ای برای نمایش نیست.</p>
        <Link
          href={`${basePath}/new`}
          className="mt-4 inline-flex rounded-full bg-[#0B3A5C] px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-600"
        >
          + مقاله جدید
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-[1.5rem] border border-sky-100/80 bg-white/90 shadow-[0_18px_48px_-40px_rgba(11,58,92,0.3)] backdrop-blur-md md:block" dir="rtl">
        <div className="overflow-x-auto">
          <table className="min-w-full text-start">
            <thead className="bg-[#F3F7FB] text-xs font-semibold text-[#0B3A5C]/55">
              <tr>
                <th className="px-3 py-3.5 font-semibold">عنوان</th>
                <th className="hidden px-3 py-3.5 font-semibold sm:table-cell">دسته</th>
                <th className="hidden px-3 py-3.5 font-semibold md:table-cell">نویسنده</th>
                <th className="px-3 py-3.5 font-semibold">وضعیت</th>
                <th className="hidden px-3 py-3.5 font-semibold lg:table-cell">تاریخ</th>
                <th className="hidden px-3 py-3.5 font-semibold xl:table-cell">مطالعه</th>
                <th className="px-3 py-3.5 text-end font-semibold">عملیات</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <BlogTableRow key={post.id} post={post} basePath={basePath} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <ul className="space-y-3 md:hidden" dir="rtl">
        {posts.map((post) => {
          const dateLabel = formatBlogDate(post.publishedAt);
          const canPreview = post.status === "published";
          return (
            <li
              key={post.id}
              className="rounded-[1.35rem] border border-sky-100/80 bg-white/90 p-4 shadow-[0_16px_40px_-36px_rgba(11,58,92,0.3)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <BlogStatusBadge status={post.status} />
                <span className="text-[11px] text-[#0B3A5C]/45">{post.category}</span>
              </div>
              <Link
                href={`${basePath}/${post.id}`}
                className="mt-2 block font-vazirmatn text-base font-bold leading-7 text-[#0B3A5C]"
              >
                {post.title}
              </Link>
              <p className="mt-2 text-xs text-[#0B3A5C]/55">
                {post.author.name}
                {dateLabel ? ` · ${dateLabel}` : ""}
                {` · ${formatReadingTime(post.readingTime)}`}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {canPreview ? (
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B3A5C]/70 ring-1 ring-sky-100"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                    مشاهده
                  </Link>
                ) : null}
                <Link
                  href={`${basePath}/${post.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-[#0B3A5C] ring-1 ring-sky-100"
                >
                  <Pencil className="h-3.5 w-3.5" aria-hidden />
                  ویرایش
                </Link>
                <BlogDeleteButton postId={post.id} title={post.title} />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
