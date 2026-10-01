import Link from "next/link";
import BlogTable from "@/components/blog/admin/BlogTable";
import { getBlogPosts } from "@/data/blog";

export default function AdminBlogPage() {
  const posts = getBlogPosts();

  return (
    <div className="space-y-5 font-vazirmatn" dir="rtl">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-admin-navy">مدیریت مجله</h1>
          <p className="mt-1 text-sm text-slate-500">
            فاز ۱ — فهرست ساختاری روی دادهٔ آزمایشی (بدون API)
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-admin-sky px-4 py-2.5 text-sm font-semibold text-white"
        >
          مقاله جدید
        </Link>
      </div>
      <BlogTable posts={posts} />
    </div>
  );
}
